<?php

namespace App\Handlers;

use App\Lib\AbstractHandler;
use App\Lib\Traits\DatabaseTrait;
use App\Lib\Stats\Stats;
use App\Lib\Stats\StatsEvents;
use App\Lib\View;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\StdLibTrait;

class StatsHandler extends AbstractHandler
{
    use HttpTrait, StdLibTrait, DatabaseTrait;

    /**
     * Shows main page
     */
    public function index()
    {
    }

    /**
     * Routes stats request to specific method
     */
    public function ajaxGetStats()
    {
        $event = $this->str($this->request()->query('stat'))->replace('_', ' ')->caseWordUpper()->replace(' ', '');
        $methodName = '_get' . $event->val();
        $this->$methodName();
    }

    /**
     * Gets week stats for given event
     */
    public function ajaxGetWeekStats()
    {
        $event = $this->request()->query('event');

        $days = array(0 => 'Mon', 1 => 'Tue', 2 => 'Wed', 3 => 'Thu', 4 => 'Fri', 5 => 'Sat', 6 => 'Sun');
        $weekStats = Stats::getInstance()->getCurrentWeekStatsForEvent($event);

        if ($weekStats) {
            $formattedWeekStats = array();
            foreach ($weekStats as $k => $v) {
                $formattedWeekStats[$days[$k]] = $v;
            }
            $this->ajaxResponse(false, 'Week', $formattedWeekStats);
        }
        $this->ajaxResponse(true, 'No data present.');
    }

    /**
     * Gets month stats for given event
     */
    public function ajaxGetMonthStats()
    {
        $event = $this->request()->query('event');
        $wStats = Stats::getInstance();
        $monthStats = $wStats->getCurrentMonthStatsForEvent($event);
        $this->ajaxResponse(false, 'Month', $monthStats);
    }

