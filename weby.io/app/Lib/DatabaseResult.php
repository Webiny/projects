<?php

namespace App\Lib;

use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class DatabaseResult
{
    use StdLibTrait;

    /**
     * @var \PDO
     */
    private $_result;

    /**
     * @var Int
     */
    private $_resultPointer = 0;

    /**
     * Database result constructor
     * @param Array $result -> send over reference (spare memory)
     * @return DatabaseResult
     */
    public function  __construct(&$result)
    {
        $this->_result = $result;
    }

    /**
     * Returns result in a form of associated array for the current pointer position (ArrayObject format)
     * @return Array|Boolean -> false if there are no more records
     */
    public function fetchArray()
    {
        $row = $this->_fetch();

		if($row === false){
			return false;
		}

		return $this->arr((array)$row);
    }

    /**
     * Returns all rows from last result set
     * Result is returned in ArrayObject format
     *
     * @param String $resultType
     * @internal param String $query
     * @return ArrayObject|Boolean
     */
    public function fetchAll($resultType = Database::RT_ARRAY)
    {
        if ($resultType == Database::RT_OBJECT) {
            return $this->_result;
        } else if ($resultType == Database::RT_ARRAY) {
            $return = new ArrayObject();
            foreach ($this->_result as $r) {
                $r = (array)$r;
                $return->append($this->arr($r));
            }
            return $return;
        }
    }

    /**
     * Fetches first column value
     * @return Mixed|Boolean
     */
    function fetchValue()
    {
        $row = $this->_fetch();

        if ($row != false) {
            $values = array_values((array)$row);
            return $values[0];
        }
        return false;
    }

    /**
     * Fetches first column in result set as array of row values
     * @return Boolean|Array
     */
    function fetchColumn()
    {
        $return = array();
        foreach ($this->_result as $r) {
            $values = array_values((array)$r);
            $return[] = $values[0];
        }
        return $return;
    }

    /**
     * Private function that moves the result pointer for the result set
     * @return Array|Boolean  -> false if there are no more records
     */
    private function _fetch()
    {
        if (isset($this->_result[$this->_resultPointer])) {
            $value = & $this->_result[$this->_resultPointer];
            $this->_resultPointer++;

            return $value;
        }

        return false;
    }

}

?>