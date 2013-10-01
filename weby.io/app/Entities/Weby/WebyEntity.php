<?php

namespace App\Entities\Weby;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Lib\UserTrait;
use Webiny\Component\Cache\CacheTrait;
use Webiny\Component\StdLib;

class WebyEntity extends WebyEntityCrud
{

	use AppTrait, UserTrait, CacheTrait;


	/**
	 * Gets Weby in form of an array - used when listing webies (by tag, user, recent etc.)
	 */
	public function toListArray() {
		return [
			'username'       => $this->getUser()->getUsername(),
			'avatarUrl'      => $this->getUser()->getAvatarUrl(),
			'title'          => $this->getTitle(),
			'favoritedCount' => $this->getFavoriteCount(),
			'hitsCount'      => $this->getTotalHits(),
			'publicUrl'      => $this->getPublicUrl(),
			'createdOn'      => date('Y-m-d H:i:s', strtotime($this->getCreatedOn())),
			'images'         => [
				'square'     => $this->getImage('frontend-square')->getUrl(),
				'vertical'   => $this->getImage('frontend-vertical')->getUrl(),
				'horizontal' => $this->getImage('frontend-horizontal')->getUrl()
			]
		];
	}

	public function getSummaryData() {
		$data = $this->cache()->read('weby.json.' . $this->_id);

		if(!$data) {
			$data = [
				'otherFavoriteCount' => $this->getCountOfMoreUsers(),
				'hits'               => $this->getTotalHits(),
				'webyUser'           => [
					'id'        => $this->getUser()->getId(),
					'name'      => $this->getUser()->getUsername(),
					'avatar'    => $this->getUser()->getAvatarUrl(),
					'followers' => $this->getUser()->getFollowingUsersCount()
				],
				'tags'               => $this->getTags(true),
				'shareCount'         => $this->getShareCount()
			];

			$this->cache()->save('weby.json.' . $this->_id, json_encode($data));
		} else {
			$data = json_decode($data, true);
		}

		if($this->user()) {
			$data['currentUser'] = [
				'id'          => $this->user()->getId(),
				'name'        => $this->user()->getFirstName() . ' ' . $this->user()->getLastName()[0] . '.',
				'avatar'      => $this->user()->getAvatarUrl(),
				'isFollowing' => $this->user()->isFollowing($this->getUser())
			];
		} else {
			$data['currentUser'] = false;
		}

		// This must not be cached
		$data['favoritedBy'] = $this->getUsersFavorited(true);
		$data['favoriteCount'] = $this->getFavoriteCount();
		$data['isFavorited'] = $this->inUsersFavorites();


		return json_encode($data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
	}

	public static function getRecentTags($limit = 10) {
		return self::_sqlGetRecentTags($limit);
	}

	/**
	 * Gets all Webies for given user
	 *
	 * @param UserEntity $user
	 *
	 * @return array
	 */
	public static function getAllByUser(UserEntity $user) {
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
	public static function listWebiesByTag($tag, $page, $limit = 9) {
		return self::_sqlGetWebiesByTag($tag, $page, $limit);
	}


    /**
     * Searches database for Webies from given user
     */
    public static function listWebiesBySearch($search, $page, $limit = 9)
    {
        return self::_sqlGetWebiesBySearch($search, $page, $limit);
    }


    /**
     * Searches database for Webies from given user
     */
    public static function listWebiesByUser($user, $page, $limit = 9)
    {
        return self::_sqlGetWebiesByUser($user, $page, $limit);
    }

    /**
     * Searches database for recent Webies
     */
    public static function listRecentWebies($page, $limit = 9)
    {
        return self::_sqlGetRecentWebies($page, $limit);
    }

    /**
     * Searches database for Webies from given user
     */
    public static function listFollowingWebies(UserEntity $user, $page, $limit = 9)
    {
        return self::_sqlGetFollowingWebies($user->getId(), $page, $limit);
    }

    /**
     * Searches for tags (when entering new tag)
     *
     * @param      $search
     * @param bool $json
     * @param bool $addSearchingTag
     *
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
                $data->append(self::arr([
                    'id' => 0,
                    'tag' => $search
                ]));
            }
        }
        if ($data->count()) {
            if ($json) {
                $tmp = [];
                foreach ($data as $tag) {
                    $tmp[] = [
                        'id' => $tag['id'],
                        'tag' => $tag['tag']
                    ];
                }

                return json_encode($tmp);
            }

            return $data;
        }

        return false;
    }

    /**
     * Inserts new tag into table, this DOES NOT bind given tag to Weby
     *
     * @param $tag
     *
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
	 *
	 * @param bool $withoutHost
	 *
	 * @return string
	 */
	public function getPublicUrl($withoutHost = false) {
		$url = $this->getUser()->getUsername() . '/' . $this->getSlug() . '/' . $this->getId() . '/';
		if($withoutHost) {
			return '/' . $url;
		}

		return $this->app()->getConfig()->app->web_path . $url;
	}

    /**
     * Returns WebyEntity object to JSON
     * @return string
     */
    public function toJson()
    {
        return json_encode($this->toArray(),
            JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

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