    /**
     * Gets year stats for given event
     */
    public function ajaxGetYearStats()
    {
        $event = $this->request()->query('event');
        $months = array(
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'May', 6 => 'Jun',
            7 => 'Jul', 8 => 'Sep', 9 => 'Aug', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec');
        $wStats = Stats::getInstance();
        $yearStats = $wStats->getCurrentYearStatsForEvent($event);
        $formatted = array();
        foreach ($yearStats as $k => $v) {
            $formatted[$months[$k]] = $v;
        }

        $this->ajaxResponse(false, 'Year', $formatted);
    }

    public function ajaxGetWidgetUsageStats()
    {
        $period = $this->request()->query('period');
        $wStats = Stats::getInstance();

        $view = View::getInstance();

        $stats['title'] = 'Widgets by usage';

        switch ($period) {
            case 'today':
                $stats['widgets'] = $wStats->getCurrentDayTopWidgets();
                break;
            case 'week':
                $stats['widgets'] = $wStats->getCurrentWeekTopWidgets();
                break;
            case 'month':
                $stats['widgets'] = $wStats->getCurrentMonthTopWidgets();
                break;
            case 'year':
                $stats['widgets'] = $wStats->getCurrentYearTopWidgets();
                break;
        }

        foreach ($stats['widgets'] as $w) {
            $w['widgetName'] = StatsEvents::getToolName($w['event']);
        }

        if ($stats['widgets']->count()) {
            $this->ajaxResponse(false, '', [$view->fetch('templates/stats/includes/usage_widgets.tpl', $stats)]);
        }
        $this->ajaxResponse(true, '', [$view->fetch('templates/stats/includes/no_data.tpl', $stats)]);

    }

    public function ajaxGetActiveUsersStats()
    {
        $period = $this->request()->query('period');
        $wStats = Stats::getInstance();
        $view = View::getInstance();

        $stats['title'] = 'Widgets by usage';

        switch ($period) {
            case 'today':
                $stats['users'] = $wStats->getCurrentDayTopUsers();
                break;
            case 'week':
                $stats['users'] = $wStats->getCurrentWeekTopUsers();
                break;
            case 'month':
                $stats['users'] = $wStats->getCurrentMonthTopUsers();
                break;
            case 'year':
                $stats['users'] = $wStats->getCurrentYearTopUsers();
                break;
        }

        if ($stats['users']->count()) {
            $this->ajaxResponse(false, '', [$view->fetch('templates/stats/includes/active_users.tpl', $stats)]);
        }
        $this->ajaxResponse(true, '', [$view->fetch('templates/stats/includes/no_data.tpl', $stats)]);

    }

    public function ajaxGetTopUsersStats()
    {
        $period = $this->request()->query('period');
        $view = View::getInstance();

        $stats['title'] = 'Widgets by usage';
        $stats['users'] = Stats::getInstance()->getTopUsers($period[0], false, 1, 10);


        if ($stats['users']->count()) {
            $this->ajaxResponse(false, '', [$view->fetch('templates/stats/includes/top_users.tpl', $stats)]);
        }
        $this->ajaxResponse(true, '', [$view->fetch('templates/stats/includes/no_data.tpl', $stats)]);

    }

    public function ajaxGetTopWebiesStats()
    {
        $period = $this->request()->query('period');
        $wStats = Stats::getInstance();
        $view = View::getInstance();

        $stats['title'] = 'Widgets by usage';

        switch ($period) {
            case 'today':
                $stats['webies'] = $wStats->getCurrentDayTopWebies();
                break;
            case 'week':
                $stats['webies'] = $wStats->getCurrentWeekTopWebies();
                break;
            case 'month':
                $stats['webies'] = $wStats->getCurrentMonthTopWebies();
                break;
            case 'year':
                $stats['webies'] = $wStats->getCurrentYearTopWebies();
                break;
        }

        $stats['webPath'] = $this->app()->getConfig()->app->web_path;
        if ($stats['webies']->count()) {
            $this->ajaxResponse(false, '', [$view->fetch('templates/stats/includes/top_webies.tpl', $stats)]);
        }
        $this->ajaxResponse(true, '', [$view->fetch('templates/stats/includes/no_data.tpl', $stats)]);

    }

    private function _get_widget_usage_stats()
    {
        $this->_getPeriodSelector('Widgets by usage', 'widget_usage');
    }

    private function _getTopUser()
    {
        $this->_getPeriodSelector('Top users', 'top_users');
    }

    private function _getTopWebies()
    {
        $this->_getPeriodSelector('Top webies', 'top_webies');
    }

    /** Users: general number of active users */
    private function _getActiveUsers()
    {
        $view = View::getInstance();

        $wStats = Stats::getInstance();
        $stats['active'] = $wStats->getActiveUsersCount();
        $stats['inactive'] = $wStats->getInactiveUsersCount();
        $stats['title'] = 'Active users';
        $stats['event'] = StatsEvents::ACTIVE_USERS;

        $this->ajaxResponse(false, '', $view->fetch('templates/stats/includes/active_users.tpl', $stats));
    }

    /**
     * Widgets: General statistics on created Users
     */
    private function _getRegisteredUsers()
    {
        $this->_getStandardDataView(StatsEvents::USER_REGISTERED, 'Users registered');
    }

    /**
     * Widgets: General statistics on created Webies
     */
    private function _getCreatedWebies()
    {
        $this->_getStandardDataView(StatsEvents::WEBY_CREATED, 'Webies created');
    }

    /**
     * Widgets: General statistics on added widgets
     */
    private function _getWidgetGeneral()
    {
        $this->_getStandardDataView(StatsEvents::$W_ADDED, 'Created widgets');
    }

    /**
     * Widgets: Text added stats
     */
    private function _getWidgetText()
    {
        $this->_getStandardDataView(StatsEvents::$W_TEXT_ADDED, 'Widgets: Text added');
    }

    /**
     * Widgets: Link added stats
     */
    private function _getWidgetLink()
    {
        $this->_getStandardDataView(StatsEvents::$W_LINK_ADDED, 'Widgets: Link added');
    }

    /**
     * Widgets: Video added stats
     */
    private function _getWidgetVideo()
    {
        $this->_getStandardDataView(StatsEvents::$W_VIDEO_ADDED, 'Widgets: Video added');
    }

    /**
     * Widgets: Map added stats
     */
    private function _getWidgetMap()
    {
        $this->_getStandardDataView(StatsEvents::$W_MAP_ADDED, 'Widgets: Google map added');
    }

    /**
     * Widgets: Instagram added stats
     */
    private function _getWidgetInstagram()
    {
        $this->_getStandardDataView(StatsEvents::$W_INSTAGRAM_ADDED, 'Widgets: Instagram added');
    }

    /**
     * Widgets: Pinterest added stats
     */
    private function _getWidgetPinterest()
    {
        $this->_getStandardDataView(StatsEvents::$W_PINTEREST_ADDED, 'Widgets: Pinterest added');
    }

    /**
     * Widgets: Facebook added stats
     */
    private function _getWidgetFacebook()
    {
        $this->_getStandardDataView(StatsEvents::$W_FACEBOOK_ADDED, 'Widgets: Facebook added');
    }

    /**
     * Widgets: Slideshare added stats
     */
    private function _getWidgetSlideshare()
    {
        $this->_getStandardDataView(StatsEvents::$W_SLIDESHARE_ADDED, 'Widgets: Slideshare added');
    }

    /**
     * Widgets: GoogleDrive added stats
     */
    private function _getWidgetGoogledrive()
    {
        $this->_getStandardDataView(StatsEvents::$W_GOOGLEDRIVE_ADDED, 'Widgets: Google drive added');
    }

    /**
     * Widgets: SkyDrive added stats
     */
    private function _getWidgetSkydrive()
    {
        $this->_getStandardDataView(StatsEvents::$W_SKYDRIVE_ADDED, 'Widgets: SkyDrive added');
    }

    /**
     * Widgets: Soundcloud added stats
     */
    private function _getWidgetSoundcloud()
    {
        $this->_getStandardDataView(StatsEvents::$W_SOUNDCLOUD_ADDED, 'Widgets: Soundcloud added');
    }

    /**
     * Widgets: LinkedIn added stats
     */
    private function _getWidgetLinkedin()
    {
        $this->_getStandardDataView(StatsEvents::$W_LINKEDIN_ADDED, 'Widgets: Linked In added');
    }

    /**
     * Widgets: Tweets added stats
     */
    private function _getWidgetTweet()
    {
        $this->_getStandardDataView(StatsEvents::$W_TWITTER_ADDED, 'Widgets: Twitter added');
    }

    /**
     * Widgets: Vine added stats
     */
    private function _getWidgetVine()
    {
        $this->_getStandardDataView(StatsEvents::$W_VINE_ADDED, 'Widgets: Vine added');
    }

    /**
     * Widgets: Flickr added stats
     */
    private function _getWidgetFlickr()
    {
        $this->_getStandardDataView(StatsEvents::$W_FLICKER_ADDED, 'Widgets: Flickr added');
    }

    /**
     * OAuth: Facebook sign-ins stats
     */
    private function _getOauthFacebook()
    {
        $this->_getStandardDataView(StatsEvents::OAUTH_SIGN_IN_BY_FACEBOOK, 'OAuth: Sign in with Facebook');
    }

    /**
     * OAuth: Google sign-ins stats
     */
    private function _getOauthGoogle()
    {
        $this->_getStandardDataView(StatsEvents::OAUTH_SIGN_IN_BY_GOOGLE, 'OAuth: Sign in with Google');
    }

    /**
     * OAuth: LinkedIn sign-ins stats
     */
    private function _getOauthLinkedin()
    {
        $this->_getStandardDataView(StatsEvents::OAUTH_SIGN_IN_BY_LINKEDIN, 'OAuth: Sign in with Linked In');
    }

    /**
     * Used for data that is shown in table on certain order
     * @param $title
     * @param $stats
     * @param string $template
     */
    private function _getPeriodSelector($title, $stats, $template = 'period_selector')
    {
        $view = View::getInstance();
        $data['title'] = $title;
        $data['stat'] = $stats;
        $this->ajaxResponse(false, '', [$view->fetch('templates/stats/includes/' . $template . '.tpl', $data)]);
    }

    /**
     * Shows standard template with periods stats and chart
     * @param $event
     * @param $title
     * @param $template
     */
    private function _getStandardDataView($event, $title, $template = 'standard_data_presentation')
    {
        $view = View::getInstance();

        $wStats = Stats::getInstance();
        $stats = $wStats->getStatsForEvent($event);
        $stats['overallStats'] = $wStats->getOverallStatsForEvent($event);
        $stats['title'] = $title;
        $stats['event'] = $event;
        $stats['dayOfWeek'] = date('N');
        $stats['dayOfMonth'] = date('j');
        $stats['monthOfYear'] = date('m');

        $this->ajaxResponse(false, '', $view->fetch('templates/stats/includes/' . $template . '.tpl', $stats));
    }

}