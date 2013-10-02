<?php

namespace App\Handlers;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use App\HelperTrait;
use App\Lib\AbstractHandler;
use App\Lib\Stats\Stats;
use App\Lib\UserTrait;
use App\Lib\View;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Security\Authentication\Providers\Http\Http;
use Webiny\Component\Security\SecurityTrait;

class PagesHandler extends AbstractHandler
{
    use SecurityTrait, HttpTrait, AppTrait, UserTrait, HelperTrait;

    /**
     * Limit when showing lists pages (depends on used layout)
     * @var int
     */
    private $_listLimit = 9;

    /**
     * Used to show homepage (login options)
     */
    public function index()
    {
        $user = $this->security()->getUser();
        if ($user && $user->isAuthenticated() && $this->user()) {
            $this->request()->redirect($this->user()->getProfileUrl());
        }
    }

	/**
	 * Used for viewing Weby pages (public area)
	 * @param $user
	 * @param $slug
	 * @param $id
	 */
	public function viewWeby($user, $slug, $id)
	{
		// Try to load Weby
		$weby = new WebyEntity();
		$weby->load($id);

		if(!$weby->getId() || $weby->isDeleted()){
			header("HTTP/1.0 404 Not Found");
			$this->recentTags = WebyEntity::getRecentTags(10);
			$this->setTemplate('page404');
			return;
		}

		// Will check if requested Weby and URL params are valid
		$this->_checkRequest($weby, $user, $slug, $id);

		// Assign whole weby to $this, so we can pass it to view
		$this->weby = $weby;
		$this->shareCount = $weby->getShareCount();

		$this->setTemplate('weby');
		Stats::getInstance()->updateWebyHits($weby);
	}

	/**
	 * Used for viewing Weby pages (public area)
	 * @param $user
	 * @param $slug
	 * @param $id
	 */
	public function viewWebyEmbed($user, $slug, $id)
	{
		// Try to load Weby
		$weby = new WebyEntity();
		$weby->load($id);

		// Will check if requested Weby and URL params are valid
		$this->_checkRequest($weby, $user, $slug, $id);

		// Assign whole weby to $this, so we can pass it to view
		$this->weby = $weby;
		$this->shareCount = $weby->getShareCount();
		$this->setTemplate('embed');
		Stats::getInstance()->updateWebyHits($weby);
	}

    /**
     * Lists Webies from certain user
     * @param int $page
     */
    public function listRecentWebies($page = 1)
    {
        $data = WebyEntity::listRecentWebies($page, $this->_listLimit);
        $this->_listWebies($data, $page);
    }

    /**
     * Lists Webies from users that this user is following
     * @param int $page
     */
    public function listFollowingWebies($page = 1)
    {
        if (!$this->user()) {
            $cfg = $this->app()->getConfig()->app;
            $this->request()->redirect($cfg->web_path, 404);
        }
        $data = WebyEntity::listFollowingWebies($this->user(), $page, $this->_listLimit);
        $this->_listWebies($data, $page);
    }

    /**
     * Lists Webies by username
     * @param $username
     * @param int $page
     * @internal param $userId
     */
    public function listWebiesByUser($username, $page = 1)
    {
        $this->searchValue = $username;

        $webyUser = UserEntity::getByUsername($username);
        $this->user = $webyUser;
        if (!$webyUser) {
            $this->page = 1;
            $this->html = View::getInstance()->fetch('templates/pages/includes/smartyListEmpty.tpl');
        } else {
            $data = WebyEntity::listWebiesByUser($username, $page, $this->_listLimit);
            $this->_listWebies($data, $page);
        }
    }

    /**
     * Lists Webies by tag
     * @param $slug             All searches are made not by tag directly, it's done by slug
     * @param int $page
     * @internal param $userId
     */
    public function listWebiesByTag($slug, $page = 1)
    {
        $data = WebyEntity::listWebiesByTag($slug, $page, $this->_listLimit);
        $this->_listWebies($data, $page);
        $this->searchValue = $slug;
    }

    /**
     * Lists Webies by user's search
     * @param $search
     * @param int $page
     * @internal param \App\Handlers\All $slug searches are made not by tag directly, it's done by slug
     * @internal param $userId
     */
    public function listWebiesBySearch($search, $page = 1)
    {
        $data = WebyEntity::listWebiesBySearch($search, $page, $this->_listLimit);
        $this->_listWebies($data, $page);
        $this->searchValue = $search;
    }

    public function page404()
    {
        $this->recentTags = WebyEntity::getRecentTags(10);
        header("HTTP/1.0 404 Not Found");
    }

    public function about()
    {
    }

    public function termsOfService()
    {
        $this->recentTags = WebyEntity::getRecentTags(10);
    }

    public function privacyPolicy()
    {
        $this->recentTags = WebyEntity::getRecentTags(10);
    }

    /**
     * Gets Webies for listing
     * @param $result
     * @param int $page         Number of page
     * @internal param \App\Handlers\ID $user of tag
     * @internal param $json
     */
    private function _listWebies($result, $page = 1)
    {
        $json = $this->request()->post('json');
        $data['webies'] = [];
        $data['count'] = 0;
        $data['pagination'] = '';
        $data['page'] = $this->page = $page;

        if ($result->count()) {
            $data['count'] = $result->count();

            $data['count'] = $result[0]['total_count'];
            $data['pagination'] = $this->_getNavigation($data['count'], $page, $this->_listLimit);
            $data['webPath'] = $this->app()->getConfig()->app->web_path;
            foreach ($result as $w) {
                $weby = new WebyEntity();
                $weby->load($w['id']);
                $data['webies'][] = $weby->toListArray();
            }

            // If json is set to true, then just output json (for ajax requests)
            if ($json) {
                $this->ajaxResponse(false, '', $data);
            } else {
                $data['tplId'] = rand(1, 5);
                $this->html = View::getInstance()->fetch('templates/pages/includes/smartyListBox.tpl', $data);
            }
        } else {
            // If json is set to true, then just output json (for ajax requests)
            if ($json) {
                $this->ajaxResponse(false, '', $data);
            } else {
                $this->html = View::getInstance()->fetch('templates/pages/includes/smartyListEmpty.tpl');
            }
        }
    }

    /**
     * Used for checking request, if user has edited a URL, we will automatically redirect them to correct one
	 *
     * @param $weby WebyEntity
     * @param $user String
     * @param $slug String
     * @param $id String
     */
    private function _checkRequest($weby, $user, $slug, $id)
    {
        // We will need config for latter use of paths
        $cfg = $this->app()->getConfig()->app;

        // If Weby was created by a valid user, that means given Weby ID was okay, else redirect to 404 page
        if (!$weby->getUser()->getEmail()) {
            $this->request()->redirect($cfg->web_path, 404);
        }

        // If user edited username or title, redirect him to proper URL via 301 header data
        if ($weby->getSlug() != $slug || $weby->getUser()->getUsername() != $user) {
            $url = $cfg->web_path . $weby->getUser()->getUsername() . '/' . $weby->getSlug() . '/' . $id . '/';
            if ($this->request()->query('embed', false)) {
                $url .= '?embed=true';
            }
            $this->request()->redirect($url, 301);
        }
    }

}