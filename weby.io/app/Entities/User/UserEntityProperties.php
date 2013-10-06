<?php

namespace App\Entities\User;


use App\Entities\Weby\WebyEntity;

abstract class UserEntityProperties extends UserEntityStorage
{
    /**
     * Favorite Webies of an user (array of WebyEntity objects)
     */
    protected $_favoriteWebies = null;

    /**
     * All users that this user is following
     */
    protected $_followingUsers = null;

    /**
     * All users that are following this user
     */
    protected $_usersFollowing = null;

    /**
     * Count of all users that are following this user
     */
    protected $_usersFollowingCount = null;

    /**
     * Count of all users that this user is following
     */
    protected $_followingUsersCount = null;

    /**
     * @return mixed
     */
    public function getCreatedOn()
    {
        return $this->datetime($this->_createdOn);
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->_email;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->_firstName;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->_lastName;
    }

	/**
	 * Get last login
	 * @return string
	 */
	public function getLastLogin(){
		return $this->_lastLogin;
	}

	/**
	 * Get number of user logins
	 * @return int
	 */
	public function getLoginCount(){
		return $this->_signinCount;
	}

    /**
     * @return string
     */
    public function getAvatarUrl()
    {
        return $this->_avatarUrl;
    }

    /**
     * @return string
     */
    public function getServiceName()
    {
        return $this->_serviceName;
    }

    /**
     * @return string
     */
    public function getServiceUserId()
    {
        return $this->_serviceUserId;
    }


    /**
     * @return string
     */
    public function getUsername()
    {
        return $this->_username;
    }

    public function getLoginIp(){
        return $this->_loginIp;
    }

    public function getGeoData(){
        return is_string($this->_geoData) ? json_decode($this->_geoData, true) : $this->_geoData;
    }

    /**
     * Checks if user has completed onboarding process
     * @return bool
     */
    public function completedOnboarding()
    {
        return $this->_onboarding;
    }
}