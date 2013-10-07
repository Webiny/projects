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
class StatsStorage
{
    use DatabaseTrait, SingletonTrait;

    // Stores current time data - used by latter SQL queries
    protected $_currentYear;
    protected $_currentMonth;
    protected $_currentWeek;
    protected $_currentDay;
    protected $_currentDayOfWeek;
    protected $_currentDayOfMonth;
    protected $_currentMonthDaysNumber;

    // Used to store ID's of current periods
    protected $_periodIds = [];

    /**
     * Updates stats for given event for increment amount
     * @param $event                    Numeric representation of event (use StatEvent constants)
     * @param int $incrementAmount      Default is 1, but any value can be specified
     */
    protected function _sqlUpdateStats($event, $incrementAmount = 1)
    {
        $this->_sqlGetPeriodIds();

        // uses stored function to emulate ON DUPLICATE KEY UPDATE
        $query = "SELECT UPDATE_STATS(?,?,?)";
        foreach ($this->_periodIds as $id) {
            $bind = array(
                $id,
                $event,
                $incrementAmount
            );
            $this->db()->execute($query, $bind);
        }
    }

    protected function _sqlGetTotalUsersCount() {
        $query = 'SELECT count(*) OVER() total_count FROM ' . $this->db()->w_user;
        return $this->db()->execute($query, [])->fetchValue();
    }
    /**
     * // TODO: add support for pagination and changing years
     * SQL for getting 'Top Webies' stats - list ordered by number of hits (total = hits + embedded_hits)
     * @param $type
     * @param $value
     * @return Array|bool|\StdClass
     */
    protected function _sqlGetTopWebies($type, $value)
    {
        $query = "SELECT sr.ref_type, w.*, u.username, sr.value FROM {$this->db()->w_stat_period} sp
                    LEFT JOIN {$this->db()->w_stat_by_ref} AS sr ON sr.period = sp.id
                    LEFT JOIN {$this->db()->w_weby} AS w ON CAST(w.id AS text) = sr.ref_id
                    LEFT JOIN {$this->db()->w_user} AS u ON u.id = w.user
                    WHERE sp.year=? AND sp.type=? AND sp.value=? AND (ref_type=? OR ref_type=?)
                    ORDER BY sr.value DESC LIMIT 100";

        $bind = array(
            $this->_currentYear,
            $type,
            $value,
            StatsEvents::WEBY_HIT,
            StatsEvents::WEBY_EMBEDDED_HIT
        );
        return $this->db()->execute($query, $bind)->fetchAll();
    }

    /**
     * Updates hit stats in Weby table (used by frontend to minimize load)
     * @param $stat
     * @param $id
     * @param $increment
     * @return mixed
     */
    protected function _sqlUpdateWebyStats($stat, $id, $increment) {
        $query = "UPDATE {$this->db()->w_weby} SET $stat=$stat+? WHERE id=?";
        $bind = [$increment, $id];
        return $this->db()->execute($query, $bind);
    }

    /**
     * @param UserEntity $user
     * @return \App\Lib\DatabaseResult
     */
    protected function _sqlUpdateUsersLogin($user) {
        $query = "UPDATE {$this->db()->w_user} SET signin_count=signin_count+1 WHERE id=?";
        $bind = [$user];
        return $this->db()->execute($query, $bind);
    }
    /**
     * SQL for getting top users (by number of Webies created)
     * @param $type
     * @param $value
     * @param int $page
     * @param int $limit
     * @return Array|bool|\StdClass
     */
    protected function _sqlGetTopUsers($type, $value, $page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;
        $query = "SELECT u.email, u.first_name, u.last_name, u.created_on, u.username, sr.value FROM {$this->db()->w_stat_period} sp
                    LEFT JOIN {$this->db()->w_stat_by_ref} AS sr ON sr.period = sp.id
                    LEFT JOIN {$this->db()->w_user} AS u ON CAST(u.id AS text) = sr.ref_id
                    WHERE sp.year=? AND sp.type=? AND sp.value=? AND ref_type=?
                    ORDER BY sr.value DESC LIMIT {$limit} OFFSET {$offset}";
        $bind = [
            $this->_currentYear,
            $type,
            $value,
            StatsEvents::USER_CREATED_WEBY
        ];
        return $this->db()->execute($query, $bind)->fetchAll();
    }

    /**
     * SQL for updating stat record for specific ref_type, ref_id (eg. ID of user, or Weby), and increment amount
     * @param $refType
     * @param $refId
     * @param int $increment
     * @return bool
     */
    protected function _sqlUpdateRefStats($refType, $refId, $increment = 1)
    {
        $this->_sqlGetPeriodIds();

        $query = "SELECT update_ref_stats(?,?,?,?)";
        foreach ($this->_periodIds as $periodId) {
            $bind = array(
                $periodId,
                $refType,
                $refId,
                $increment,
            );
            $this->db()->execute($query, $bind);
        }
        return true;
    }

