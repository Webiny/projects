<?php
/**
 * Minifyer class
 * @author  Sven Al Hamad
 * @package Webiny
 * (c) 2010
 *
 * JS and CSS files are compressed automatically, if you do not want to compress a file, put 'source://' in front of the file name.
 * PHP files are first loaded over HTTP and than the output is populated into the minified file.
 */
namespace App\Lib\Minify;
set_time_limit(0);

//this class is required for minifying javascript files
use App\AppTrait;
use App\Lib\UglifyPHP\JS;
use Webiny\Component\StdLib\StdLibTrait;

class Minify
{

    use AppTrait, StdLibTrait;

    const TYPE_CSS = 'text/css'; // header type for css files
    const TYPE_HTML = 'text/html'; // header type for html files
    const TYPE_JS = 'application/x-javascript'; // header type for javascript files
    private $headerType = 'text/html'; // default header encoding

    public $_config;
    public $caching = TRUE; // cache the output
    public $compress = TRUE; // compress (gzip) the output
    public $minify = TRUE; // minify the output
    public $debug = false; // for debugging
    public $jsFolder = '';
    public $cssFolder = '';
	public $fromCache = false;

    private $files = array();
    private $group_name = '';
    private $cssPath = '';
    private $jsPath = '';
    private $minifyType = ''; //css or js
    private $themeWebPath = '';

    private $customCacheFolder = false;

    /**
     * Minify constructor
     *
     * @param bool $init
     *
     * @return \App\Lib\Minify\Minify
     */
    function __construct($init = true)
    {

        $this->_config = $this->app()->getConfig()->app;


        if ($this->_isBuggyIe()) { //IE fix
            $this->minify = false;
        }

        clearstatcache(); // must be done becuse the file modification dates get cached

        if ($this->debug) {
            $this->compress = false;
        }

        // development mode
        if ($this->_config->mode == 'development') {
            $this->caching = FALSE;
            $this->compress = FALSE;
            $this->minify = FALSE;
        }

        if ($init) {
            $this->cssPath = $this->_config->theme_abs_path . 'css/';
            $this->jsPath = $this->_config->theme_abs_path . 'js/';
            $this->themeWebPath = $this->_config->theme_abs_path;
        }

        return;
    }

    /**
     * Minify string
     *
     * @param        $str  - your string
     * @param string $type - js or css
     *
     * @return string - minified string
     */
    static function minString(&$str, $type = 'js')
    {
        if ($type == 'js') {
            return self::_minJSString($str);
        } else {
            return self::_minCSSString($str);
        }
    }

    /**
     * Sets the CSS path
     *
     * @param $folder
     *
     * @return Void
     */
    function setCssPath($folder)
    {
        $this->cssRoot = $folder;
        $folder = $this->str($folder);
        $this->cssPath = trim($folder);
        $folder = str_replace('\\', '/', $folder->stripTrailingSlash());
        $folder = explode('/', $folder);
        $this->cssFolder = trim(end($folder));
    }

    /**
     * Sets the Javascript path
     *
     * @param $folder
     *
     * @return Void
     */
    function setJsPath($folder)
    {
        $folder = $this->str($folder);
        $this->jsPath = trim($folder);
        $folder = str_replace('\\', '/', $folder->stripTrailingSlash());
        $folder = explode('/', $folder);

        $this->jsFolder = trim(end($folder));
    }

    /**
     * Sets the web path to the theme
     *
     * @param type $webPath
     */
    function setThemeWebPath($webPath)
    {
        $this->themeWebPath = trim($webPath);
    }

    /**
     * Minify the given array of css files
     *
     * @param Array $files
     *
     * @return bool
     */
    public function minifyCSS(array $files)
    {
        $this->group_name = 'css_' . md5(serialize($files)) . '.css';

        foreach ($files as $k => $file) {
            if (trim($file) != '') {
                $this->files[] = $this->cssPath . trim($file);
            } else {
                unset($files[$k]);
            }
        }

        $this->minifyType = 'css';
        $this->headerType = Minify::TYPE_CSS;

        if ($this->_config->mode == 'development') {
            $this->files = $files;
            return false;
        }

        $this->doMinify();
    }

    /**
     * Minify the given array of javascript files
     *
     * @param $files
     */
    public function minifyJS(array $files)
    {
        $this->group_name = 'js_' . md5(serialize($files)) . '.js';

        foreach ($files as $k => $file) {
            if (trim($file) != '') {
                $this->files[] = $this->jsPath . trim($file);
            } else {
                unset($files[$k]);
            }
        }

        $this->minifyType = 'js';
        $this->headerType = Minify::TYPE_JS;

        if ($this->_config->mode == 'development') {
            $this->files = $files;
            return false;
        }

        return $this->doMinify();
    }

