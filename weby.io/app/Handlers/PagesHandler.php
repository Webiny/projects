<?php

namespace App\Handlers;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use App\Lib\AbstractHandler;
use App\Lib\Stats\Stats;
use App\Lib\UserTrait;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Security\Authentication\Providers\Http\Http;
use Webiny\Component\Security\SecurityTrait;

class PagesHandler extends AbstractHandler
{
    use SecurityTrait, HttpTrait, AppTrait, UserTrait;

    /**
     * Limit when showing lists pages (depends on used layout)
     * @var int
     */
    private $_listLimit = 9;

    /**
     * Used to show homepage (login options)
     */
    public function index()
    {
        $user = $this->security()->getUser();
        if ($user && $user->isAuthenticated()) {
            $this->request()->redirect($this->user()->getProfileUrl());
        }
    }

    /**
     * Used for viewing Weby pages (public area)
     * @param $user
     * @param $slug
     * @param $id
     */
    public function viewWeby($user, $slug, $id)
    {
        // Try to load Weby
        $weby = new WebyEntity();
        $weby->load($id);

        // Will check if requested Weby and URL params are valid
        $this->_checkRequest($weby, $user, $slug, $id);

        // Assign whole weby to $this, so we can pass it to view
        $this->weby = $weby;
        $this->shareCount = $weby->getShareCount();

        if ($this->request()->query('embed', false, true)) {
            $this->setTemplate('embed');
            return;
        }

        $this->setTemplate('weby');
        Stats::getInstance()->updateWebyHits($weby);
    }

    /**
     * Shows 404 page
     */
    public function page404()
    {
    }

    /**
     * Shows about page
     */
    public function about()
    {
    }

    /**
     * Gets recent Webies
     * @param int $page         Number of page
     * @internal param \App\Handlers\ID $user of tag
     * @internal param $json
     */
    public function listRecentWebies($page = 1)
    {
        $json = $this->request()->post('json');
        $this->page = $page;
        if ($json) {
            $result = WebyEntity::listRecentWebies($page, $this->_listLimit);
            if ($result->count()) {
                $totalWebiesCount = $result[0]['total_count'];
                $pagination = $this->_getNavigation($totalWebiesCount, $page, $this->_listLimit);

                $webiesArr = [];
                $weby = new WebyEntity();
                foreach ($result as $w) {
                    $weby->load($w['id']);
                    $webiesArr[] = $weby->toListArray();
                }

                $this->ajaxResponse(false, '', ['webies' => $webiesArr, 'pagination' => $pagination]);
            }
            $this->ajaxResponse(false, '', []);
        }
    }

    /**
     * Gets Webies by user that current user is following
     * @param int $page         Number of page
     * @internal param \App\Handlers\ID $user of tag
     * @internal param $json
     */
    public function listFollowingWebies($page = 1)
    {
        $json = $this->request()->post('json');
        $this->page = $page;
        if (!$this->user()) {
            $this->request()->redirect($this->app()->getConfig()->app->web_path);
        }
        if ($json) {
            $result = WebyEntity::listFollowingWebies($this->user()->getId(), $page, $this->_listLimit);
            if ($result->count()) {
                $totalWebiesCount = $result[0]['total_count'];
                $pagination = $this->_getNavigation($totalWebiesCount, $page, $this->_listLimit);

                $webiesArr = [];
                $weby = new WebyEntity();
                foreach ($result as $w) {
                    $weby->load($w['id']);
                    $webiesArr[] = $weby->toListArray();
                }

                $this->ajaxResponse(false, '', ['webies' => $webiesArr, 'pagination' => $pagination]);
            }
            $this->ajaxResponse(false, '', []);
        }
    }

    /**
     * Searching Webies by a single user (eg. when clicking on a tag that directly leads to this action)
     * @param $username              ID of tag
     * @param int $page         Number of page
     * @internal param $json
     */
    public function listWebiesByUser($username, $page = 1)
    {
        $json = $this->request()->post('json');
        $this->page = $page;
        if ($json) {
            $result = WebyEntity::listWebiesByUser($username, $page, $this->_listLimit);
            if ($result->count()) {
                $totalWebiesCount = $result[0]['total_count'];
                $pagination = $this->_getNavigation($totalWebiesCount, $page, $this->_listLimit);

                $webiesArr = [];
                $weby = new WebyEntity();
                foreach ($result as $w) {
                    $weby->load($w['id']);
                    $webiesArr[] = $weby->toListArray();
                }

                $this->ajaxResponse(false, '', ['webies' => $webiesArr, 'pagination' => $pagination]);
            }
            $this->ajaxResponse(false, 'End of results', []);
        } else {
            $this->searchingUser = UserEntity::getByUsername($username);
        }
    }

    /**
     * Searching Webies by a single tag (eg. when clicking on a tag that directly leads to this action)
     * @param $tag              ID of tag
     * @param int $page         Number of page
     * @internal param $json
     */
    public function listWebiesByTag($tag, $page = 1)
    {
        $this->tag = $tag;
        $this->page = $page;
        $json = $this->request()->post('json');
        if ($json) {
            $result = WebyEntity::listWebiesByTag($tag, $page, $this->_listLimit);
            if ($result->count()) {
                $totalWebiesCount = $result[0]['total_count'];
                $pagination = $this->_getNavigation($totalWebiesCount, $page, $this->_listLimit);

                $webiesArr = [];
                $weby = new WebyEntity();
                foreach ($result as $w) {
                    $weby->load($w['id']);
                    $webiesArr[] = $weby->toListArray();
                }

                $this->ajaxResponse(false, '', ['webies' => $webiesArr, 'pagination' => $pagination]);
            }
            $this->ajaxResponse(false, '', []);
        }
    }

