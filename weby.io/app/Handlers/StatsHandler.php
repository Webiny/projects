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
    public function live()
    {

    }

    public function ajaxGetTotalUsersCount()
    {
        $total = Stats::getInstance()->getTotalUsersCount();
        $this->ajaxResponse(false, '', ['count' => $total]);
    }

    /**
     * Routes stats request to specific method
     */
    public function ajaxGetStats()
    {
        $event = $this->str($this->request()->post('stat'))->replace('_', ' ')->caseWordUpper()->replace(' ', '');
        $methodName = '_get' . $event->val();
        $this->$methodName();
    }

    /**
     * Gets week stats for given event
     */
    public function ajaxGetWeekStats()
    {
        $event = $this->request()->query('stat');

        $days = array(0 => 'Mon', 1 => 'Tue', 2 => 'Wed', 3 => 'Thu', 4 => 'Fri', 5 => 'Sat', 6 => 'Sun');
        $weekStats = Stats::getInstance()->getCurrentWeekStatsForEvent($event);

        $data = [];
        if ($weekStats) {
            $data['chart']['columns'] = [
                ['type' => 'string', 'title' => 'Day'],
                ['type' => 'number', 'title' => 'Count']
            ];

            foreach ($weekStats as $k => $v) {
                $data['chart']['rows'][] = [
                    'day' => $days[$k],
                    'count' => (int)$v
                ];
            }
            $this->ajaxResponse(false, '', $data);
        }
        $this->ajaxResponse(true, 'No data present.');
    }

    /**
     * Gets month stats for given event
     */
    public function ajaxGetMonthStats()
    {
        $event = $this->request()->query('stat');
        $monthStats = Stats::getInstance()->getCurrentMonthStatsForEvent($event);
        $data = [];
        if ($monthStats) {
            $data['chart']['columns'] = [
                ['type' => 'number', 'title' => 'Day'],
                ['type' => 'number', 'title' => 'Count']
            ];

            foreach ($monthStats as $k => $v) {
                $data['chart']['rows'][] = [
                    'day' => (int)$k,
                    'count' => (int)$v
                ];
            }
            $this->ajaxResponse(false, '', $data);
        }
        $this->ajaxResponse(true, 'No data present.');

    }

    /**
     * Gets year stats for given event
     */
    public function ajaxGetYearStats()
    {
        $event = $this->request()->query('stat');
        $months = array(
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'May', 6 => 'Jun',
            7 => 'Jul', 8 => 'Sep', 9 => 'Aug', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec');
        $yearStats = Stats::getInstance()->getCurrentYearStatsForEvent($event);

        $data = [];
        if ($yearStats) {
            $data['chart']['columns'] = [
                ['type' => 'string', 'title' => 'Month'],
                ['type' => 'number', 'title' => 'Count']
            ];
            foreach ($yearStats as $k => $v) {
                $data['chart']['rows'][] = [
                    'month' => $months[$k],
                    'count' => (int)$v
                ];
            }
            $this->ajaxResponse(false, '', $data);
        }
        $this->ajaxResponse(true, 'No data present.');
    }

    /**
     * General statistics on registered users
     */
    private function _getRegisteredUsers()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::USER_REGISTERED));
    }

    /**
     * Widgets: General statistics on created Webies
     */
    private function _getCreatedWebies()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::WEBY_CREATED));
    }

    /**
     * Widgets: General statistics on added widgets
     */
    private function _getWidgetGeneral()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_ADDED));
    }

    /**
     * Widgets: Text added stats
     */
    private function _getWidgetText()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_TEXT_ADDED));
    }

    /**
     * Widgets: Link added stats
     */
    private function _getWidgetLink()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_LINK_ADDED));
    }

    /**
     * Widgets: Video added stats
     */
    private function _getWidgetVideo()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_VIDEO_ADDED));
    }

    /**
     * Widgets: Map added stats
     */
    private function _getWidgetMap()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_MAP_ADDED));
    }

    /**
     * Widgets: Instagram added stats
     */
    private function _getWidgetInstagram()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_INSTAGRAM_ADDED));
    }

    /**
     * Widgets: Pinterest added stats
     */
    private function _getWidgetPinterest()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_PINTEREST_ADDED));
    }

    /**
     * Widgets: Facebook added stats
     */
    private function _getWidgetFacebook()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_FACEBOOK_ADDED));
    }

    /**
     * Widgets: Slideshare added stats
     */
    private function _getWidgetSlideshare()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_SLIDESHARE_ADDED));
    }

    /**
     * Widgets: GoogleDrive added stats
     */
    private function _getWidgetGoogledrive()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_GOOGLEDRIVE_ADDED));
    }

    /**
     * Widgets: SkyDrive added stats
     */
    private function _getWidgetSkydrive()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_SKYDRIVE_ADDED));
    }

    /**
     * Widgets: Soundcloud added stats
     */
    private function _getWidgetSoundcloud()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_SOUNDCLOUD_ADDED));
    }

    /**
     * Widgets: LinkedIn added stats
     */
    private function _getWidgetLinkedin()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_LINKEDIN_ADDED));
    }

    /**
     * Widgets: Tweets added stats
     */
    private function _getWidgetTweet()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_TWITTER_ADDED));
    }

    /**
     * Widgets: Vine added stats
     */
    private function _getWidgetVine()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_VINE_ADDED));
    }

    /**
     * Widgets: Flickr added stats
     */
    private function _getWidgetFlickr()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_FLICKER_ADDED));
    }

    /**
     * Widgets: GooglePlus added stats
     */
    private function _getWidgetGoogleplus()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_GOOGLEPLUS_ADDED));
    }

    /**
     * Widgets: wEBY added stats
     */
    private function _getWidgetWeby()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::$W_WEBY_ADDED));
    }

    /**
     * OAuth: Facebook sign-ins stats
     */
    private function _getOauthFacebook()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::OAUTH_SIGN_IN_BY_FACEBOOK));
    }

    /**
     * OAuth: Google sign-ins stats
     */
    private function _getOauthGoogle()
    {
        $this->ajaxResponse(false, '', $this->_getPeriodicalData(StatsEvents::OAUTH_SIGN_IN_BY_GOOGLE));
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

    private function _getWidgetUsage()
    {
        $method = 'getCurrent' . ucfirst($this->request()->post('period')) . 'TopWidgets';
        $stats = Stats::getInstance()->$method();

        $data['grid']['columns'] = [
            ['field' => 'widget', 'title' => 'Widget'],
            ['field' => 'count', 'title' => 'Count']
        ];

        foreach ($stats as $w) {
            $data['grid']['rows'][] = [
                'widget' => StatsEvents::getToolName($w['event']),
                'count' => (int)$w['value']
            ];
        }

        $data['chart']['columns'] = [
            ['type' => 'string', 'title' => 'Widgets'],
            ['type' => 'number', 'title' => 'Count']
        ];

        $data['chart']['rows'] = $data['grid']['rows'];
        $data['chart']['type'] = 'column';

        $this->ajaxResponse(false, ucfirst($this->request()->post('period')), $data);
    }

    public function _getTopUsers()
    {

        $method = 'getCurrent' . ucfirst($this->request()->post('period')) . 'TopUsers';
        $stats = Stats::getInstance()->$method();

        $data['grid']['columns'] = [
            ['field' => 'user', 'title' => 'User'],
            ['field' => 'count', 'title' => 'Count']
        ];

        foreach ($stats as $u) {
            $data['grid']['rows'][] = [
                'user' => $u['username'],
                'count' => (int)$u['value']
            ];
        }

        $data['chart']['columns'] = [
            ['type' => 'string', 'title' => 'Users'],
            ['type' => 'number', 'title' => 'Count']
        ];

        $data['chart']['rows'] = $data['grid']['rows'];
        $data['chart']['type'] = 'column';

        $this->ajaxResponse(false, ucfirst($this->request()->post('period')), $data);
    }

    public function _getTopWebies()
    {
        $method = 'getCurrent' . ucfirst($this->request()->post('period')) . 'TopWebies';
        $stats = Stats::getInstance()->$method();

        $data['grid']['columns'] = [
            ['field' => 'weby', 'title' => 'Weby'],
            ['field' => 'count', 'title' => 'Hits']
        ];

        foreach ($stats as $w) {
            $data['grid']['rows'][] = [
                'weby' => $w['title'],
                'count' => (int)$w['value']
            ];
        }

        $data['chart']['columns'] = [
            ['type' => 'string', 'title' => 'Weby'],
            ['type' => 'number', 'title' => 'Count']
        ];

        $data['chart']['rows'] = $data['grid']['rows'];
        $data['chart']['type'] = 'column';

        $this->ajaxResponse(false, ucfirst($this->request()->post('period')), $data);

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
     * Prepares data for showing in the table (used only for standard d, w, m and y data
     */
    private function _getPeriodicalData($event)
    {
        $map = ['d' => 'Day', 'w' => 'Week', 'm' => 'Month', 'y' => 'Year'];
        $stats = Stats::getInstance()->getStatsForEvent($event);

        $data['grid']['columns'] = [
            ['field' => 'period', 'title' => 'Period'],
            ['field' => 'count', 'title' => 'Count']
        ];

        foreach ($stats as $period => $value) {
            $data['grid']['rows'][] = ['period' => $map[$period], 'count' => $value];
        }
        return $data;
    }

}