    public function reset()
    {
        $this->group_name = '';
        $this->files = array();
        $this->minifyType = '';
        $this->headerType = '';
    }

    /**
     * Openes the files that belong go the given group and minifies each file in the group.
     * One the minify process is completed the output is compressed and sent to the browser.
     *
     * @internal param String $groupName
     */
    private function doMinify()
    {
        $output = '';

        //check if cache file exists
        $this->debug('Checking cache');
        $fromCache = false;
        $fileTime = 0;
        $cacheFolder = $this->getCacheFolder();
        $cache = $cacheFolder . $this->group_name;

        if ($this->minify && $this->caching && file_exists($cache)) {
            $fileTime = filemtime($cache);
            $this->fromCache = $fromCache = true;
        }

        $this->debug('Cache was last created on: ' . date('d.m.Y H:i:s', $fileTime));

        //check if the some file has been modified
        if ($fromCache) {
            $this->debug('Checking file modifications');
            foreach ($this->files as $file) {
                $mfTime = filemtime($file);
                $this->debug('file ' . $file . ' was last modified on: ' . date('d.m.Y H:i:s', $mfTime));
                if ($mfTime > $fileTime) {
                    $fromCache = false;
                    $this->debug('The file ' . $file . ' is newer than the cache file, cache flag set to FALSE');
                    break;
                } else {
                    $this->debug('Cache file is up to date for ' . $file . ' ' . date('d.m.Y H:i:s',
                        $fileTime) . ' > ' . date('d.m.Y H:i:s',
                        $mfTime));
                }
            }
        }

        //if not from cache, create new cache
        if (!$fromCache) {
            $output = '';
            $this->debug('Generating new cache file');
            foreach ($this->files as $file) {
                $output .= $this->processFile($file);
                $output .= "\n";
            }
            if (file_exists($cache)) {
                $this->debug('Deleting old cache file');
                try {
                    @unlink($cache);
                } catch (ErrorException $e) {
                    // do nothning: the file was probably deleted a milisecond ago
                }

            }
            file_put_contents($cache, $output);
            $this->debug('New cache file saved');
        }

        unset($output);

        return $cache;
    }

    /**
     * Outputs the minified file to browser
     * @return Void
     */
    public function output()
    {
        $outputFile = $this->getCacheFolder() . $this->group_name;
        $output = file_get_contents($outputFile);
        $encoding = $this->getEncoding();

        $ExpHeader = "Expires: " . gmdate("D, d M Y H:i:s", time() + (86400 * $this->cacheDuration)) . " GMT";
        $LMHeader = "Last-Modified: " . gmdate("D, d M Y H:i:s", filemtime($outputFile)) . " GMT";

        header('Content-type: ' . $this->headerType . '; charset=UTF-8');
        header('Cache-Control: max-age=86400, public, must-revalidate'); // 7 days
        header("Pragma: private");
        header("Content-transfer-encoding: binary");
        header($ExpHeader);
        header($LMHeader);

        if ($this->compress) {
            $this->debug('Compress is TRUE');
            if ($encoding !== false) {
                header('Content-Encoding: ' . $encoding);
                header('Accept-Encoding: gzip, deflate');
                echo gzencode($output, 9);
            } else {
                $this->debug('Encoding is FALSE');
                echo $output;
            }
        } else {
            $this->debug('Compress is FALSE');
            echo $output;
        }

        unset($output);
    }

    /**
     * Generates html element to load the css or js of minified file
     * @return String
     */
    public function htmlTagOutput()
    {
        if ($this->_config->mode == 'development') {
            $output = '';
            foreach ($this->files as $f) {
                if ($this->minifyType == 'css') {
                    $mfTime = filemtime($this->cssPath . trim($f));
                    $output .= '<link rel="stylesheet" href="' . $this->themeWebPath . $this->cssFolder . trim($f) . '?lm=' . $mfTime . '" type="text/css" />' . "\n\t";
                } else {
                    $mfTime = filemtime($this->jsPath . trim($f));
                    $output .= '<script type="text/javascript" src="' . $this->themeWebPath . $this->jsFolder . trim($f) . '?lm=' . $mfTime . '"></script>' . "\n\t";
                }
            }

            return $output;
        }

        try {
            $fileTime = filemtime($this->getCacheFolder(true) . $this->group_name);
        } catch (\Exception $e) {
            $fileTime = time();
        }

        $filePath = $this->getCacheFolder(false) . $this->group_name . '?lm=' . $fileTime;
        if ($this->minifyType == 'css') {
            return '<link rel="stylesheet" href="' . $filePath . '" type="text/css" />' . "\n";
        } else {
            return '<script type="text/javascript" src="' . $filePath . '"></script>' . "\n";
        }
    }

