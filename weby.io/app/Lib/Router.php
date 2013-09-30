<?php

namespace App\Lib;

use App\AppTrait;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Logger\LoggerTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

class Router
{
	use SingletonTrait, AppTrait, StdLibTrait, HttpTrait, LoggerTrait;

	private $_routes = array();
	private $_requestParams = [];
	private $_handlerClass;
	private $_handlerMethod;

	public function init() {
		foreach ($this->app()->getConfig()->routes as $route) {
			$this->_addRoute($route->get(0, ''), $route->get(1, ''), $route->get(2, ''));
		}
		$this->_registerRoutes();
	}

	public function route() {
		$this->_parseRequest();
		$this->_run();
	}

	public function getMethod() {
		return $this->str($this->_handlerMethod);
	}

	public function getHandler() {
		return $this->str($this->_handlerClass);
	}

	private function _addRoute($urlRequest, $class, $method = null) {
		$this->_routes[$urlRequest] = array(
			'class'  => $class,
			'method' => $method
		);
	}

	private function _run() {
		$handlerClass = $this->_handlerClass;
		if(is_callable($handlerClass)) {
			return $handlerClass();
		} else {
			$handler = new $handlerClass;
			if($this->isInstanceOf($handler, '\App\Lib\AbstractHandler')) {
				call_user_func_array([$handler, $this->_handlerMethod], $this->_requestParams);
				$this->logger('webiny_logger')->info("Rendering...");
				return $handler->output();
			}
			throw new \Exception('Handler class must implement `AbstractHandler`');
		}
	}


	/**
	 * Register PHP routes
	 *
	 *
	 * All routes are defined in YAML file.
	 * Define new routes here here if specific PHP functionality is needed.
	 *
	 * Example with callable:
	 *
	 * $this->_addRoute('test/route', function(){
	 *        // Do something
	 * });
	 */
	private function _registerRoutes() {
		$this->_addRoute('/editor/(\d+)$/', function($matches){

		});
	}

	private function _parseRequest() {
		// Get URL
		$request = $this->str($this->request()->query('r', ''))->trimRight('/')->val();
		// Check routes
		foreach ($this->_routes as $regex => $route) {
			$match = false;
			$regex = $this->str($regex);

			if($regex->equals('') && $request == '') // match empty request
			{
				$match = [true];
			} else {

				$fChar = clone $regex;
				$fChar = $fChar->subString(0, 1)->val();

				if(($fChar == '|' || $fChar== '/') && ($regex->subStringCount('|') >= 2 || $regex->subStringCount('/') >= 2)
				) {
					// preg_match request
					@preg_match($regex->val(), $request, $match);
				} else {
					if($regex == $request) { // string match request
						$match = [true];
					}
				}
			}

			if(is_array($match) && count($match) > 0) {
				array_shift($match);
				$this->_requestParams = $match;
				$this->_handlerClass = $route['class'];
				$this->_handlerMethod = $route['method'];
				return;
			}
		}
		$this->_handlerClass = $this->app()->getConfig()->app->default_class;
		$this->_handlerMethod = $this->app()->getConfig()->app->default_method;
	}
}

