<?php

namespace App\Entities\User;

use App\AppTrait;
use App\Entities\Weby\WebyEntity;
use Webiny\Component\Security\SecurityTrait;
use Webiny\Component\StdLib\StdLibTrait;

class UserEntity extends UserEntityCrud
{
    use StdLibTrait, AppTrait;

    /**
     * Generates username from given email (removes dots from email and everything after @ sign)
     *
     * @param $email
     *
     * @return String
     */
    public static function generateUsername($email)
    {
        $username = self::str($email)->explode('@');
        $username = $username->first()->replace('.', '')->val();
        $count = 1;
        $finalUsername = $username;
        while (self::_sqlCheckUsernameExists($finalUsername)) {
            $count++;
            $finalUsername = $username . '.' . $count;
        }
        return $finalUsername;
    }

    /**
     * Gets user from database based on his profile email
     * @param String $email             E-mail which was registered on service
     * @return UserEntityCrud $this     Instance of User
     */
    public static function getByEmail($email)
    {
        $user = new static;
        $data = self::_sqlLoadByEmail($email);
        if (!$data) {
            return false;
        }
        return $user->populate($data);
    }

    /**
     * Searches user by username and returns an UserEntity object
     * @param $username
     * @return UserEntity|bool
     */
    public static function getByUsername($username) {
        $userId = self::_sqlLoadByUsername($username);
        if ($userId) {
            $user = new UserEntity();
            $user->load($userId);
            return $user;
        } else {
            return false;
        }
    }

    /**
     * Marks user - completed onboarding
     */
    public function markOnboardingDone()
    {
        $this->_sqlMarkOnboardingDone();
    }

    /**
     * Used by Wordpress widget (when searching Webies by tags)
     * @param bool $json
     * @return array|string
     */
    public function getWebies($json = false)
    {
        $webies = WebyEntity::getAllByUser($this);

        if ($json) {
            $tmp = [];
            foreach ($webies as $weby) {
                /**@var $weby \App\Entities\Weby\WebyEntity */
                $tmp[] = [
                    'id' => $weby->getId(),
                    'thumbnail' => $weby->getImage('dashboard')->getUrl(),
                    'title' => $weby->getTitle(),
                    'slug' => $weby->getSlug(),
                    'modified_on' => date('Y-m-d H:i:s', strtotime($weby->getModifiedOn())),
                    'public_url' => $weby->getPublicUrl(),
                    'editor_url' => $weby->getEditorUrl(),
                    'hits' => $weby->getTotalHits(),
                    'favorites' => $weby->getFavoriteCount(),
                    'tags' => $weby->getTags(true),
                ];
            }
            $webies = json_encode($tmp);
        }
        return $webies;
    }


    public function getProfileUrl()
    {
        return $this->app()->getConfig()->app->web_path . $this->getUsername() . '/';
    }

    /**
     * Returns favorite Webies, default is array of objects, but can be set to JSON via parameter(true)
     * @param bool $json
     * @return array|null|string
     */
    public function getFavoriteWebies($json = false)
    {
        // Check to see if we already have loaded all favorites
        if (is_null($this->_favoriteWebies)) {
            $this->_favoriteWebies = $this->arr();
            $favorites = $this->_sqlGetFavoriteWebies();
            $weby = new WebyEntity();
            foreach ($favorites as $data) {
                if ($weby->load($data['weby'])) {
                    $weby->setAddedToFavoritesTime($data['created_on']);
                    $this->_favoriteWebies[$data['weby']] = clone $weby;
                }
            }
        }

        // If JSON was true, then we have to convert all objects to JSON and return that
        if ($json) {
            $tmp = [];
            foreach ($this->_favoriteWebies as $weby) {
                /**@var $weby \App\Entities\Weby\WebyEntity */
                $tmp[] = [
                    'id' => $weby->getId(),
                    'thumbnail' => $weby->getImage('dashboard')->getUrl(),
                    'title' => $weby->getTitle(),
                    'slug' => $weby->getSlug(),
                    'public_url' => $weby->getPublicUrl(),
                    'hits' => $weby->getTotalHits(),
                    'favorites' => $weby->getFavoriteCount(),
                    'addedToFavoritesTime' => $weby->getAddedToFavoritesTime(),
                    'tags' => $weby->getTags(true),
                ];
            }
            return json_encode($tmp);
        }

        return $this->_favoriteWebies;
    }

    /**
     * Check if given Weby is in user's favorites list
     * @param WebyEntity $weby
     * @return bool
     */
    public function inFavorites(WebyEntity $weby)
    {
        return $this->getFavoriteWebies()->keyExists($weby->getId());
    }

    /**
     * Delete given Weby from user's favorites list
     * @param \App\Entities\Weby\WebyEntity $weby
     * @param WebyEntity $weby
     */
    public function deleteFromFavorites(WebyEntity $weby)
    {
        if (isset($this->_favoriteWebies[$weby->getId()])) {
            $this->_sqlDeleteFromFavorites($weby->getId());
            unset($this->_favoriteWebies[$weby->getId()]);
        }
    }

    /**
     * Adds given Weby to user's favorites list
     * @param WebyEntity $weby
     */
    public function addToFavorites(WebyEntity $weby)
    {
        $this->_sqlAddToFavorites($weby->getId(), $weby->getUser()->getId());
    }

    /**
     * Toggle following of other users
     * @param UserEntity $user
     */
    public function toggleFollowing(UserEntity $user)
    {
        $this->_sqlToggleFollowing($user->getId());
    }

    /**
     * Gets all users that are following this user
     */
    public function getUsersFollowing($limit = 5)
    {
        if (is_null($this->_usersFollowing)) {
            $data = $this->_sqlGetUsersFollowing($limit);
            $this->_usersFollowing = [];
            $this->_usersFollowingCount = 0;
            if ($data->count()) {
                $this->_usersFollowingCount = $data[0]['total_count'];
                $tmp = [];
                $user = new UserEntity();
                foreach ($data as $u) {
                    $user->load($u['user']);
                    $tmp[$u['user']] = clone $user;
                }
                $this->_usersFollowing = $tmp;
            }
        }

        return $this->_followingUsers;
    }

    /**
     * Gets total count of users that are following this user
     */
    public function getUsersFollowingCount($limit = 5)
    {
        $this->getUsersFollowing($limit);
        return $this->_usersFollowingCount;
    }

    /**
     * Gets all users that this user is following
     */
    public function getFollowingUsers($limit = 5)
    {
        if (is_null($this->_usersFollowing)) {
            $data = $this->_sqlGetFollowingUsers($limit);
            $this->_followingUsers = [];
            $this->_followingUsersCount = 0;
            if ($data->count()) {
                $this->_usersFollowingCount = $data[0]['total_count'];
                $tmp = [];
                $user = new UserEntity();
                foreach ($data as $u) {
                    $this->load($u['followed_user']);
                    $tmp[$u['followed_user']] = clone $user;
                }
                $this->_usersFollowing = $tmp;
            }
        }

        return $this->_followingUsers;
    }

    /**
     * Gets total count of users that this user is following
     */
    public function getFollowingUsersCount($limit = 5)
    {
        $this->getUsersFollowing($limit);
        return $this->_usersFollowingCount;
    }

    /**
     * Check if this user is following given user
     */
    public function isFollowing(UserEntity $user)
    {
        return (bool)$this->_sqlCheckIfFollowing($user->_id);
    }

}