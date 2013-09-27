<?php

namespace App\Entities\Weby;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Lib\UserTrait;
use Webiny\Component\StdLib;

class WebyEntity extends WebyEntityCrud
{

    use AppTrait, UserTrait;


    /**
     * Gets Weby in form of an array - used when listing webies (by tag, user, recent etc.)
     */
    public function toListArray()
    {
        return [
            'username' => $this->getUser()->getUsername(),
            'avatarUrl' => $this->getUser()->getAvatarUrl(),
            'title' => $this->getTitle(),
            'favoritedCount' => $this->getFavoriteCount(),
            'hitsCount' => $this->getTotalHits(),
            'publicUrl' => $this->getPublicUrl(),
            'createdOn' => $this->getCreatedOn(),
            'images' => [
                'square' => $this->getImage('frontend-square')->getUrl(),
                'vertical' => $this->getImage('frontend-vertical')->getUrl(),
                'horizontal' => $this->getImage('frontend-horizontal')->getUrl()
            ]
        ];
    }

    /**
     * Gets all Webies for given user
     *
     * @param UserEntity $user
     *
     * @return array
     */
    public static function getAllByUser(UserEntity $user)
    {
        $webies = self::_sqlLoadByUser($user);
        $tmp = [];
        foreach ($webies as $wId) {
            $weby = new WebyEntity();
            $tmp[] = $weby->load($wId);
        }

        return $tmp;
    }

    /**
     * Searches database for Webies with given single tag attached
     */
    public static function listWebiesByTag($tag, $page, $limit = 9)
    {
        return self::_sqlGetWebiesByTag($tag, $page, $limit);
    }

    /**
     * Searches database for Webies from given user
     */
    public static function listWebiesByUser($user, $page, $limit = 9)
    {
        return self::_sqlGetWebiesByUser($user, $page, $limit);
    }

    /**
     * Searches database for Webies from given user
     */
    public static function listRecentWebies($userId, $page, $limit = 9)
    {
        return self::_sqlGetRecentWebies($userId, $page, $limit);
    }

    /**
     * Searches database for Webies from given user
     */
    public static function listFollowingWebies($page, $limit = 9)
    {
        return self::_sqlGetFollowingWebies($page, $limit);
    }

    /**
     * Searches for tags (when entering new tag)
     * @param $search
     * @param bool $json
     * @param bool $addSearchingTag
     * @return bool|\Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     */
    public static function searchTags($search, $json = false, $addSearchingTag = false)
    {
        $data = self::_sqlSearchTags($search);
        $found = false;

        foreach ($data as $array) {
            if ($array['tag'] == $search) {
                $found = true;
                break;
            }
        }
        if ($addSearchingTag && !$found) {
            if (!$data->inArray($search)) {
                $data->append(self::arr(['id' => 0, 'tag' => $search]));
            }
        }
        if ($data->count()) {
            if ($json) {
                $tmp = [];
                foreach ($data as $tag) {
                    $tmp[] = ['id' => $tag['id'], 'tag' => $tag['tag']];
                }
                return json_encode($tmp);
            }
            return $data;
        }
        return false;
    }

    /**
     * Inserts new tag into table, this DOES NOT bind given tag to Weby
     * @param $tag
     * @return bool|Mixed
     */
    public static function insertTag($tag)
    {
        return self::_sqlInsertTag($tag);
    }

    /**
     * Check if this Weby it in current user's favorites list
     * @return bool
     */
    public function inUsersFavorites()
    {
        if ($this->user()) {
            return $this->user()->inFavorites($this);
        }
        return false;
    }

    /**
     * Generates full editor URL for this Weby
     * @return string
     */
    public function getEditorUrl()
    {
        return $this->app()->getConfig()->app->web_path . $this->getUser()->getUsername() . '/' . $this->getId() . '/';
    }

    /**
     * Generates full public URL for this Weby
     * @return string
     */
    public function getPublicUrl()
    {
        return $this->app()->getConfig()->app->web_path . $this->getUser()
            ->getUsername() . '/' . $this->getSlug() . '/' . $this->getId() . '/';
    }


    /**
     * Returns WebyEntity object to JSON
     * @return string
     */
    public function toJson()
    {
        return json_encode($this->toArray(), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

    }

    /**
     * Gets share counts for every social service (Facebook, Google, Twitter)
     * @return Array Array with keys [facebook], [google] & [twitter], and counts as values
     */
    public function getShareCount()
    {
        // First, try to get data from cache or social service
        $social = SocialData::getInstance();
        $data = $social->getAllShareCount($this);

        // If that didn't succeed for some reason, return database data
        return $data ? $data : unserialize($this->_shareCount);

    }

    /**
     * @param $tag
     *
     * @return WebyImage
     * @throws \Exception
     */
    public function getImage($tag)
    {
        if ($this->_images->keyExists($tag)) {
            return $this->_images->key($tag);
        }
        $this->_images[$tag] = new WebyImage($this->_id, $tag);
        return $this->_images[$tag];
    }

    /**
     * Returns WebyEntity object to array
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->_id,
            'username' => $this->getUser()->getUsername(),
            'avatar' => $this->getUser()->getAvatarUrl(),
            'title' => $this->_title,
            'description' => $this->_description,
            'slug' => $this->_slug,
            'publicUrl' => $this->getPublicUrl(),
            'metaFollow' => $this->getMetaFollow(),
            'tags' => $this->getTags(true),
            'content' => $this->_content,
            'settings' => $this->_settings,
            'share' => $this->getShareCount()
        ];
    }

}