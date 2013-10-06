<?php
namespace App\Lib;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * @package App\Lib
 */
class Helper
{
	use SingletonTrait, StdLibTrait, AppTrait, HttpTrait;

	public function logUserLogin(UserEntity $user) {
		try {
			$fp = @fsockopen($this->app()->getConfig()->app->node_geo_ip, $errno, $errstr);
			if(!$fp) {
				return;
			}

			fwrite($fp, json_encode([
									'action' => 'user.login',
									'userId' => $user->getId(),
									'url'    => $this->request()->query('r')
									]));
			fclose($fp);
		} catch (Exception $e) {
			return;
		}
	}

	public function logUserAction(UserEntity $user, $logMessage) {
		if(!$user){
			return;
		}
		try {
			$fp = @fsockopen($this->app()->getConfig()->app->node_geo_ip, $errno, $errstr);
			if(!$fp) {
				return;
			}

			fwrite($fp, json_encode([
									'action' => 'page.view',
									'message' => $logMessage,
									'userId' => $user->getId(),
									'url'    => $this->request()->query('r'),
									'avatar' => $user->getAvatarUrl(),
									'username' => $user->getUsername(),
									]));
			fclose($fp);
		} catch (Exception $e) {
			return;
		}
	}

	/**
	 * Flush varnish cache for given Weby
	 *
	 * @param WebyEntity $weby
	 */
	public function flushWebyCache(WebyEntity $weby) {
		if($this->app()->getConfig()->varnish->enabled) {
			$varnishFlush = $this->str($this->app()->getConfig()->varnish->flush_weby);
			system($varnishFlush->replace('{webyUrl}', $weby->getPublicUrl())->val());
		}
	}

	/**
	 * Sanitizing input (strip slashes, trim, replace spaces
	 */
	public function sanitizeInput(&$input, $toLower = false) {
		$input = self::str($input)->trim()->stripTags()->val();
		$input = preg_replace('/[ ]+/', ' ', $input);
		if($toLower) {
			$input = strtolower($input);
		}
	}

