{extends file="layouts/master.tpl"}
{block name="title"}How is our project doing?{/block}
{block name="head"}
    {minify type="css"}
        statistics.css,
        kendo.common.min.css,
        kendo.default.min.css
    {/minify}
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="{$viewObject.themeWebPath}js/third_party/kendo.web.min.js" charset="utf-8"></script>
    <script type="text/javascript">
        // Move all to separate file, this is ugly
        {literal}
        $(function () {

            // Load the Visualization API and the piechart package.
            dataPanel = $('div#stat_data');

            _getstats($('div#stat_menu a[data-stat="registered_users"]'));

            $('a.stat_menu_ajax_item').click(function () {
                _getstats($(this));
            });

            $('.child-menu').hide();
            $('.child-menu-toggler').click(function () {
                var $this = $(this);
                $this.next('ul.child-menu').toggle(500);
                $this.find('span').toggleClass('uncollapse-btn collapse-btn');
            });

        });

        google.load('visualization', '1.0', {'packages': ['corechart']});

        function _getstats(clickedLink) {
            var stat = clickedLink.attr('data-stat');
            $.ajax({
                type: "POST",
                url: '/stats/ajax-get-stats/?stat=' + stat,
                success: function (response) {
                    dataPanel.hide().empty().append(response.data).show();
                    viewReady();
                }
            });
        }

    </script>
{/literal}
{/block}

{block name="content"}
    <div id="stat_wrapper">
        <div id="stat_menu">
            <ul>
                <li><a data-stat="error_log" class="stat_menu_ajax_item" href="javascript:void(0);">Error Log</a></li>
                <li><a data-stat="uknown_filetypes" class="stat_menu_ajax_item" href="javascript:void(0);">Uknown
                        filetypes</a></li>
                <li><a data-stat="unsupported_links" class="stat_menu_ajax_item" href="javascript:void(0);">Unsupported
                        links</a></li>
                <li><a data-stat="registered_users" class="stat_menu_ajax_item" href="javascript:void(0);">Registered
                        users</a></li>
                <li><a data-stat="active_users" class="stat_menu_ajax_item" href="javascript:void(0);">Active users</a>
                </li>
                <li><a data-stat="created_webies" class="stat_menu_ajax_item" href="javascript:void(0);">Created
                        Webies</a></li>
                <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_general">Created
                        Widgets</a></li>
                <li><a data-stat="top_user" class="stat_menu_ajax_item" href="javascript:void(0);">Top users</a></li>
                <li><a data-stat="top_webies" class="stat_menu_ajax_item" href="javascript:void(0);">Top Webies</a></li>
                <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_usage">Top widgets</a>
                </li>
                <li>
                    <a class="child-menu-toggler" href="javascript:void(0);"> <span class="uncollapse-btn"></span>Widgets</a>
                    <ul class="child-menu">
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_text">Text</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_link">Link</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_video">Video</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_map">Google
                                Map</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_instagram">Instagram</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_pinterest">Pinterest</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_facebook">Facebook</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_slideshare">Slideshare</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_googledrive">Google
                                Drive</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_skydrive">Sky
                                Drive</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_soundcloud">Sound
                                Cloud</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_linkedin">Linked
                                In</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_tweet">Tweet</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="widget_vine">Vine</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item"
                               data-stat="widget_flickr">Flickr</a></li>
                    </ul>
                </li>
                <li>
                    <a class="child-menu-toggler" href="javascript:void(0);"> <span class="uncollapse-btn"></span>OAuth</a>
                    <ul class="child-menu">
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="oauth_facebook">Facebook</a>
                        </li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item"
                               data-stat="oauth_google">Google</a></li>
                        <li><a href="javascript:void(0);" class="stat_menu_ajax_item" data-stat="oauth_linkedin">LinkedIn</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div id="stat_data">

        </div>
    </div>
    <div id="footer">
        <img src="{$viewObject.themeWebPath}images/webiny_logo.png">
    </div>
{/block}