    /**
     * Generates pagination
     * @param $count
     * @param $page
     * @param $diplaynum
     * @param bool $hasP1
     * @param bool $returnArray
     * @return array|string
     */
    private function _getNavigation($count, $page, $diplaynum, $hasP1 = TRUE, $returnArray=false)
    {
        $links = array('prev'=>'','next'=>'','pages'=>array());
        if ($count < $diplaynum || $diplaynum < 1)
        {
            if($returnArray)
            {
                return array('html'=>'', 'array'=>$links);
            }
            return;
        }

        $output = "";
        $numOfPages = ceil($count / $diplaynum);
        $totalOfPages = $numOfPages;

        if (($page + 9) > $numOfPages) {
            $numOfPages = $numOfPages;
            $cur_page = $page - 5;
            if ($cur_page <= 0) {
                $cur_page = 1;
            }
        } else {
            if (($page - 5) > 0) {
                $numOfPages = $page + 5;
            } else {
                $numOfPages = 10;
            }
            $cur_page = $page - 5;
            if ($cur_page <= 0) {
                $cur_page = 1;
            }
        }

        if (preg_match('/([0-9]{1,9})$/', $_SERVER ['REQUEST_URI'])) {
            $page_uri = preg_replace('/([0-9]{1,9})$/', '{page}', $_SERVER ['REQUEST_URI']);
        } else {
            $urlData = parse_url($_SERVER ['REQUEST_URI']);
            if (isset($urlData['query']) && $urlData['query'] != "") {
                $page_uri = $_SERVER ['REQUEST_URI'] . '&{page}';
            } else {
                $page_uri = $_SERVER ['REQUEST_URI'] . '?{page}';
            }
        }

        if (!preg_match("/page={page}/", $page_uri)) {
            $page_uri = $page_uri;
        }

        for ($i = $cur_page; $i <= $numOfPages; $i++) {
            if (!$hasP1 && $i == 1) {
                $tpage_uri = str_replace("?{page}", "", $page_uri);
                $tpage_uri = str_replace("&{page}", "", $tpage_uri);
                if ($i == $page) {
                    $cpLink = "<a class=\"pagination-active\" href=\"" . $tpage_uri . "\">$i</a>";
                    $output .= $cpLink."\n";
                    $selected = true;
                } else {
                    $cpLink = "<a href=\"" . $tpage_uri . "\">$i</a>";
                    $output .= $cpLink."\n";
                    $selected = false;
                }
                $links['pages'][] = array('href'=>$tpage_uri,'page'=>$i,'selected'=>$selected);
            } else {
                if ($i == $page)
                {
                    $href = str_replace("{page}", $i, $page_uri);
                    $output .= "<a class=\"pagination-active\" href=\"" . $href . "\">$i</a>\n";
                    $selected = true;
                } else
                {
                    $href = str_replace("{page}", $i, $page_uri);
                    $output .= "<a href=\"" . $href . "\">$i</a>\n";
                    $selected = false;
                }
                $links['pages'][] = array('href'=>$href,'page'=>$i,'selected'=>$selected);
            }
        }

        $previous_link = "\n";
        if(($page - 1) >= 1)
        {
            if(($page-1)==1 && !$hasP1)
            {
                $href = str_replace("?{page}", "", $page_uri);
                $href = str_replace("&{page}", "", $href);
            }else{
                $href = str_replace("{page}", $page - 1, $page_uri);
            }

            $previous_link = "<a class=\"prev\" href=\"" . $href . "\">  &lt;&lt; </a>";
            $links['prev'] = $href;
        }

        $next_link = "\n";
        if(($page + 1) <= $numOfPages)
        {
            $href = str_replace("{page}", $page + 1, $page_uri);
            $next_link = "<a class=\"next\" href=\"" . $href . "\">  &gt;&gt; </a>";
            $links['next'] = $href;
        }

        $link = '<p class="paging">' . $previous_link . $output . $next_link . '</p>';

        if($returnArray)
        {
            return array('html'=>$link, 'array'=>$links);
        }else{
            return $link;
        }
    }

    /**
     * Used for checking request, if user has edited an URL, we will automatically redirect them to correct one
     * @param $weby WebyEntity
     * @param $user String
     * @param $slug String
     * @param $id String
     */
    private function _checkRequest($weby, $user, $slug, $id)
    {
        // We will need config for latter use of paths
        $cfg = $this->app()->getConfig()->app;

        // If Weby was created by a valid user, that means given Weby ID was okay, else redirect to 404 page
        if (!$weby->getUser()->getEmail()) {
            $this->request()->redirect($cfg->web_path, 404);
        }

        // If user edited username or title, redirect him to proper URL via 301 header data
        if ($weby->getSlug() != $slug || $weby->getUser()->getUsername() != $user) {
            $url = $cfg->web_path . $weby->getUser()->getUsername() . '/' . $weby->getSlug() . '/' . $id . '/';
            if ($this->request()->query('embed', false)) {
                $url .= '?embed=true';
            }
            $this->request()->redirect($url, 301);
        }
    }

}