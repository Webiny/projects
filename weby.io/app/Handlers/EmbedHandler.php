<?php

namespace App\Handlers;

use App\Lib\AbstractHandler;
use Webiny\Component\Http\HttpTrait;

class EmbedHandler extends AbstractHandler
{
	use HttpTrait;

	public function linkedIn() {
		$this->url = urldecode($this->request()->query('url'));
		$this->id = $this->request()->query('id');
		$this->setTemplate('linkedin');
	}

	public function vine(){
		$this->vineId = $this->request()->query('vineId');
	}

	public function pinterest(){
		$this->pinUrl = $this->request()->query('pinUrl');
		$this->pinType = $this->request()->query('pinType');

		if(!$this->pinUrl || !$this->pinType){
			$this->pinUrl = 'http://pinterest.com/pin/99360735500167749/';
			$this->pinType = 'pin';
		}
	}

	public function fbPost(){
		$this->fbUrl = $this->request()->query('fbUrl');
		$this->parentId = $this->request()->query('parent');
	}

	public function googlePlus(){
		$this->userId = $this->request()->query('userId');
		$this->postId = $this->request()->query('postId');
	}
}

