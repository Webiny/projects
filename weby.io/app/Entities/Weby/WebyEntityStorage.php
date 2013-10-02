<?php

namespace App\Entities\Weby;

use App\Entities\EntityAbstract;
use App\Entities\User\ServiceType;
use App\Entities\User\UserEntity;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

abstract class WebyEntityStorage extends EntityAbstract
{
    use HttpTrait, StdLibTrait;

    protected $_id = '';
    protected $_title = 'Untitled';
    protected $_description = '';
    protected $_slug = 'untitled';
    protected $_tags = [];
    protected $_content = [];
    protected $_settings = [];
    protected $_user = 0;
    protected $_shareCount = '';
    protected $_metaFollow = 0;
    protected $_deleted = false;
    protected $_hits = 0;
    protected $_hitsEmbedded = 0;
    protected $_createdOn = '';
    protected $_modifiedOn = '';
    protected $_storage = '';
    /**
     * @var null|ArrayObject
     */
    protected $_images = null;

    /**
     * Saves weby into the database with it's service type
     * @return \App\Lib\DatabaseResult|bool
     */
    protected function _sqlSave()
    {
        if ($this->_id == '') {
            $this->_id = uniqid();
            $query = 'INSERT INTO ' . $this->_getDb()->w_weby . ' (id, title, slug, content, settings, "user", share_count, created_on, modified_on)
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
            $bind = [
                $this->_id,
                $this->_title,
                $this->_slug,
                json_encode($this->_content),
                json_encode($this->_settings),
                is_object($this->_user) ? $this->_user->getId() : $this->_user,
                // Insert empty share stats for our newly created Weby
                serialize([
                    ServiceType::FACEBOOK => 0,
                    ServiceType::GOOGLE => 0,
                    ServiceType::TWITTER => 0
                ])
            ];

            return $this->_getDb()->execute($query, $bind);
        }

        $query = "UPDATE {$this->_getDb()->w_weby} SET title=?, description=?, slug=?, content=?, settings=?,
                    share_count=?, deleted=?, meta_follow=?, modified_on=NOW() WHERE id=?";
        $bind = [
            $this->_title,
            $this->_description,
            $this->_slug,
            json_encode($this->_content),
            json_encode($this->_settings),
            is_array($this->_shareCount) ? serialize($this->_shareCount) : $this->_shareCount,
            (int)$this->_deleted,
            $this->_metaFollow,
            $this->_id
        ];

        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Set storage folder
     * @return \App\Lib\DatabaseResult
     */
    protected function _sqlSetStorage()
    {
        $query = "UPDATE {$this->_getDb()->w_weby} SET storage=? WHERE id=?";
        $bind = [
            $this->_storage,
            $this->_id
        ];

        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Loads weby
     * @return ArrayObject|bool
     */
    protected function _sqlLoad()
    {
        $this->_images = $this->arr();
        $query = "SELECT * FROM {$this->_getDb()->w_weby} WHERE id=? LIMIT 1";
        $bind = [$this->_id];

        return $this->_getDb()->execute($query, $bind)->fetchArray();
    }

    /**
     * Deletes weby
     * @return \App\Lib\DatabaseResult|bool
     */
    protected function _sqlDelete()
    {
        $query = "UPDATE {$this->_getDb()->w_weby} SET deleted = 1::bit, deleted_on = NOW() WHERE id=?";
        $bind = [$this->_id];

        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Loads weby for given user
     *
     * @param $limit
     * @internal param \App\Entities\User\UserEntity $user
     *
     * @return ArrayObject|bool
     */
    protected static function _sqlGetRecentTags($limit)
    {
        $query = "SELECT tag, slug FROM " . self::_getDb()->w_tags . " ORDER BY id DESC LIMIT {$limit}";
        return self::_getDb()->execute($query)->fetchAll();
    }

    /**
     * Loads weby for given user
     *
     * @param \App\Entities\User\UserEntity $user
     *
     * @return ArrayObject|bool
     */
    protected static function _sqlLoadByUser(UserEntity $user)
    {
        $query = 'SELECT id, count(*) OVER() total_count FROM ' . self::_getDb()->w_weby . ' WHERE "user"=? AND deleted = 0::bit ORDER BY created_on DESC';
        $bind = [$user->getId()];

        if (self::request()->query('$top')) {
            $query .= " LIMIT ?";
            $bind[] = self::request()->query('$top');
        }

        if (self::request()->query('$skip')) {
            $query .= " OFFSET ?";
            $bind[] = self::request()->query('$skip');
        }

        $res = self::_getDb()->execute($query, $bind)->fetchAll();
        if ($res->count() == 0) {
            self::$_totalRows = 0;
            return [];
        }

        self::$_totalRows = $res->first()->key('total_count');
        $ids = [];
        foreach ($res as $r) {
            $ids[] = $r->key('id');
        }
        return $ids;
    }

    protected function _sqlGetHitCount()
    {
        $query = "SELECT value FROM {$this->_getDb()->w_stat_by_ref} WHERE ref_type=? AND ref_id=?";
        $bind = ['hit_weby', $this->_id];
        return $this->_getDb()->execute($query, $bind)->fetchValue();
    }

    /**
     * Finds all users that have this Weby in their favorites list
     */
    protected function _sqlGetUsersFavorited($limit)
    {
        $query = "SELECT \"user\", count(*) OVER() total_count FROM {$this->_getDb()->w_favorite}
                    WHERE weby=? ORDER BY created_on DESC LIMIT $limit";
        $bind = [$this->_id];

        return self::_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Searches database for Webies with given tags
     * @param $page
     * @param int $limit
     * @internal param $tag
     * @internal param $tagSlug
     * @internal param $slug
     * @internal param $tag
     * @internal param $tags
     * @return Array|bool
     */
    protected static function _sqlGetRecentWebies($page, $limit = 9)
    {
        $limitOffset = "LIMIT " . $limit . " OFFSET " . ($page - 1) * $limit;
        $query = "SELECT w.id, count(*) OVER() total_count FROM " . self::_getDb()->w_weby . " w
                    WHERE w.deleted = 0::bit AND meta_follow = 1::bit ORDER BY w.created_on DESC {$limitOffset}";
        return self::_getDb()->execute($query, [])->fetchAll();
    }

    protected static function _sqlGetFollowingWebies($userId, $page, $limit = 9)
    {
        $limitOffset = "LIMIT " . $limit . " OFFSET " . ($page - 1) * $limit;
        $query = "SELECT w.id, count(*) OVER() total_count FROM " . self::_getDb()->w_follow . " f
                    JOIN " . self::_getDb()->w_weby . " w ON w.user = f.followed_user
                    WHERE f.user = ? AND w.deleted = 0::bit AND meta_follow = 1::bit
                    ORDER BY w.created_on DESC {$limitOffset}";
        return self::_getDb()->execute($query, [$userId])->fetchAll();
    }

    /**
     * Searches database for Webies with given tags
     * @param $tag
     * @param $page
     * @param int $limit
     * @return Array|bool
     */
    protected static function _sqlGetWebiesByTag($tag, $page, $limit = 9)
    {
        $bind = [self::_toSlug($tag)];
        $limitOffset = "LIMIT " . $limit . " OFFSET " . ($page - 1) * $limit;
        $query = "SELECT w.id, count(*) OVER() total_count FROM " . self::_getDb()->w_tags . " t
	                JOIN " . self::_getDb()->w_weby2tag . " w2t ON w2t.tag = t.id
	                JOIN " . self::_getDb()->w_weby . " w ON w.id = w2t.weby
                    WHERE t.slug= ? AND w.deleted = 0::bit AND meta_follow = 1::bit
                    ORDER BY created_on DESC {$limitOffset}";
        return self::_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Searches database for Webies from given user
     * @param $username
     * @param $page
     * @param int $limit
     * @internal param $slug
     * @return Array|bool
     */
    protected static function _sqlGetWebiesByUser($username, $page, $limit = 9)
    {
        $bind = [$username];
        $limitOffset = "LIMIT " . $limit . " OFFSET " . ($page - 1) * $limit;
        $query = "SELECT w.id, count(*) OVER() total_count FROM " . self::_getDb()->w_user . " u
	                JOIN " . self::_getDb()->w_weby . " w ON w.user = u.id
                    WHERE u.username = ? AND w.deleted = 0::bit AND meta_follow = 1::bit ORDER BY w.created_on DESC {$limitOffset}";
        return self::_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Searches database for Webies from given user
     * @param $search
     * @param $page
     * @param int $limit
     * @return Array|bool
     */
    protected static function _sqlGetWebiesBySearch($search, $page, $limit = 9)
    {
        $bind = ['%' . $search . '%'];
        $limitOffset = "LIMIT " . $limit . " OFFSET " . ($page - 1) * $limit;
        $query = "SELECT w.id, count(*) OVER() total_count FROM " . self::_getDb()->w_weby . " w " .
                    "WHERE w.title LIKE ? AND w.deleted = 0::bit AND meta_follow = 1::bit
                    ORDER BY w.created_on DESC {$limitOffset}";
        return self::_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Searches for tags
     * @param $search
     * @return bool|ArrayObject
     */
    protected static function _sqlSearchTags($search)
    {
        $query = "SELECT * FROM " . self::_getDb()->w_tags . " WHERE tag LIKE ? LIMIT 10";
        $bind = ['%' . $search . '%'];
        return self::_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Adds tag to w_tags table (this DOES NOT add given tag to this Weby)
     */
    protected static function _sqlInsertTag($tag)
    {
        $query = "INSERT INTO " . self::_getDb()->w_tags . " (tag, slug) VALUES (?, ?) RETURNING id";
        $bind = [$tag, self::_toSlug($tag)];
        return self::_getDb()->execute($query, $bind)->fetchValue();
    }

    /**
     * This is the method that will bind tags to this Weby
     */
    protected function _sqlUpdateTags()
    {
        $query = "DELETE FROM " . $this->_getDb()->w_weby2tag . " WHERE weby = ?";
        $bind = [$this->_id];
        if (!$this->_getDb()->execute($query, $bind)) {
            return false;
        }

        foreach ($this->_tags as $tag) {
            $query = "INSERT INTO " . $this->_getDb()->w_weby2tag . " (weby, tag) VALUES (?,?)";
            $bind = [$this->_id, $tag['id']];
            if (!$this->_getDb()->execute($query, $bind)) {
                return false;
            };
        }
        return true;
    }

    /**
     * Gets Weby tags from database
     * @return bool
     */
    protected function _sqlLoadTags()
    {
        $query = "SELECT * FROM {$this->_getDb()->w_weby2tag} w2t
                    LEFT JOIN {$this->_getDb()->w_tags} t ON t.id = w2t.tag WHERE weby =?";
        $bind = [$this->_id];
        return $this->_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Update tag counts
     * @param $tag
     * @param $increment
     * @return bool
     */
    protected function _sqlUpdateTagCount($tag, $increment)
    {
        $query = "UPDATE {$this->_getDb()->w_tags} SET count=count+? WHERE tag = ?";
        $bind = [$increment, $tag];
        return $this->_getDb()->execute($query, $bind);
    }

    /**
     * Loads images for current Weby
     * @return bool|ArrayObject
     */
    protected function _sqlLoadImages()
    {
        $query = "SELECT * FROM {$this->_getDb()->w_weby_image} WHERE weby = ?";
        $bind = [$this->_id];
        return $this->_getDb()->execute($query, $bind)->fetchAll();
    }

    /**
     * Removes tags associations with Weby
     * @return bool|ArrayObject
     */
    protected function _sqlRemoveTags()
    {
        $query = "DELETE FROM {$this->_getDb()->w_weby2tag} WHERE weby = ?";
        $bind = [$this->_id];
        return $this->_getDb()->execute($query, $bind);
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
    protected static function _toSlug($str)
    {
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
            'ž' => 'z'
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