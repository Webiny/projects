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
        $parts = self::str($email)->explode('@');
        return $parts->first()->replace('.', '')->val();
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
                    'thumbnail' => 'http://graph.facebook.com/1594713365/picture?type=large',
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
     * Checks if user is following given user
     */
    public function isFollowing(UserEntity $user)
    {
        $this->getFollowingUsers();
        return $this->arr($this->_followingUsers)->inArray($user->getId()) ? true : false;
    }

    /**
     * Follow user
     */
    public function follow(UserEntity $user)
    {
        $this->_sqlFollowUser($user->getId());
    }

    /**
     * Unfollow user
     */
    public function unfollow(UserEntity $user)
    {
        $this->_sqlUnfollowUser($user->getId());
    }

    /**
     * Gets all users that this user is following
     */
    public function getFollowingUsers($objects = false)
    {
        if (is_null($this->_followingUsers)) {
            $this->_followingUsers = $this->_sqlGetFollowingUsers();
        }

        if ($objects) {
            if ($this->_followingUsers->count()) {
                $user = new UserEntity();
                $tmp = [];
                foreach ($this->_followingUsers as $id) {
                    $user->load($id);
                    $tmp[] = clone $user;
                }
                $this->_followingUsers = $tmp;
            }
        }

        return $this->_followingUsers;
    }

    /**
     * Gets count of users that are following this user
     * @return int
     */
    public function getFollowingUsersCount() {
        return $this->arr($this->getFollowingUsers())->count();
    }
}