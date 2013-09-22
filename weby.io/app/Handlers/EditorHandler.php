<?php

namespace App\Handlers;

use App\AppTrait;
use App\Entities\Favorite\FavoriteEntity;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use App\Lib\DatabaseTrait;
use App\Lib\AbstractHandler;
use App\Lib\Screenshot\ScreenshotQueue;
use App\Lib\Stats\Stats;
use App\Lib\UserTrait;
use App\Lib\View;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Logger\LoggerTrait;
use Webiny\Component\Security\Authentication\Providers\Http\Http;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\Directory\LocalDirectory;
use Webiny\Component\Storage\File\LocalFile;
use Webiny\Component\Storage\StorageTrait;

class EditorHandler extends AbstractHandler
{
    use AppTrait, StdLibTrait, DatabaseTrait, SecurityTrait, HttpTrait, UserTrait, StorageTrait, LoggerTrait;

    /**
     * @var WebyEntity
     */
    private $_weby = null;

    public function create()
    {
        $weby = new WebyEntity();
        $weby->setUser($this->user())->save();

        // Update stats
        Stats::getInstance()->updateWebiesStats($this->user());

        // Redirect to newly created Weby
        $this->request()->redirect($weby->getEditorUrl());
    }

    public function save()
    {
        $requestData = $this->request()->post();
        // Create new Weby entity, populate it and save into database
        $weby = new WebyEntity();

        // Get ID of existing Weby and load
        $id = $requestData['id'];
        if ($id) {
            $weby->load($id);
            // TODO: check if weby belongs to this user
        }

        // Before populating, insert necessary new tags into database
        if (isset($requestData['tags'])) {
            foreach ($requestData['tags'] as &$tag) {
                // If tag wasn't in database, insert it
                if ($tag['id'] == 0) {
                    $this->_sanitizeInput($tag['tag'], true);
                    $tag['id'] = WebyEntity::insertTag($tag['tag']);
                }
            }
        }

        // Sanitize title and description
        $this->_sanitizeInput($requestData['title']);
        $this->_sanitizeInput($requestData['description']);

        // Now proceed with saving Weby
        $weby->populate($requestData);
        $weby->setUser($this->user())->save();

        // Add to screenshot queue if requested
        /*if ($this->request()->post('takeScreenshot', false)) {
            $queue = new ScreenshotQueue();
            $queue->add($id)->processQueue();
        }*/

        // If there were changes in widgets, then update widget counts stats
        if (isset($requestData['counter'])) {
            Stats::getInstance()->updateWidgetsCount($requestData['counter']);
        }

        $data = [
            'time' => date('H:i:s'),
            'title' => $weby->getTitle(),
            'description' => $weby->getDescription(),
            'publicUrl' => $weby->getPublicUrl(),
            'tags' => $weby->getTags()
        ];
        $this->ajaxResponse(false, 'Weby saved!', $data);
    }

    /**
     * Routes user to appropriate handler (loading Weby, redirecting to correct URL...)
     * @param $userName
     * @param null $webyId
     */
    public function route($userName, $webyId = null)
    {
        if (!$this->user()) {
            $this->request()->redirect($this->app()->getConfig()->app->web_path);
        }
        // If username doesn't match - redirect to correct user area
        if ($userName != $this->user()->getUsername()) {
            if ($this->user()->getId()) {
                $this->request()->redirect($this->user()->getProfileUrl());
            }
            $this->request()->redirect($this->app()->getConfig()->app->web_path);
        }

        // Check if weby exists
        if ($webyId != null) {
            $this->_weby = new WebyEntity();
            $this->_weby->load($webyId);

            if (!$this->_weby->getId()) {
                $this->request()->redirect($this->user()->getProfileUrl());
            }

            if ($this->_weby->getUser()->getId() != $this->user()->getId()) {
                $this->request()->redirect($this->user()->getProfileUrl());
            }
        }

        // Load Weby in editor
        $this->_editor();
    }

    public function uploadImage()
    {
        $webyId = $this->request()->query('weby');
        $file = $this->request()->files('background-image');

        if (!$file->asFileObject()->isImage()) {
            $this->ajaxResponse(true, 'Given file type is not allowed!');
        }

        $weby = new WebyEntity();
        $weby->load($webyId);

        $ext = $this->str($file->getName())->explode('.')->last();
        $key = $weby->getStorageFolder() . '/background-' . time() . '.' . $ext;
        $webyFile = new LocalFile($key, $this->storage('local'));
        if ($webyFile->setContents($file->asFileObject()->getFileContent()) !== false) {
            $weby->getImage('background')->setKey($key)->save();
        }
        die(json_encode(['url' => $webyFile->getUrl()]));
    }

    private function _removeImage($webyId)
    {
        $userDir = new LocalDirectory($this->user()->getUsername(), $this->storage('local'));
        foreach ($userDir->filter($webyId . '-background*') as $file) {
            $file->delete();
        }
    }

    /**
     * Shows Weby editor
     */
    private function _editor()
    {
        if ($this->_weby == null) {
            $this->setTemplate('dashboard');
            return;
        }
        $this->weby = $this->_weby;
        $validators = $this->app()->getConfig()->app->content_validators->toArray(true);
        $vIndex = rand(0, $validators->count() - 1);
        $this->contentValidator = $validators[$vIndex];
        $this->setTemplate('index');
    }
}