	/**
	 * Generates pagination
	 *
	 * @param      $count
	 * @param      $page
	 * @param      $diplaynum
	 * @param bool $hasP1
	 * @param bool $returnArray
	 *
	 * @return array|string
	 */
	public function getNavigation($count, $page, $diplaynum, $hasP1 = true, $returnArray = false) {
		$links = array(
			'prev'  => '',
			'next'  => '',
			'pages' => array()
		);
		if($count < $diplaynum || $diplaynum < 1) {
			if($returnArray) {
				return array(
					'html'  => '',
					'array' => $links
				);
			}

			return '<a href="' . $_SERVER ['REQUEST_URI'] . '">1</a>';
		}

		$output = "";
		$numOfPages = ceil($count / $diplaynum);
		$totalOfPages = $numOfPages;

		if(($page + 9) > $numOfPages) {
			$numOfPages = $numOfPages;
			$cur_page = $page - 5;
			if($cur_page <= 0) {
				$cur_page = 1;
			}
		} else {
			if(($page - 5) > 0) {
				$numOfPages = $page + 5;
			} else {
				$numOfPages = 10;
			}
			$cur_page = $page - 5;
			if($cur_page <= 0) {
				$cur_page = 1;
			}
		}

		if(preg_match('/([0-9]{1,9})$/', $_SERVER ['REQUEST_URI'])) {
			$page_uri = preg_replace('/([0-9]{1,9})$/', '{page}', $_SERVER ['REQUEST_URI']);
		} else {
			$urlData = parse_url($_SERVER ['REQUEST_URI']);
			if(isset($urlData['query']) && $urlData['query'] != "") {
				$page_uri = $_SERVER ['REQUEST_URI'] . '&{page}';
			} else {
				$page_uri = $_SERVER ['REQUEST_URI'] . '{page}';
			}
		}

		if(!preg_match("/page={page}/", $page_uri)) {
			$page_uri = $page_uri;
		}

		for ($i = $cur_page; $i <= $numOfPages; $i++) {
			if(!$hasP1 && $i == 1) {
				$tpage_uri = str_replace("{page}", "", $page_uri);
				$tpage_uri = str_replace("&{page}", "", $tpage_uri);
				if($i == $page) {
					$cpLink = "<a class=\"pagination-active\" href=\"" . $tpage_uri . "\">$i</a>";
					$output .= $cpLink . "\n";
					$selected = true;
				} else {
					$cpLink = "<a href=\"" . $tpage_uri . "\">$i</a>";
					$output .= $cpLink . "\n";
					$selected = false;
				}
				$links['pages'][] = array(
					'href'     => $tpage_uri,
					'page'     => $i,
					'selected' => $selected
				);
			} else {
				if($i == $page) {
					$href = str_replace("{page}", $i, $page_uri);
					$output .= "<a class=\"pagination-active\" href=\"" . $href . "\">$i</a>\n";
					$selected = true;
				} else {
					$href = str_replace("{page}", $i, $page_uri);
					$output .= "<a href=\"" . $href . "\">$i</a>\n";
					$selected = false;
				}
				$links['pages'][] = array(
					'href'     => $href,
					'page'     => $i,
					'selected' => $selected
				);
			}
		}

		$previous_link = "\n";
		if(($page - 1) >= 1) {
			if(($page - 1) == 1 && !$hasP1) {
				$href = str_replace("{page}", "", $page_uri);
				$href = str_replace("&{page}", "", $href);
			} else {
				$href = str_replace("{page}", $page - 1, $page_uri);
			}

			$previous_link = "<a class=\"prev\" href=\"" . $href . "\">  &lt;&lt; </a>";
			$links['prev'] = $href;
		}

		$next_link = "\n";
		if(($page + 1) <= $numOfPages) {
			$href = str_replace("{page}", $page + 1, $page_uri);
			$next_link = "<a class=\"next\" href=\"" . $href . "\">  &gt;&gt; </a>";
			$links['next'] = $href;
		}

		$link = '<p class="paging">' . $previous_link . $output . $next_link . '</p>';

		if($returnArray) {
			return array(
				'html'  => $link,
				'array' => $links
			);
		} else {
			return $link;
		}
	}

