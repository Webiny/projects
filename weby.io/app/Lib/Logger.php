<?php
namespace App\Lib;
use Webiny\Component\StdLib\SingletonTrait;
use App\Lib\Traits\DatabaseTrait;

/**
 * This class is used when an error occures while user is using our site
 * JS side of code will automatically make an AJAX requst to logError handler
 * Class Logger
 * @package App\Lib
 */
class Logger
{
    use DatabaseTrait, SingletonTrait;

    /**
     * Logs(saves) an error into database for further reviewing
     * @param $message
     * @param string $url
     * @param int $line
     * @param string $browser
     * @return DatabaseResult
     */
    public function logError($message, $url = '', $line = 0, $browser = '')
    {
        $errorId = md5($message . $url . $line . $browser);
        return $this->_sqlSave($errorId, $message, $url, $line, $browser);
    }

    /**
     * SQL for saving error into the database
     * @param $errorId
     * @param $message
     * @param $url
     * @param $line
     * @param $browser
     * @return DatabaseResult
     */
    private function _sqlSave($errorId, $message, $url, $line, $browser)
    {
        $query = "SELECT UPDATE_LOG(?,?,?,?,?)";
        $bind = [$errorId, $message, $url, $line, $browser];
        return $this->db()->execute($query, $bind);
    }
}