    /**
     * Sets abs and web path where to store the cached minified files
     *
     * @param type $abs
     * @param type $web
     */
    public function setCustomCacheFolder($abs, $web)
    {
        $this->customCacheFolder['abs'] = $abs;
        $this->customCacheFolder['web'] = $web;
    }

    /**
     * Returns the minify cache folder path
     *
     * @param Boolean $absPath - return absolute path or web path
     *
     * @return String
     */
    private function getCacheFolder($absPath = true)
    {

        if ($this->customCacheFolder) {
            if ($absPath) {
                return $this->customCacheFolder['abs'];
            } else {
                return $this->customCacheFolder['web'];
            }
        }

        $cacheFolder = $this->_config->public_html . 'cache/minify/';
        if (!is_dir($cacheFolder)) {
            mkdir($cacheFolder, 0775);
        }

        if ($absPath) {
            return $cacheFolder;
        } else {
            return $this->_config->web_path . 'cache/minify/';
        }
    }

    /**
     * Processes the given file
     *
     * @param String $file - file that you want to process
     *
     * @throws \Exception
     * @return minified file
     */
    private function processFile($file)
    {
        if (file_exists($file)) {
            $file = file_get_contents($file);
        } else {
            throw new \Exception('file ' . $file . ' does not exist');
        }

        $file = $this->minifyString($file, $this->minifyType);

        return $file;
    }

    /**
     * Minifies the given string.
     * There are two types of minifier available, css & js.
     *
     * @param String $str         - string to be minified
     * @param String $processType - can be css or js
     *
     * @return minified string
     */
    private function minifyString($str, $processType = 'css')
    {

        if ($processType == 'css') {
            preg_match('|theme/(.*)\/(.*)|', $this->cssRoot, $matches);
		$rootPath = $this->themeWebPath.$matches[1];

		//set web root
		$str = str_replace('src="../', 'src="'.$rootPath.'/../', $str);
	        $str = str_replace("src='../", "src='".$rootPath.'/../', $str);
	        $str = str_replace('url("../', 'url("'.$rootPath.'/../', $str);
	        $str = str_replace("url('../", "url('".$rootPath.'/../', $str);
	        $str = str_replace("url(../", "url(".$rootPath.'/../', $str);
	
                // convert to base path
                $str = preg_replace('#(\.\./)+#', '../', $str);
		
	
			if($this->minify){
				$str = self::_minCSSString($str);
    		}

        } else {
            if ($processType == 'js' && $this->minify) {
                $str = self::_minJSString($str);
            }
        }

        return $str;
    }

    static private function _minJSString(&$str)
    {
        $minifiedJs = JSMin::minify($str);

        /**
         * If a minified string ends with ')' and if we append another file to that, the JavaScript will throw a syntax error.
         * This fixes that.
         */
        if (substr($minifiedJs, -1) == ')') {
            $minifiedJs .= ";\n";
        } else {
            $minifiedJs .= "\n";
        }
        return $minifiedJs;
    }

    static private function _minCSSString(&$str)
    {
        return MinifyCSSCompressor::process($str);
    }

    /**
     * Checks which gzip header encoding is supported by the browser
     *
     * @return String - name of the gzip header that is supported by the browser
     */
    private function getEncoding()
    {

        if (!isset($_SERVER["HTTP_ACCEPT_ENCODING"])) {
            false;
        }

        $HTTP_ACCEPT_ENCODING = $_SERVER["HTTP_ACCEPT_ENCODING"];
        if (headers_sent()) {
            $encoding = false;
        } else {
            if (strpos($HTTP_ACCEPT_ENCODING, 'x-gzip') !== false) {
                $encoding = 'x-gzip';
            } else {
                if (strpos($HTTP_ACCEPT_ENCODING, 'gzip') !== false) {
                    $encoding = 'gzip';
                } else {
                    $encoding = false;
                }
            }
        }

        return $encoding;
    }

    /**
     * Check if the current browser is IE 6
     *
     * @return Boolean
     */
    protected function _isBuggyIe()
    {

        $ua = $_SERVER['HTTP_USER_AGENT'];
        // quick escape for non-IEs
        if (0 !== strpos($ua, 'Mozilla/4.0 (compatible; MSIE ') || false !== strpos($ua, 'Opera')) {
            return false;
        }

		$encodeToIe6 = true;
        // no regex = faaast
        $version = (float)substr($ua, 30);

        return $encodeToIe6 ? ($version < 6 || ($version == 6 && false === strpos($ua, 'SV1'))) : ($version < 7);
    }

    /**
     * Outputs debug messages if Minif::debug is TRUE
     *
     * @param String $msg
     */
    private function debug($msg)
    {
        if ($this->debug) {
            echo "\n######################################################";
            echo "\n#";
            echo "\n# " . $msg;
            echo "\n#";
            echo "\n######################################################";
        }

        return;
    }

}

?>
