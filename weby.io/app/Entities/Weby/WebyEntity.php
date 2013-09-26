<?php

namespace App\Entities\Weby;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Lib\UserTrait;
use Webiny\Component\StdLib;

class WebyEntity extends WebyEntityCrud
{

    use AppTrait, UserTrait;

    /**
     * Gets all Webies for given user
     *
     * @param UserEntity $user
     *
     * @return array
     */
    public static function getAllByUser(UserEntity $user)
    {
        $webies = self::_sqlLoadByUser($user);
        $tmp = [];
        foreach ($webies as $wId) {
            $weby = new WebyEntity();
            $tmp[] = $weby->load($wId);
        }

        return $tmp;
    }

    /**
     * Searches database for Webies with given tags attached
     */
    public static function getWebiesByTags($tags)
    {
        return self::_sqlGetWebiesByTags($tags);
    }

    /**
     * Searches for tags
     * @param $search
     * @param bool $json
     * @param bool $addSearchingTag
     * @return bool|\Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject
     */
    public static function searchTags($search, $json = false, $addSearchingTag = false)
    {
        $data = self::_sqlSearchTags($search);
        $found = false;

        foreach ($data as $array) {
            if ($array['tag'] == $search) {
                $found = true;
                break;
            }
        }
        if ($addSearchingTag && !$found) {
            if (!$data->inArray($search)) {
                $data->append(self::arr(['id' => 0, 'tag' => $search]));
            }
        }
        if ($data->count()) {
            if ($json) {
                $tmp = [];
                foreach ($data as $tag) {
                    $tmp[] = ['id' => $tag['id'], 'tag' => $tag['tag']];
                }
                return json_encode($tmp);
            }
            return $data;
        }
        return false;
    }

    /**
     * Inserts new tag into table, this DOES NOT bind given tag to Weby
     * @param $tag
     * @return bool|Mixed
     */
    public static function insertTag($tag)
    {
        return self::_sqlInsertTag($tag);
    }

    /**
     * Check if this Weby it in current user's favorites list
     * @return bool
     */
    public function inUsersFavorites()
    {
        if ($this->user()) {
            return $this->user()->inFavorites($this);
        }
        return false;
    }

    /**
     * Generates full editor URL for this Weby
     * @return string
     */
    public function getEditorUrl()
    {
        return $this->app()->getConfig()->app->web_path . $this->getUser()->getUsername() . '/' . $this->getId() . '/';
    }

    /**
     * Generates full public URL for this Weby
     * @return string
     */
    public function getPublicUrl()
    {
        return $this->app()->getConfig()->app->web_path . $this->getUser()
            ->getUsername() . '/' . $this->getSlug() . '/' . $this->getId() . '/';
    }


    /**
     * Returns WebyEntity object to JSON
     * @return string
     */
    public function toJson()
    {
        return json_encode($this->toArray(), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

    }

    /**
     * Gets share counts for every social service (Facebook, Google, Twitter)
     * @return Array Array with keys [facebook], [google] & [twitter], and counts as values
     */
    public function getShareCount()
    {
        // First, try to get data from cache or social service
        $social = SocialData::getInstance();
        $data = $social->getAllShareCount($this);

        // If that didn't succeed for some reason, return database data
        return $data ? $data : unserialize($this->_shareCount);

    }

    /**
     * @param $tag
     *
     * @return WebyImage
     * @throws \Exception
     */
    public function getImage($tag)
    {
        if ($this->_images->keyExists($tag)) {
            return $this->_images->key($tag);
        }
        $this->_images[$tag] = new WebyImage($this->_id, $tag);
        return $this->_images[$tag];
    }

    /**
     * Returns WebyEntity object to array
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->_id,
            'username' => $this->getUser()->getUsername(),
            'avatar' => $this->getUser()->getAvatarUrl(),
            'title' => $this->_title,
            'description' => $this->_description,
            'slug' => $this->_slug,
            'publicUrl' => $this->getPublicUrl(),
            'metaFollow' => $this->getMetaFollow(),
            'tags' => $this->getTags(true),
            'content' => $this->_content,
            'settings' => $this->_settings,
            'share' => $this->getShareCount()
        ];
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