<?php
namespace App\Lib\Traits;

use App\Lib\Helper;

/**
 * Trait HelperTrait
 * Enables us to work with Helper class
 */
trait HelperTrait{

    /**
     * @return Helper
     */
    protected static function helper(){
        return Helper::getInstance();
    }
}