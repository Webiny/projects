<?php

namespace App\Entities\Weby;

use App\AppTrait;
use App\Lib\DatabaseTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\LocalFile;
use Webiny\Component\Storage\StorageTrait;

class WebyImage
{
	use AppTrait, StorageTrait, DatabaseTrait, StdLibTrait;

	private $_webyId;
	private $_tag;
	private $_key;
	private $_file = null;

	public function __construct($webyId, $tag, $key = false) {
		$this->_webyId = $webyId;
		$this->_tag = $tag;
		$this->_key = $key;
	}

	public function __toString(){
		return $this->getUrl();
	}

	/**
	 * Set new image key (if previous key exists - the previous file will be deleted)
	 *
	 * @param $key
	 *
	 * @return $this
	 */
	public function setKey($key) {
		$storage = $this->storage('local');
		if($this->_key) {
			$file = new LocalFile($this->_key, $storage);
			if($storage->keyExists($this->_key)){
				$file->delete();
			}
		}
		$this->_key = $key;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getUrl(){
		if(!$this->_key){
    		$tag = $this->str($this->_tag)->replace('-', '_')->val();

			return $this->app()->getConfig()->images->{$tag};
		}

		if($this->_file == null && $this->_key){
			$this->_file = new LocalFile($this->_key, $this->storage('webies'));
		}

		return $this->_file->getUrl();
	}

	public function getFile(){
		if($this->_file == null && $this->_key){
			$this->_file = new LocalFile($this->_key, $this->storage('webies'));
		}
		return $this->_file;
	}

	public function save() {
		$query = "SELECT INSERT_IMAGE(?,?,?)";

		$bind = [
			$this->_webyId,
			$this->_tag,
			$this->_key
		];
		return $this->db()->execute($query, $bind);
	}

}