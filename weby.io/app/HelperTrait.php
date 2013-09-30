<?php
namespace App;

trait HelperTrait
{

    /**
     * Generates pagination
     * @param $count
     * @param $page
     * @param $diplaynum
     * @param bool $hasP1
     * @param bool $returnArray
     * @return array|string
     */
    public function _getNavigation($count, $page, $diplaynum, $hasP1 = TRUE, $returnArray = false)
    {
        $links = array('prev' => '', 'next' => '', 'pages' => array());
        if ($count < $diplaynum || $diplaynum < 1) {
            if ($returnArray) {
                return array('html' => '', 'array' => $links);
            }
            return '<a href="' . $_SERVER ['REQUEST_URI'] . '">1</a>';
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
                $page_uri = $_SERVER ['REQUEST_URI'] . '{page}';
            }
        }

        if (!preg_match("/page={page}/", $page_uri)) {
            $page_uri = $page_uri;
        }

        for ($i = $cur_page; $i <= $numOfPages; $i++) {
            if (!$hasP1 && $i == 1) {
                $tpage_uri = str_replace("{page}", "", $page_uri);
                $tpage_uri = str_replace("&{page}", "", $tpage_uri);
                if ($i == $page) {
                    $cpLink = "<a class=\"pagination-active\" href=\"" . $tpage_uri . "\">$i</a>";
                    $output .= $cpLink . "\n";
                    $selected = true;
                } else {
                    $cpLink = "<a href=\"" . $tpage_uri . "\">$i</a>";
                    $output .= $cpLink . "\n";
                    $selected = false;
                }
                $links['pages'][] = array('href' => $tpage_uri, 'page' => $i, 'selected' => $selected);
            } else {
                if ($i == $page) {
                    $href = str_replace("{page}", $i, $page_uri);
                    $output .= "<a class=\"pagination-active\" href=\"" . $href . "\">$i</a>\n";
                    $selected = true;
                } else {
                    $href = str_replace("{page}", $i, $page_uri);
                    $output .= "<a href=\"" . $href . "\">$i</a>\n";
                    $selected = false;
                }
                $links['pages'][] = array('href' => $href, 'page' => $i, 'selected' => $selected);
            }
        }

        $previous_link = "\n";
        if (($page - 1) >= 1) {
            if (($page - 1) == 1 && !$hasP1) {
                $href = str_replace("{page}", "", $page_uri);
                $href = str_replace("&{page}", "", $href);
            } else {
                $href = str_replace("{page}", $page - 1, $page_uri);
            }

            $previous_link = "<a class=\"prev\" href=\"" . $href . "\">  &lt;&lt; </a>";
            $links['prev'] = $href;
        }

        $next_link = "\n";
        if (($page + 1) <= $numOfPages) {
            $href = str_replace("{page}", $page + 1, $page_uri);
            $next_link = "<a class=\"next\" href=\"" . $href . "\">  &gt;&gt; </a>";
            $links['next'] = $href;
        }

        $link = '<p class="paging">' . $previous_link . $output . $next_link . '</p>';

        if ($returnArray) {
            return array('html' => $link, 'array' => $links);
        } else {
            return $link;
        }
    }
}