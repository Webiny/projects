<?php
namespace App\Lib\Screenshot;

use App\AppTrait;
use App\Entities\Weby\WebyEntity;
use App\Entities\Weby\WebyImage;
use Webiny\Component\Image\ImageTrait;
use Webiny\Component\Storage\File\LocalFile;
use Webiny\Component\Storage\Storage;
use Webiny\Component\Storage\StorageTrait;

/**
 * Class Photographer
 *
 * Takes main screenshot of a Weby and makes all necessary image sizes
 *
 * Sizes:
 * - dashboard (90x81)
 * - frontend-square (215x180)
 * - frontend-vertical (215x512)
 * - frontend-horizontal (515x180)
 * - open-graph (398x208)
 *
 * @package App\Lib\Screenshot
 */
class Photographer
{
	use StorageTrait, ImageTrait, AppTrait;

	/**
	 * @var \App\Entities\Weby\WebyEntity
	 */
	protected $_weby;

	/**
	 * @var \Webiny\Component\Storage\Storage
	 */
	protected $_storage;

	/**
	 * @var WebyImage
	 */
	protected $_originalScreenshot;

	function __construct(WebyEntity $weby, Storage $storage) {
		$this->_weby = $weby;
		$this->_storage = $storage;
	}

	public function takeScreenshots() {
		$screenshot = new Screenshot();
		$queue = new ScreenshotQueue();

		$key = $this->_weby->getStorageFolder() . '/original-screenshot-' . time() . '.jpg';
		$path = $this->_storage->getAbsolutePath($key);
		try {
			$screenshot->takeScreenshot($this->_weby, $path);
			$this->_weby->getImage('original-screenshot')->setKey($key)->save();
			$this->_originalScreenshot = $this->_weby->getImage('original-screenshot');

			// Create different image sizes
			$dimensions = $this->app()->getConfig()->screenshots->get('dimensions', []);
			foreach ($dimensions as $dimension => $format) {
				$this->_createSize($format[0], $format[1], $dimension);
			}
			$queue->complete($this->_weby->getId())->processQueue();
		} catch (\Exception $e) {
			$queue->abort($this->_weby->getId(), $e->getMessage())->processQueue();

			return false;
		}

		return true;
	}

	private function _createSize($width, $height, $tag) {
		$tag = str_replace('_', '-', $tag);
		$key = $this->_weby->getStorageFolder() . '/' . $tag . '-' . time() . '.jpg';
		$imageObj = $this->image($this->_originalScreenshot->getFile());
		$thumbImage = new LocalFile($key, $this->_storage);
		if($imageObj->thumbnail($width, $height, 'crop')->save($thumbImage)) {
			$this->_weby->getImage($tag)->setKey($key)->save();
		}
	}
}