    /**
     * SQL for getting widgets that are most used (from highest usage to lowest)
     * @param $type
     * @param $value
     * @return Array|bool|\StdClass
     */
    protected function _sqlGetTopWidgets($type, $value)
    {
        $query = "SELECT s.event, s.value FROM {$this->db()->w_stat_period} sp
                    LEFT JOIN {$this->db()->w_stat} s ON s.period = sp.id
                    WHERE sp.year=? AND sp.type=? AND sp.value=? AND s.event > 100
                    ORDER BY s.value DESC";

        $bind = array(
            $this->_currentYear,
            $type,
            $value
        );
        return $this->db()->execute($query, $bind)->fetchAll();
    }

    /**
     * SQL for getting stats for months of current year and event
     * @param $event
     * @return Array|bool|\StdClass
     */
    protected function _sqlGetStatsByMonthForEvent($event)
    {
        $query = "SELECT sp.value AS month, s.value AS value FROM {$this->db()->w_stat_period} sp
                    JOIN {$this->db()->w_stat} s ON s.period = sp.id WHERE
                    sp.year = ? AND sp.type='m'
                    AND sp.value >= 1 AND sp.value <= 12 AND s.event=? ORDER by sp.value ASC";

        $bind = array(
            $this->_currentYear,
            $event);
        return $this->db()->execute($query, $bind)->fetchAll();
    }

    /**
     * SQL for getting stats for specific day of the year and event
     * @param $event
     * @param int $startDay
     * @param int $finishDay
     * @return Array|bool|\StdClass
     */
    protected function _sqlGetStatsByDayForEvent($event, $startDay = 0, $finishDay = 365)
    {
        $query = "SELECT sp.value AS day, s.value AS value FROM {$this->db()->w_stat_period} sp
                    JOIN {$this->db()->w_stat} s ON s.period = sp.id WHERE
                    sp.year = ? AND sp.type='d'
                    AND sp.value >= ? AND sp.value <= ? AND s.event=? ORDER by sp.value ASC";
        $bind = array(
            $this->_currentYear,
            $startDay,
            $finishDay,
            $event);
        return $this->db()->execute($query, $bind)->fetchAll();
    }

    /**
     * Counts active users
     * @return \App\Lib\DatabaseResult
     */
    protected function _sqlCountActiveUsers()
    {
        // Expiration of active user status (in days)
        $query = "SELECT COUNT(email) FROM w_user WHERE last_login > (NOW() - INTERVAL '{$this->_activeExpiration} days')";
        return $this->db()->execute($query)->fetchValue();
    }

    /**
     * Counts active users
     * @return \App\Lib\DatabaseResult
     */
    protected function _sqlCountInactiveUsers()
    {
        // Expiration of active user status (in days)
        $query = "SELECT COUNT(email) FROM w_user WHERE last_login < (NOW() - INTERVAL '{$this->_activeExpiration} days')";
        return $this->db()->execute($query)->fetchValue();
    }

    /**
     * Gets all stats for given event in form of an array
     * @param String $event Event, use class constants (Stat_Events) for easier approach
     * @return Array in which keys are periods - [d], [w], [m], [y]
     */
    protected function _sqlGetStatsForEvent($event)
    {
        $stats = array();
        $query = "SELECT s.value FROM {$this->db()->w_stat_period} sp
                    JOIN {$this->db()->w_stat} s ON s.period = sp.id
                    WHERE sp.year=? AND sp.type=? AND sp.value=? AND s.event=?";

        $bindValues = array(
            StatsEvents::DAY => $this->_currentDay,
            StatsEvents::WEEK => $this->_currentWeek,
            StatsEvents::MONTH => $this->_currentMonth,
            StatsEvents::YEAR => $this->_currentYear,
        );

        foreach ($bindValues as $period => $current) {
            $bind = array($this->_currentYear, $period, $current, $event);
            $stat = $this->db()->execute($query, $bind)->fetchValue();
            $stats[$period] = !$stat ? 0 : $stat;
        }

        return $stats;
    }

    /**
     * Searches for periods, if they don't exists, then it creates them
     * @internal param \App\Lib\Used $event for creating zero valued statistics
     * @return bool
     */
    protected function _sqlGetPeriodIds()
    {
        if (!empty($this->_periodIds)) {
            return;
        }
        $periodIds = [];

        $bindValues = [
            StatsEvents::DAY => $this->_currentDay,
            StatsEvents::WEEK => $this->_currentWeek,
            StatsEvents::MONTH => $this->_currentMonth,
            StatsEvents::YEAR => $this->_currentYear,
        ];

        $periodsQuery = "SELECT id FROM {$this->db()->w_stat_period} WHERE year=? AND type=? AND value=?";

        foreach ($bindValues as $period => $current) {
            $bind = [$this->_currentYear, $period, $current];
            $id = $this->db()->execute($periodsQuery, $bind)->fetchValue();

            // If our SELECT didn't find current periods, then we create them
            if (!$id) {
                // Insert new periods
                $query = "INSERT INTO {$this->db()->w_stat_period} (year, type, value) VALUES (?,?,?)";
                $this->db()->execute($query, [$this->_currentYear, $period, $current]);
                $id = $this->db()->lastInsertedId($this->db()->w_stat_period);
            }
            $periodIds[$period] = $id;
        }

        // Return all period IDs in form of an array
        $this->_periodIds = $periodIds;
    }

}