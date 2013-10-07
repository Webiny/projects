<?php

namespace App\Lib\Stats;

/**
 * Here we store all numerical representations of each event that will be saved in database
 * Additionally, all periods and ref types are listed here (w_stat_by_ref table)
 * Class StatsEvents
 * @package App\Lib\Stats
 */
class StatsEvents
{
    // All periods (day, week, month, year)
    const DAY = 'd';
    const WEEK = 'w';
    const MONTH = 'm';
    const YEAR = 'y';

    // Ref types
    const WEBY_EMBEDDED_HIT = 'hit_embedded_weby';
    const WEBY_HIT = 'hit_weby';
    const USER_CREATED_WEBY = 'creation_user_weby';

    // Events
    const USER_REGISTERED = 1;
    const ACTIVE_USERS = 2;
    const WEBY_CREATED = 3;
    const OAUTH_SIGN_IN_BY_FACEBOOK = 4;
    const OAUTH_SIGN_IN_BY_GOOGLE = 5;
    const OAUTH_SIGN_IN_BY_LINKEDIN = 6;

    // Widgets added events (MUST have format of W_{WIDGETNAME}_ADDED)
    public static $W_ADDED = 100;
    public static $W_TEXT_ADDED = 101;
    public static $W_LINK_ADDED = 102;
    public static $W_VIDEO_ADDED = 103;
    public static $W_MAP_ADDED = 104;
    public static $W_INSTAGRAM_ADDED = 105;
    public static $W_PINTEREST_ADDED = 106;
    public static $W_FACEBOOK_ADDED = 107;
    public static $W_SLIDESHARE_ADDED = 109;
    public static $W_GOOGLEDRIVE_ADDED = 110;
    public static $W_SKYDRIVE_ADDED = 111;
    public static $W_SOUNDCLOUD_ADDED = 112;
    public static $W_LINKEDIN_ADDED = 113;
    public static $W_TWITTER_ADDED = 114;
    public static $W_VINE_ADDED = 115;
    public static $W_FLICKER_ADDED = 116;
    public static $W_GOOGLEPLUS_ADDED = 117;
    public static $W_WEBY_ADDED = 118;

    /**
     * Gets tool name from given ID
     * @param $numericRepresentation
     * @return mixed
     */
    public static function getToolName($numericRepresentation)
    {
        $map = [
            self::$W_TEXT_ADDED => 'Text',
            self::$W_LINK_ADDED => 'Link',
            self::$W_VIDEO_ADDED => 'Video',
            self::$W_MAP_ADDED => 'Google Map',
            self::$W_INSTAGRAM_ADDED => 'Instagram',
            self::$W_PINTEREST_ADDED => 'Pinterest',
            self::$W_FACEBOOK_ADDED => 'Facebook',
            self::$W_SLIDESHARE_ADDED => 'Slideshare',
            self::$W_GOOGLEDRIVE_ADDED => 'GoogleDrive',
            self::$W_SKYDRIVE_ADDED => 'SkyDrive',
            self::$W_SOUNDCLOUD_ADDED => 'Sound Cloud',
            self::$W_LINKEDIN_ADDED => 'LinkedIn',
            self::$W_TWITTER_ADDED => 'Tweet',
            self::$W_VINE_ADDED => 'Vine',
            self::$W_FLICKER_ADDED => 'Flickr',
            self::$W_GOOGLEPLUS_ADDED => 'Google Plus',
            self::$W_WEBY_ADDED = 'Weby Embed'
        ];

        return $map[$numericRepresentation];
    }
}