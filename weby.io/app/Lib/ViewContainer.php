<?php

namespace App\Lib;

use App\AppTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Http\Request;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\SingletonTrait;
use App\Lib\Traits\UserTrait;

class ViewContainer implements \ArrayAccess
{
    use SingletonTrait, AppTrait, HttpTrait, SecurityTrait, UserTrait;

    public $webPath;
    public $absPath;
    public $editorPath;
    public $themeAbsPath;
    public $themeWebPath;
    public $storageAbsPath;
    public $storageWebPath;

    // User's data
    public $user;

    /**
     * Initializes view container object with needed data
     */
    public function init()
    {

        // Get path configurations from config object and assign them for further use in templates
        $appCfg = $this->app()->getConfig()->app;

        // Get site's paths
        $this->webPath = $appCfg->web_path;
        $this->absPath = $appCfg->abs_path;
        $this->editorPath = $appCfg->editor_path;
        $this->themeAbsPath = $appCfg->theme_abs_path;
        $this->themeWebPath = $appCfg->theme_web_path;
        $this->storageAbsPath = $appCfg->storage_abs_path;
        $this->storageWebPath = $appCfg->storage_web_path;

        // Used for defining Webies search NODE JS URL (quicker searching)
        $webySearchers = $this->app()->getConfig()->app->weby_searchers->toArray(true);
        $rIndex = rand(0, $webySearchers->count() - 1);
        $this->webySearcher = $webySearchers[$rIndex];

        $this->mode = $appCfg->mode;

        // Get current user
        $this->_getUserData();
    }

    /**
     * If user is logged, this will collect all important user data so we can use it in our templates
     */
    private function _getUserData()
    {
        if ($this->security()->getUser() && $this->security()->getUser()->isAuthenticated()) {
            $this->user = $this->user();
        }
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Whether a offset exists
     * @link http://php.net/manual/en/arrayaccess.offsetexists.php
     * @param mixed $offset <p>
     * An offset to check for.
     * </p>
     * @return boolean true on success or false on failure.
     * </p>
     * <p>
     * The return value will be casted to boolean if non-boolean was returned.
     */
    public function offsetExists($offset)
    {
        return isset($this->{$offset});
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Offset to retrieve
     * @link http://php.net/manual/en/arrayaccess.offsetget.php
     * @param mixed $offset <p>
     * The offset to retrieve.
     * </p>
     * @return mixed Can return all value types.
     */
    public function offsetGet($offset)
    {
        return $this->{$offset};
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Offset to set
     * @link http://php.net/manual/en/arrayaccess.offsetset.php
     * @param mixed $offset <p>
     * The offset to assign the value to.
     * </p>
     * @param mixed $value <p>
     * The value to set.
     * </p>
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        $this->{$offset} = $value;
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Offset to unset
     * @link http://php.net/manual/en/arrayaccess.offsetunset.php
     * @param mixed $offset <p>
     * The offset to unset.
     * </p>
     * @return void
     */
    public function offsetUnset($offset)
    {
        unset($this->{$offset});
    }
}