<?php

namespace App\Entities\Weby;


use App\Entities\User\ServiceType;
use App\Entities\User\UserEntity;

abstract class WebyEntityProperties extends WebyEntityStorage
{

	/**
	 * Total count of times somebody put this Weby to his favorite's list
	 */
	protected $_favoriteCount = 0;

	/**
	 * Here we can store the time when this Weby was added to favorites (used by users favorites section, when
	 * opening his favorites dialog, then he can see when he added something to his favorites list)
	 * This variable is always empty, except if Weby is request via \App\Entities\User\UserEntity->getFavoriteWebies();
	 */
	protected $_addedToFavoritesTime = '';

	/**
	 * This stores all users that have put this Weby to their favorite lists
	 */
	protected $_usersFavorited = null;

	/**
	 * @return int
	 */
	public function getSlug() {
		return $this->_slug;
	}

	/**
	 * Holds array of widget objects
	 * @var array
	 */
	protected $_widgets = array();

	/**
	 * Returns array of Widget objects
	 * @return array
	 */
	public function getWidgets() {
		return $this->_widgets;
	}

	/**
	 * @return string
	 */
	public function getContent() {
		return $this->_content;
	}

	/**
	 * @return string
	 */
	public function getSettings() {
		return $this->_settings;
	}

	/**
	 * @return string
	 */
	public function getCreatedOn() {
		return $this->_createdOn;
	}

	/**
	 * @return int
	 */
	public function getId() {
		return $this->_id;
	}

	/**
	 * @return string
	 */
	public function getModifiedOn() {
		return $this->_modifiedOn;
	}

	/**
	 * @return string
	 */
	public function getTitle() {
		return $this->_title == '' ? 'Untitled' : $this->_title;
	}

	/**
	 * @return string
	 */
	public function getDescription() {
		return $this->_description;
	}

	/**
	 * Returns tags in array or JSON form
	 *
	 * @param bool $rawArray
	 *
	 * @return string
	 */
	public function getTags($rawArray = false) {
		if($rawArray) {
			$tmp = [];
			foreach ($this->_tags as $tag) {
				$tmp[] = [
					'id'   => $tag['id'],
				  	'tag'  => $tag['tag'],
				  	'slug' => $tag['slug']
				];
			}

			return $tmp;
		}

		return $this->_tags;
	}

	/**
	 * Returns tags in array or JSON form
	 * @internal param bool $rawArray
	 * @return string
	 */
	public function getNumberOfTags() {
		return $this->_tags->count();
	}

	/**
	 * @return string
	 */
	public function getStorageFolder() {
		return $this->_storage;
	}

	/**
	 * @return UserEntity
	 */
	public function getUser() {
		if(!$this->_user instanceof UserEntity) {
			$user = new UserEntity();
			$this->_user = $user->load($this->_user);
		}

		return $this->_user;
	}

	/**
	 * Is Weby deleted?
	 * @return bool
	 */
	public function isDeleted(){
		return (bool) $this->_deleted;
	}

	/**
	 * Returns all users that put this Weby into their favorites list
	 *
	 * @param bool $raw         Returns native array
	 * @param int  $limit
	 *
	 * @return array|null
	 */
	public function getUsersFavorited($raw = false, $limit = 8) {
		if(is_null($this->_usersFavorited)) {
			$this->_usersFavorited = [];
			$users = $this->_sqlGetUsersFavorited($limit);
			if($users->count()) {
				$user = new UserEntity();
				$tmp = [];
				$this->_favoriteCount = $users[0]['total_count'];
				foreach ($users as $u) {
					$user->load($u['user']);
					$tmp[] = clone $user;
				}
				$this->_usersFavorited = $tmp;
			}
		}
		if($raw) {
			$tmp = [];
			foreach ($this->_usersFavorited as $u) {
				$tmp[] = [
					'id'        => $u['id'],
					'username'  => $u['username'],
					'avatarUrl' => $u['avatarUrl']
				];
			}

			return $tmp;
		}

		return $this->_usersFavorited;
	}


	/**
	 * @return null
	 */
	public function getHits() {
		return $this->_hits;
	}

	/**
	 * @return null
	 */
	public function getHitsEmbedded() {
		return $this->_hitsEmbedded;
	}

	/**
	 * Gets total hits of Weby
	 * @return int
	 */
	public function getTotalHits() {
		return $this->_hits + $this->_hitsEmbedded;
	}

	/**
	 * Returns count of total times this Weby was put on someone's favorites list
	 * @return bool|Mixed|null
	 */
	public function getFavoriteCount() {
		if(!$this->_favoriteCount) {
			$this->getUsersFavorited();
		}

		return $this->_favoriteCount;
	}

	/**
	 * This just outputs "and x more users..." message (on frontend, Weby details bar)
	 */
	public function getCountOfMoreUsers() {
		return $this->_favoriteCount - count($this->_usersFavorited);
	}

	/**
	 * Gets the time at which this Weby was added to someone's favorites list
	 * @return mixed
	 */
	public function getAddedToFavoritesTime() {
		return $this->_addedToFavoritesTime;
	}

	/**
	 * Based on status of Weby, this flag can make Weby not available to the search engines by
	 * putting meta data in the head of Weby page (robots => nofollow, noindex)
	 * @return mixed
	 */
	public function getMetaFollow() {
		return $this->_metaFollow;
	}

	/**
	 * @param \App\Entities\User\UserEntity $user
	 *
	 * @return $this
	 */
	public function setUser(UserEntity $user) {
		$this->_user = $user;

		return $this;
	}

	/**
	 * Sets new sharing counts data
	 *
	 * @param $counts
	 *
	 * @return $this
	 */
	public function setShareCount($counts) {
		$this->_shareCount = is_array($counts) ? serialize($counts) : $counts;

		return $this;
	}

	/**
	 * Sets the time when this Weby was added to favorites (used by Favorites section)
	 *
	 * @param $time
	 *
	 * @return $this
	 */
	public function setAddedToFavoritesTime($time) {
		$this->_addedToFavoritesTime = $time;

		return $this;
	}

}