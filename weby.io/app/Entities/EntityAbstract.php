<?php

namespace App\Entities;

use App\App;
use App\Lib\DatabaseTrait;
use Webiny\Component\StdLib\StdLibTrait;

abstract class EntityAbstract implements \ArrayAccess
{
	use StdLibTrait;

	protected static $_totalRows = 0;

	abstract protected function _sqlSave();

	abstract protected function _sqlLoad();

	abstract protected function _sqlDelete();

	public function save() {
		$this->_onBeforeSave();
		$res = $this->_sqlSave();
		$this->_onAfterSave($res);

		return $res;
	}

	public function load($id) {
		if(empty($id)) {
			return $this;
		}
		$this->_id = $id;
		$data = $this->_sqlLoad();

		if(!$data) {
			$this->_id = false;
			return false;
		}
		$this->_populateFromDb($data);
		$this->_onAfterLoad();

		return $this;
	}

	public function delete() {
		$this->_onBeforeDelete();
		$res = $this->_sqlDelete();
		$this->_onAfterDelete($res);

		return $res;
	}

	public function populate($data) {
		$this->_onBeforePopulate($data);
		foreach ($data as $prop => $value) {
			$property = '_' . $this->_buildPropertyName($prop);
			$this->$property = $value;
		}
		$this->_onAfterPopulate($data);

		return $this;
	}

	protected function _populateFromDb($data) {
		if(empty($data)) {
			$this->_id = false;

			return;
		}
		foreach ($data as $prop => $value) {
			$property = '_' . $this->_buildPropertyName($prop);

			if(!property_exists($this, $property)) {
				continue;
			}
			$value = $this->_applyLoadFilter($prop, $value, $row);
			$this->$property = $value;
		}
	}

	protected function _applyLoadFilter($property, $value, &$data) {
		$method = '_' . ucfirst($this->_buildPropertyName($property)) . 'LoadFilter';
		if(method_exists($this, $method)) {
			return $this->$method($value, $data);
		} else {
			return $value;
		}
	}

	protected function _buildPropertyName($name) {
		$name = str_replace('_', ' ', $name);
		$name = lcfirst(ucwords($name));
		$name = str_replace(' ', '', $name);

		return $name;
	}

	/**
	 * @return \App\Lib\Database;
	 */
	protected static function _getDb() {
		return App::getInstance()->getDb();
	}

	// Events

	protected function _onBeforePopulate(&$data) {
		return false;
	}

	protected function _onBeforeSave() {
		return false;
	}

	protected function _onAfterSave() {
		return false;
	}

	protected function _onBeforeDelete() {
		return false;
	}

	protected function _onAfterPopulate($data) {
		return false;
	}

	protected function _onAfterLoad() {
		return false;
	}

	protected function _onAfterDelete() {
		return false;
	}

	/**
	 * Get total number of found rows
	 * @return int
	 */
	public static function getTotalRows(){
		return self::$_totalRows;
	}

	/**
	 * (PHP 5 &gt;= 5.0.0)<br/>
	 * Whether a offset exists
	 * @link http://php.net/manual/en/arrayaccess.offsetexists.php
	 *
	 * @param mixed $offset <p>
	 *                      An offset to check for.
	 * </p>
	 *
	 * @return boolean true on success or false on failure.
	 * </p>
	 * <p>
	 *       The return value will be casted to boolean if non-boolean was returned.
	 */
	public function offsetExists($offset) {
		return isset($this->{'_' . $offset});
	}

	/**
	 * (PHP 5 &gt;= 5.0.0)<br/>
	 * Offset to retrieve
	 * @link http://php.net/manual/en/arrayaccess.offsetget.php
	 *
	 * @param mixed $offset <p>
	 *                      The offset to retrieve.
	 * </p>
	 *
	 * @return mixed Can return all value types.
	 */
	public function offsetGet($offset) {
		return $this->{'get' . ucfirst($offset)}();
	}

	/**
	 * (PHP 5 &gt;= 5.0.0)<br/>
	 * Offset to set
	 * @link http://php.net/manual/en/arrayaccess.offsetset.php
	 *
	 * @param mixed $offset <p>
	 *                      The offset to assign the value to.
	 * </p>
	 * @param mixed $value  <p>
	 *                      The value to set.
	 * </p>
	 *
	 * @return void
	 */
	public function offsetSet($offset, $value) {
		$this->{'_' . $offset} = $value;
	}

	/**
	 * (PHP 5 &gt;= 5.0.0)<br/>
	 * Offset to unset
	 * @link http://php.net/manual/en/arrayaccess.offsetunset.php
	 *
	 * @param mixed $offset <p>
	 *                      The offset to unset.
	 * </p>
	 *
	 * @return void
	 */
	public function offsetUnset($offset) {
		unset($this->{'_' . $offset});
	}
}

