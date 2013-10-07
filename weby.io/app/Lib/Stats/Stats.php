<?php

namespace App\Lib\Stats;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use App\Lib\Traits\DatabaseTrait;
use Webiny\Component\StdLib\SingletonTrait;

/**
 * Used for tracking various stats across our site
 * Class Stats
 * @package App\Lib
 */
class Stats extends StatsStorage
{
    /**
     * Activity expiration (in days)
     */
    protected $_activeExpiration = 15; // TODO: move to configuration file!

    /**
     * Initalizes current date values
     */
    public function init()
    {
        $this->_currentYear = date('Y');
        $this->_currentMonth = date('n');
        $this->_currentWeek = date('W');
        $this->_currentDay = date('z');
        $this->_currentDayOfWeek = date('N');
        $this->_currentDayOfMonth = date('j');
        $this->_currentMonthDaysNumber = date('t');
    }

    public function updateUsersLoginCount(UserEntity $user)
    {
        $this->_sqlUpdateUsersLogin($user->getId());
    }

    /**
     * Upgrades statistics for total registered users (when new users login by Facebook or Google)
     */
    public function updateRegisteredUsersCount()
    {
        $this->_sqlUpdateStats(StatsEvents::USER_REGISTERED);
    }

    /**
     * Upgrades statistics for Webies which includes:
     * - total count of Webies created
     * - total count of user's Webies
     */
    public function updateWebiesStats(UserEntity $user)
    {
        // Updates general count of Webies created for current day, week, month and year
        $this->_updateWebiesCreated();

        // Updates count of Webies created for specific user
        $this->_updateUsersWebiesCount($user);
    }

    /**
     * Updates hits for particular Weby (in w_stats_by_ref table and w_weby table)
     * @param WebyEntity $weby
     * @param int $increment
     */
    public function updateWebyHits(WebyEntity $weby, $increment = 1)
    {
        $this->_sqlUpdateRefStats(StatsEvents::WEBY_HIT, $weby->getId(), $increment);
        $this->_sqlUpdateWebyStats('hits', $weby->getId(), $increment);
    }

    /**
     * Updates embedded hits for particular Weby
     * @param WebyEntity $weby
     * @param int $increment
     */
    public function updateWebyEmbeddedHits(WebyEntity $weby, $increment = 1)
    {
        $this->_sqlUpdateRefStats(StatsEvents::WEBY_EMBEDDED_HIT, $weby->getId(), $increment);
        $this->_sqlUpdateWebyStats('hits_embedded', $weby->getId(), $increment);
    }

    /**
     * Gets all stats for given event in form of an array
     * @param String $event Event, use class constants (StatEvents) for easier approach
     * @return Array in which keys are periods - [d], [w], [m], [y]
     */
    public function getStatsForEvent($event)
    {
        return $this->_sqlGetStatsForEvent($event);
    }

    /**
     * Gets stats by day for given event and current week
     * @param String $event
     * @return Array
     */
    public function getCurrentWeekStatsForEvent($event)
    {
        // $currentDay : days (from 1 to 7) - if today is tuesday (day number 189),
        // that means beggining week day number is 189 - (2-1), tuesday is 2nd day of the week
        $weekStartingDay = $this->_currentDay - ($this->_currentDayOfWeek - 1);
        $weekLastDay = $weekStartingDay + 7;
        $result = $this->_sqlGetStatsByDayForEvent($event, $weekStartingDay, $weekLastDay);
        $formatted = array();

        foreach ($result as $data) {
            $formatted[$data['day'] - $weekStartingDay] = $data['value'];
        }

        return $formatted;
    }

    /**
     * Gets stats by day for given event and current month
     * @param String $event
     * @return Array
     */
    public function getCurrentMonthStatsForEvent($event)
    {
        // current day of the month is a number (1-31) - if month starts with day 181(monday) and today is wednesday(183)
        // then we can get starting day number from currentDay(183) - (wednesday(3)-1) => 183-2=181
        $monthStartingDay = $this->_currentDay - ($this->_currentDayOfMonth - 1);
        $monthLastDay = $monthStartingDay + ($this->_currentMonthDaysNumber - 1);
        $result = $this->_sqlGetStatsByDayForEvent($event, $monthStartingDay, $monthLastDay);
        $formatted = array();

        foreach ($result as $data) {
            $formatted[$data['day'] - ($monthStartingDay - 1)] = $data['value'];
        }

        return $formatted;
    }

    /**
     * Gets stats by month for given event and current event
     * @param String $event
     * @return Array
     */
    public function getCurrentYearStatsForEvent($event)
    {
        $result = $this->_sqlGetStatsByMonthForEvent($event);
        $formatted = array();

        foreach ($result as $month) {
            $formatted[$month['month']] = $month['value'];
        }

        return $formatted;
    }

    public function getTotalUsersCount()
    {
        return $this->_sqlGetTotalUsersCount();
    }

    /**
     * Gets top users for current day
     * @return Array
     */
    public function getCurrentDayTopWebies()
    {
        return $this->_sqlGetTopWebies(StatsEvents::DAY, $this->_currentDay);
    }

    /**
     * Gets top users for current week
     * @return Array
     */
    public function getCurrentWeekTopWebies()
    {
        return $this->_sqlGetTopWebies(StatsEvents::WEEK, $this->_currentWeek);
    }

    /**
     * Gets top users for current month
     * @return Array
     */
    public function getCurrentMonthTopWebies()
    {
        return $this->_sqlGetTopWebies(StatsEvents::MONTH, $this->_currentMonth);
    }