	/**
	 * Create a web friendly URL slug from a string.
	 *
	 * Although supported, transliteration is discouraged because
	 *     1) most web browsers support UTF-8 characters in URLs
	 *     2) transliteration causes a loss of information
	 *
	 * @author    Sean Murphy <sean@iamseanmurphy.com>
	 * @copyright Copyright 2012 Sean Murphy. All rights reserved.
	 * @license   http://creativecommons.org/publicdomain/zero/1.0/
	 *
	 * @param string $str
	 *
	 * @internal  param array $options
	 * @return string
	 */
	public function toSlug($str) {
		// Make sure string is in UTF-8 and strip invalid UTF-8 characters
		$str = mb_convert_encoding((string)$str, 'UTF-8', mb_list_encodings());

		$char_map = array(
			// Latin
			'À' => 'A',
			'Á' => 'A',
			'Â' => 'A',
			'Ã' => 'A',
			'Ä' => 'A',
			'Å' => 'A',
			'Æ' => 'AE',
			'Ç' => 'C',
			'È' => 'E',
			'É' => 'E',
			'Ê' => 'E',
			'Ë' => 'E',
			'Ì' => 'I',
			'Í' => 'I',
			'Î' => 'I',
			'Ï' => 'I',
			'Ð' => 'D',
			'Ñ' => 'N',
			'Ò' => 'O',
			'Ó' => 'O',
			'Ô' => 'O',
			'Õ' => 'O',
			'Ö' => 'O',
			'Ő' => 'O',
			'Ø' => 'O',
			'Ù' => 'U',
			'Ú' => 'U',
			'Û' => 'U',
			'Ü' => 'U',
			'Ű' => 'U',
			'Ý' => 'Y',
			'Þ' => 'TH',
			'ß' => 'ss',
			'à' => 'a',
			'á' => 'a',
			'â' => 'a',
			'ã' => 'a',
			'ä' => 'a',
			'å' => 'a',
			'æ' => 'ae',
			'ç' => 'c',
			'è' => 'e',
			'é' => 'e',
			'ê' => 'e',
			'ë' => 'e',
			'ì' => 'i',
			'í' => 'i',
			'î' => 'i',
			'ï' => 'i',
			'ð' => 'd',
			'ñ' => 'n',
			'ò' => 'o',
			'ó' => 'o',
			'ô' => 'o',
			'õ' => 'o',
			'ö' => 'o',
			'ő' => 'o',
			'ø' => 'o',
			'ù' => 'u',
			'ú' => 'u',
			'û' => 'u',
			'ü' => 'u',
			'ű' => 'u',
			'ý' => 'y',
			'þ' => 'th',
			'ÿ' => 'y',

			// Latin symbols
			'©' => '(c)',

			// Greek
			'Α' => 'A',
			'Β' => 'B',
			'Γ' => 'G',
			'Δ' => 'D',
			'Ε' => 'E',
			'Ζ' => 'Z',
			'Η' => 'H',
			'Θ' => '8',
			'Ι' => 'I',
			'Κ' => 'K',
			'Λ' => 'L',
			'Μ' => 'M',
			'Ν' => 'N',
			'Ξ' => '3',
			'Ο' => 'O',
			'Π' => 'P',
			'Ρ' => 'R',
			'Σ' => 'S',
			'Τ' => 'T',
			'Υ' => 'Y',
			'Φ' => 'F',
			'Χ' => 'X',
			'Ψ' => 'PS',
			'Ω' => 'W',
			'Ά' => 'A',
			'Έ' => 'E',
			'Ί' => 'I',
			'Ό' => 'O',
			'Ύ' => 'Y',
			'Ή' => 'H',
			'Ώ' => 'W',
			'Ϊ' => 'I',
			'Ϋ' => 'Y',
			'α' => 'a',
			'β' => 'b',
			'γ' => 'g',
			'δ' => 'd',
			'ε' => 'e',
			'ζ' => 'z',
			'η' => 'h',
			'θ' => '8',
			'ι' => 'i',
			'κ' => 'k',
			'λ' => 'l',
			'μ' => 'm',
			'ν' => 'n',
			'ξ' => '3',
			'ο' => 'o',
			'π' => 'p',
			'ρ' => 'r',
			'σ' => 's',
			'τ' => 't',
			'υ' => 'y',
			'φ' => 'f',
			'χ' => 'x',
			'ψ' => 'ps',
			'ω' => 'w',
			'ά' => 'a',
			'έ' => 'e',
			'ί' => 'i',
			'ό' => 'o',
			'ύ' => 'y',
			'ή' => 'h',
			'ώ' => 'w',
			'ς' => 's',
			'ϊ' => 'i',
			'ΰ' => 'y',
			'ϋ' => 'y',
			'ΐ' => 'i',

			// Turkish
			'Ş' => 'S',
			'İ' => 'I',
			'Ç' => 'C',
			'Ü' => 'U',
			'Ö' => 'O',
			'Ğ' => 'G',
			'ş' => 's',
			'ı' => 'i',
			'ç' => 'c',
			'ü' => 'u',
			'ö' => 'o',
			'ğ' => 'g',

			// Russian
			'А' => 'A',
			'Б' => 'B',
			'В' => 'V',
			'Г' => 'G',
			'Д' => 'D',
			'Е' => 'E',
			'Ё' => 'Yo',
			'Ж' => 'Zh',
			'З' => 'Z',
			'И' => 'I',
			'Й' => 'J',
			'К' => 'K',
			'Л' => 'L',
			'М' => 'M',
			'Н' => 'N',
			'О' => 'O',
			'П' => 'P',
			'Р' => 'R',
			'С' => 'S',
			'Т' => 'T',
			'У' => 'U',
			'Ф' => 'F',
			'Х' => 'H',
			'Ц' => 'C',
			'Ч' => 'Ch',
			'Ш' => 'Sh',
			'Щ' => 'Sh',
			'Ъ' => '',
			'Ы' => 'Y',
			'Ь' => '',
			'Э' => 'E',
			'Ю' => 'Yu',
			'Я' => 'Ya',
			'а' => 'a',
			'б' => 'b',
			'в' => 'v',
			'г' => 'g',
			'д' => 'd',
			'е' => 'e',
			'ё' => 'yo',
			'ж' => 'zh',
			'з' => 'z',
			'и' => 'i',
			'й' => 'j',
			'к' => 'k',
			'л' => 'l',
			'м' => 'm',
			'н' => 'n',
			'о' => 'o',
			'п' => 'p',
			'р' => 'r',
			'с' => 's',
			'т' => 't',
			'у' => 'u',
			'ф' => 'f',
			'х' => 'h',
			'ц' => 'c',
			'ч' => 'ch',
			'ш' => 'sh',
			'щ' => 'sh',
			'ъ' => '',
			'ы' => 'y',
			'ь' => '',
			'э' => 'e',
			'ю' => 'yu',
			'я' => 'ya',

			// Ukrainian
			'Є' => 'Ye',
			'І' => 'I',
			'Ї' => 'Yi',
			'Ґ' => 'G',
			'є' => 'ye',
			'і' => 'i',
			'ї' => 'yi',
			'ґ' => 'g',

			// Czech
			'Č' => 'C',
			'Ď' => 'D',
			'Ě' => 'E',
			'Ň' => 'N',
			'Ř' => 'R',
			'Š' => 'S',
			'Ť' => 'T',
			'Ů' => 'U',
			'Ž' => 'Z',
			'č' => 'c',
			'ď' => 'd',
			'ě' => 'e',
			'ň' => 'n',
			'ř' => 'r',
			'š' => 's',
			'ť' => 't',
			'ů' => 'u',
			'ž' => 'z',

			// Polish
			'Ą' => 'A',
			'Ć' => 'C',
			'Ę' => 'e',
			'Ł' => 'L',
			'Ń' => 'N',
			'Ó' => 'o',
			'Ś' => 'S',
			'Ź' => 'Z',
			'Ż' => 'Z',
			'ą' => 'a',
			'ć' => 'c',
			'ę' => 'e',
			'ł' => 'l',
			'ń' => 'n',
			'ó' => 'o',
			'ś' => 's',
			'ź' => 'z',
			'ż' => 'z',

			// Latvian
			'Ā' => 'A',
			'Č' => 'C',
			'Ē' => 'E',
			'Ģ' => 'G',
			'Ī' => 'i',
			'Ķ' => 'k',
			'Ļ' => 'L',
			'Ņ' => 'N',
			'Š' => 'S',
			'Ū' => 'u',
			'Ž' => 'Z',
			'ā' => 'a',
			'č' => 'c',
			'ē' => 'e',
			'ģ' => 'g',
			'ī' => 'i',
			'ķ' => 'k',
			'ļ' => 'l',
			'ņ' => 'n',
			'š' => 's',
			'ū' => 'u',
			'ž' => 'z',

			// Special chars
			'°' => ''
		);

		// Transliterate characters to ASCII
		$str = str_replace(array_keys($char_map), $char_map, $str);

		// Replace non-alphanumeric characters with our delimiter
		$str = preg_replace('/[^\p{L}\p{Nd}]+/u', '-', $str);

		// Remove duplicate delimiters
		$str = preg_replace('/(' . preg_quote('-', '/') . '){2,}/', '$1', $str);

		// Remove delimiter from ends
		$str = trim($str, '-');

		return mb_strtolower($str, 'UTF-8');
	}
}