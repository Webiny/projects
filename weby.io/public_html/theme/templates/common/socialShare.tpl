<!-- SHARING ICONS -->
{if $weby}
    <div class="social-icons-wrapper">

        {if isset($favorite)}
            <a href="javascript: void(0);" id="add-to-favs">
                <span class="share-icon social-favorites{if $favorite.weby.id}-added{/if}"></span></a>
        {/if}
        {if $viewObject.user}
        {literal}
        <script type="text/javascript">
            $(function () {
                $('#add-to-favs').click(function () {
                    var span = $(this).find('span');
                    $.ajax({
                        type: "POST",
                        url: WEB + 'favorite',
                        data: {{/literal}uid: {$viewObject.user.id}, wid: '{$weby.id}', wowner: '{$weby.user.id}'{literal}},
                        success: function () {
                            span.toggleClass('social-favorites social-favorites-added');
                        }
                    });
                });
            });
        </script>
        {/literal}
        {/if}
        <!-- FACEBOOK SHARING -->
        <a href="#" onclick="
                window.open(
                'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('{$weby->getPublicUrl()}'),
                'facebook-share-dialog',
                'width=626,height=436');
                return false;">
            <span class="share-icon social-facebook"></span></a>

        <!-- TWITTER SHARING -->

        <a class="twitter"
           href="http://twitter.com/intent/tweet?source=sharethiscom&text={$weby.title} {$weby->getPublicUrl()} @WebyIO&url={$viewObject.webPath}">
            <span class="share-icon social-twitter"></span></a>
        </a>
        {literal}
            <script>!function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                    if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;
                        js.src = p + '://platform.twitter.com/widgets.js';
                        fjs.parentNode.insertBefore(js, fjs);
                    }
                }(document, 'script', 'twitter-wjs');</script>
        {/literal}

        <!-- GOOGLE+ SHARING -->

        <a href="https://plus.google.com/share?url={$weby->getPublicUrl()}" {literal}onclick="javascript:
                window.open(this.href, '', 'menubar=no,toolbar=no,resizable=no,scrollbars=no,height=600,width=600');
                return false;">
            <span class="share-icon social-google"></span></a>
        {/literal}
    </div>
{/if}