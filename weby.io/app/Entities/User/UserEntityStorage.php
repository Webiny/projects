<?php
namespace App\Entities\User;

use App\Entities\EntityAbstract;
use App\Lib\DatabaseResult;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

abstract class UserEntityStorage extends EntityAbstract
{
    protected $_id = 0;
    protected $_serviceName = '';
    protected $_email = '';
    protected $_username = '';
    protected $_firstName = '';
    protected $_lastName = '';
    protected $_avatarUrl = '';
    protected $_shareCount = '';
    protected $_onboarding = false;
    protected $_createdOn = '';
    protected $_lastLogin = '';

    /**
     * Saves user into the database with it's service type
     * @return DatabaseResult
     */
    protected function _sqlSave()
    {
        if ($this->_id == 0) {
            $query = "INSERT INTO {$this->_getDb()->w_user} (username, service_name, email, first_name, last_name, avatar_url, created_on, last_login)
                        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW()) RETURNING id";
            $bind = [$this->_username, $this->_serviceName, $this->_email, $this->_firstName, $this->_lastName, $this->_avatarUrl];
            $this->_id = $this->_getDb()->execute($query, $bind)->fetchValue();
            return true;
        }

        $query = "UPDATE {$this->_getDb()->w_user} SET service_name=?, first_name=?, last_name=?, avatar_url=?, last_login=NOW() WHERE id=?";

        $bind = [$this->_serviceName, $this->_firstName, $this->_lastName, $this->_avatarUrl, $this->_id];
        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Loads user
     * @return ArrayObject|bool
     */
    protected function _sqlLoad()
    {
        $query = "SELECT * FROM {$this->_getDb()->w_user} WHERE id=? LIMIT 1";
        $bind = array($this->_id);
        return $this->_getDb()->execute($query, $bind)->fetchArray();
    }

    /**
     * Deletes user
     * @return DatabaseResult
     */
    protected function _sqlDelete()
    {
        $query = "DELETE FROM {$this->_getDb()->w_user} WHERE id=?";
        $bind = array($this->_id);
        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Queries the database for user's favorite Webies
     * @return \ArrayObject|bool
     */
    protected function _sqlGetFavoriteWebies() {
        $query = "SELECT weby, created_on, count(*) OVER() total_count FROM {$this->_getDb()->w_favorite} WHERE \"user\"=?";
        $bind = array($this->_id);
        $res = $this->_getDb()->execute($query, $bind)->fetchAll();
        if($res->count()) {
            self::$_totalRows = $res->first()->key('total_count');
        }
        return $res;

    }

    /**
     * Saves Weby to user's favorite list
     * @param $weby
     * @param $user
     * @internal param $webyId
     * @return DatabaseResult
     */
    protected function _sqlAddToFavorites($weby, $user)
    {
        $query = "INSERT INTO {$this->_getDb()->w_favorite} (\"user\", weby, owner_id, created_on)
                        VALUES (?, ?, ?, NOW())";
        $bind = [$this->_id, $weby, $user];
        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Deletes favorite Weby from database
     * @param $webyId
     * @return bool|ArrayObject
     */
    protected function _sqlDeleteFromFavorites($webyId) {
        $query = "DELETE FROM {$this->_getDb()->w_favorite} WHERE \"user\"=? AND weby=?";
        $bind = array($this->_id, $webyId);
        return $this->_getDb()->execute($query, $bind);
    }

	/**
	 * Queries the database for user based on his service type (fb, g+ etc.) and service registered email
	 *
	 * @param $email
	 *
	 * @return \ArrayObject|bool
	 */
	protected static function _sqlLoadByEmail($email) {
		$query = "SELECT * FROM ".self::_getDb()->w_user." WHERE email=? LIMIT 1";
		$bind = array($email);
		return self::_getDb()->execute($query, $bind)->fetchArray();
	}

    /**
     * Gets all users that this user is following
     * @internal param $webyId
     * @param $limit
     * @return bool|ArrayObject
     */
    protected function _sqlGetFollowingUsers($limit) {
        $query = "SELECT followed_user, count(*) OVER() total_count FROM {$this->_getDb()->w_follow} WHERE \"user\"=? LIMIT {$limit} ";
        $bind = array($this->_id);
        return $this->_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Gets all users that are following this user
     * @internal param $webyId
     * @param $limit
     * @return bool|ArrayObject
     */
    protected function _sqlGetUsersFollowing($limit) {
        $query = "SELECT \"user\", count(*) OVER() total_count FROM {$this->_getDb()->w_follow} WHERE followed_user=? LIMIT {$limit}";
        $bind = array($this->_id);
        return $this->_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Toggles given user from this logged user's follow list
     * @param $id
     */
    protected function _sqlToggleFollowing($id) {
        $query = "SELECT TOGGLE_FOLLOWING(?,?)";
        $bind = array($this->_id, $id);
        $this->_getDb()->execute($query, $bind);
    }

    /**
     * Marks current user - completed onboarding
     * @return DatabaseResult
     */
    protected function _sqlMarkOnboardingDone(){
        $query = "UPDATE ".self::_getDb()->w_user." SET onboarding=1::bit WHERE id=?";
        $bind = array($this->_id);
        return self::_getDb()->execute($query, $bind);
    }

    protected function _sqlCheckIfFollowing($id) {
        $query = "SELECT * FROM {$this->_getDb()->w_follow} WHERE \"user\"=? AND followed_user=? LIMIT 1";
        $bind = array($this->_id, $id);
        return $this->_getDb()->execute($query, $bind)->fetchArray();
    }
}