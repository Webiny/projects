<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright (c) 2009-2013 Webiny LTD. (http://www.webiny.com)
 * @license   http://www.webiny.com/framework/license
 */

namespace App\Lib\Screenshot;


use App\AppTrait;
use App\Entities\Weby\WebyEntity;
use App\Lib\DatabaseTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class ScreenshotQueue
 *
 * Statuses:
 * - waiting
 * - running
 * - completed
 * - aborted
 *
 * @package App\Lib\Screenshot
 */

class ScreenshotQueue
{
	use StdLibTrait, DatabaseTrait, AppTrait;

	public function add($webyId) {
		$query = "SELECT weby FROM {$this->db()->w_screenshot_queue} WHERE weby = ? AND status IN ('waiting', 'running')";
		$bind = [$webyId];
		$res = $this->db()->execute($query, $bind)->fetchValue();

		if($res){
			return $this;
		}

		$query = "INSERT INTO {$this->db()->w_screenshot_queue} (weby, added) VALUES (?, NOW())";
		$bind = [$webyId];
		$this->db()->execute($query, $bind);
		return $this;
	}

	public function complete($webyId) {
		$query = "UPDATE {$this->db()->w_screenshot_queue} SET completed = NOW(), status = 'completed' WHERE weby = ? AND status = 'running'";
		$bind = [$webyId];
		$this->db()->execute($query, $bind);

		return $this;
	}

	public function abort($webyId, $message = '') {
		$query = "UPDATE {$this->db()->w_screenshot_queue} SET completed = NOW(), status = 'aborted', message = ? WHERE weby = ? AND status = 'running'";
		$bind = [$message, $webyId];
		$this->db()->execute($query, $bind);

		return $this;
	}

	public function processQueue() {
		$query = "SELECT * FROM {$this->db()->w_screenshot_queue} WHERE status = 'running'";
		$job = $this->db()->execute($query)->fetchArray();
		if($job) {
			$datetime1 = $this->datetime($job['executed']);
			$datetime2 = $this->datetime("now");
			$interval = $datetime1->diff($datetime2);
			$minutes = $interval['i'];
			if($minutes > 3) {
				$this->abort($job['weby'], 'Timeout');
			} else {
				return $this;
			}
		}
		$query = "SELECT weby FROM {$this->db()->w_screenshot_queue} WHERE status = 'waiting' ORDER BY added ASC";
		$webyId = $this->db()->execute($query)->fetchValue();
		if($webyId) {
			$this->execute($webyId);
		}

		return $this;
	}

	public function getQueue($webyId) {
		$query = "SELECT * FROM {$this->db()->w_screenshot_queue} WHERE weby = ?";
		$res = $this->db()->execute($query, [$webyId])->fetchArray();
		if(!$res) {
			return [];
		}

		return $res;
	}

	private function execute($webyId) {
		$query = "UPDATE {$this->db()->w_screenshot_queue} SET executed = ?, status = 'running' WHERE weby = ? AND status = 'waiting'";
		$bind = [
			date('Y-m-d H:i:s'),
			$webyId
		];
		$this->db()->execute($query, $bind);
		system("wget " . $this->app()
						 ->getConfig()->app->web_path . "tools/take-screenshot/" . $webyId . "/ -O /dev/null > /dev/null 2>&1 &");

		return $this;
	}
}