<?php

namespace App\Handlers;

use App\AppTrait;
use Webiny\Component\Http\HttpTrait;
use App\Lib\AbstractHandler;

/**
 * Class LinksHandler is responsible for parsing given URL and retrieving  title, description and image
 *
 * @package App\Handlers
 */
class LinksHandler extends AbstractHandler
{
	use AppTrait, HttpTrait;

	public function parse() {
		$url = $this->request()->query('url');
		$url = $this->getRealPath($url);
		$doc = new \DOMDocument();
		$html = $this->file_get_contents_utf8($url);
		$this->loadHtml($doc, $html);

		$title = $this->readTitle($doc);
		$description = $this->readDescription($doc);
		$images = $this->readImages($url, $doc);
		// If og:image was found - a single string will be returned
		$imageUrl = !is_array($images) ? $images : $this->parseImages($images);

		$data = [
			'title'       => is_string($title) ? $title : $url,
			'description' => $description,
			'imageUrl'    => $imageUrl
		];

		$this->ajaxResponse(false, '', $data);
	}

	private function file_get_contents_utf8($fn) {
		$string = file_get_contents($fn);

		return mb_convert_encoding($string, 'HTML-ENTITIES', "UTF-8");
	}

	private function loadHtml($doc, $html) {
		libxml_use_internal_errors(true);
		$doc->loadHTML($html);
		libxml_use_internal_errors(false);
	}

	private function readTitle($doc) {
		$nodes = $doc->getElementsByTagName('title');
		if($nodes && $nodes->item(0)) {
			return $nodes->item(0)->nodeValue;
		}

		return false;
	}

	private function readDescription($doc) {
		$metas = $doc->getElementsByTagName('meta');

		// First try searching for og:description
		for ($i = 0; $i < $metas->length; $i++) {
			$meta = $metas->item($i);
			if(strtolower($meta->getAttribute('property')) == 'og:description') {
				return $meta->getAttribute('content');
			}
		}

		// Try finding regular description tag
		for ($i = 0; $i < $metas->length; $i++) {
			$meta = $metas->item($i);
			if(strtolower($meta->getAttribute('name')) == 'description') {
				return $meta->getAttribute('content');
			}
		}

		return '';
	}

	private function readImages($url, $doc) {
		// First check og:image tag
		$metas = $doc->getElementsByTagName('meta');
		for ($i = 0; $i < $metas->length; $i++) {
			$meta = $metas->item($i);
			$metaName = strtolower($meta->getAttribute('property'));
			if($metaName == 'og:image') {
				return $meta->getAttribute('content');
			}
		}

		// If no og:image exists - find suitable image
		$images = $doc->getElementsByTagName('img');

		$imageUrls = [];
		for ($i = 0; $i < $images->length; $i++) {
			$image = $images->item($i);
			$img = $image->getAttribute('src');
			$imageLink = $this->makeAbsolute($img, $url);
			$imageUrls[] = $imageLink;
		}

		return $imageUrls;
	}

	private function getRealPath($url) {
		$regex = "#^(http|https)://#";

		preg_match($regex, $url, $match);

		if(!empty($match)) {
			return $url;
		} else {
			$newUrlHttp = 'http://' . $url;
			$newUrlHttps = 'http://' . $url;

			$handleHttp = @fopen($newUrlHttp, 'r');
			if($handleHttp != false) {
				return 'http://' . $url;
			}
			$handleHttps = @fopen($newUrlHttps, 'r');
			if($handleHttps != false) {
				return 'https://' . $url;
			}
		}

		return $url;
	}

	/**
	 * Make absolute url
	 *
	 * @param $url
	 * @param $base
	 *
	 * @return string
	 */
	private function makeAbsolute($url, $base) {
		// Return base if no url
		if(!$url) {
			return $base;
		}

		// Return if already absolute URL
		if(parse_url($url, PHP_URL_SCHEME) != '') {
			return $url;
		}

		// Urls only containing query or anchor
		if($url[0] == '#' || $url[0] == '?') {
			return $base . $url;
		}

		// Parse base URL and convert to local variables: $scheme, $host, $path
		extract(parse_url($base));

		// If no path, use /
		if(!isset($path)) {
			$path = '/';
		}

		// Remove non-directory element from path
		$path = preg_replace('#/[^/]*$#', '', $path);

		// Destroy path if relative url points to root
		if($url[0] == '/') {
			$path = '';
		}

		// Dirty absolute URL
		$abs = $host . $path . '/' . $url;

		// Replace '//' or '/./' or '/foo/../' with '/'
		$re = [
			'#(/\.?/)#',
			'#/(?!\.\.)[^/]+/\.\./#'
		];
		for ($n = 1; $n > 0; $abs = preg_replace($re, '/', $abs, -1, $n)) {
		}

		// Absolute URL is ready!
		return $scheme . '://' . $abs;
	}

	private function parseImages($images) {
		$cerl = error_reporting();
		error_reporting(0);

		foreach ($images as $image) {
			try {
				$imageSize = getimagesize($image);
			} catch (\Exception $e) {
				continue;
			}
			if(isset($imageSize)) {
				if($imageSize[0] >= 60 && $imageSize[1] >= 60) {
					return $image;
				}
			}
		}
		error_reporting($cerl);

		return false;
	}
}


