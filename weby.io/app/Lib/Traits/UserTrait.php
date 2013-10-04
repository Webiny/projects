<?php
namespace App\Lib\Traits;

use App\Lib\User;


/**
 * Enables us to work with current logged user anywhere we want
 * Trait UserTrait
 */
trait UserTrait
{

	/**
	 * @return UserEntity
	 */
	protected static function user() {
		return User::getInstance()->getUser();
	}
}