    /**
     * Gets top users for current year
     * @return Array
     */
    public function getCurrentYearTopWebies()
    {
        return $this->_sqlGetTopWebies(StatsEvents::YEAR, $this->_currentYear);
    }

    /**
     * Gets top widgets for current day
     * @return Array
     */
    public function getCurrentDayTopWidgets()
    {
        return $this->_sqlGetTopWidgets(StatsEvents::DAY, $this->_currentDay);
    }

    /**
     * Gets top widgets for current week
     * @return Array
     */
    public function getCurrentWeekTopWidgets()
    {
        return $this->_sqlGetTopWidgets(StatsEvents::WEEK, $this->_currentWeek);
    }

    /**
     * Gets top widgets for current month
     * @return Array
     */
    public function getCurrentMonthTopWidgets()
    {
        return $this->_sqlGetTopWidgets(StatsEvents::MONTH, $this->_currentMonth);
    }

    /**
     * Gets top widgets for current year
     * @return Array
     */
    public function getCurrentYearTopWidgets()
    {
        return $this->_sqlGetTopWidgets(StatsEvents::YEAR, $this->_currentYear);
    }

    /**
     * Gets top widgets for current day
     * @return Array
     */
    public function getCurrentDayTopUsers()
    {
        return $this->_sqlGetTopUsers(StatsEvents::DAY, $this->_currentDay);
    }

    /**
     * Gets top widgets for current week
     * @return Array
     */
    public function getCurrentWeekTopUsers()
    {
        return $this->_sqlGetTopUsers(StatsEvents::WEEK, $this->_currentWeek);
    }

    /**
     * Gets top widgets for current month
     * @return Array
     */
    public function getCurrentMonthTopUsers()
    {
        return $this->_sqlGetTopUsers(StatsEvents::MONTH, $this->_currentMonth);
    }

    /**
     * Gets top widgets for current year
     * @return Array
     */
    public function getCurrentYearTopUsers()
    {
        return $this->_sqlGetTopUsers(StatsEvents::YEAR, $this->_currentYear);
    }

    /**
     * Used by our CRON to update daily statistics of inactive users
     */
    public function updateDailyActiveUsersCount()
    {
        $this->_sqlGetPeriodIds();
        $activeUsersCount = $this->_sqlCountActiveUsers();
        $query = "SELECT UPDATE_STATS_VALUE(?,?,?)";
        $bind = [$this->_periodIds['d'], StatsEvents::ACTIVE_USERS, $activeUsersCount];
        $this->db()->execute($query, $bind);
    }

    /**
     * Get's current inactive users count
     * @return \App\Lib\DatabaseResult
     */
    public function getInactiveUsersCount()
    {
        return $this->_sqlCountInactiveUsers();
    }

    /**
     * Get's current active users count
     * @return \App\Lib\DatabaseResult
     */
    public function getActiveUsersCount()
    {
        return $this->_sqlCountActiveUsers();
    }

    /**
     * Updates general and specific Weby widgets stats
     * @param $webyWidgetsCount Array Has to be in format eg. ['instagram' => -4, 'facebook' => 3]
     * @internal param Array $weby
     */
    public function updateWidgetsCount($webyWidgetsCount)
    {
        $total = 0;
        foreach ($webyWidgetsCount as $widget => $count) {
            $widgetAdded = 'W_' . strtoupper($widget) . '_ADDED';
            $total += $count;
            $this->_sqlUpdateStats(StatsEvents::$$widgetAdded, $count);
        }
        // Update total count
        $this->_sqlUpdateStats(StatsEvents::$W_ADDED, $total);
    }

    /**
     * TODO: private ovo mora bit
     * Gets overall stats for selected event
     * @param String $event Event, use class constants (Stat_Events) for easier approach
     * @return Array in which keys are periods - [d], [w], [m], [y]
     */
    public function getOverallStatsForEvent($event)
    {
        $query = "SELECT SUM(s.value) FROM {$this->db()->w_stat_period} sp
                    JOIN {$this->db()->w_stat} s ON s.period = sp.id
                    WHERE sp.type=? AND s.event=?";

        // Get only year stats for selected event
        $bind = [StatsEvents::YEAR, $event];
        $res = $this->db()->execute($query, $bind)->fetchValue();
        return $res ? $res : 0;
    }

    /**
     * Updates user's count of Webies for current period
     * @param \App\Entities\User\UserEntity $user
     * @param int $increment
     * @internal param \App\Entities\User\UserEntity|\App\Entities\Weby\WebyEntity $weby
     */
    private function _updateUsersWebiesCount(UserEntity $user, $increment = 1)
    {
        $this->_sqlUpdateRefStats('creation_user_weby', $user->getId(), $increment);
    }

    /**
     * Upgrades statistics for total count of created Webies
     */
    private function _updateWebiesCreated()
    {
        $this->_sqlUpdateStats(StatsEvents::WEBY_CREATED);
    }

    /**
     * Gets current value for given period (d,w,m or y)
     * @param $period
     * @return mixed
     */
    private function _getCurrentPeriodValue($period)
    {
        if ($period == StatsEvents::DAY) {
            return $this->_currentDay;
        }
        if ($period == StatsEvents::WEEK) {
            return $this->_currentWeek;
        }
        if ($period == StatsEvents::MONTH) {
            return $this->_currentMonth;
        }
        if ($period == StatsEvents::YEAR) {
            return $this->_currentYear;
        }
    }

}