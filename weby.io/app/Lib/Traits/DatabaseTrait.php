<?php
namespace App\Lib\Traits;


use App\Lib\Database;

trait DatabaseTrait {

	/**
	 * Get database instance
	 * @return Database
	 */
	protected static function db(){
		return Database::getInstance();
	}

}