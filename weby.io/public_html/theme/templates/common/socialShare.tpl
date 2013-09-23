<!-- SHARING ICONS -->
{if $weby}
    <li id="social-sharing">
        <p>Share</p>
        <ul>
            <li class="facebook social-share-icon" data-role="facebook-share">
                <a href="javascript: void(0);"></a>
                <span class="social-counter">{$weby.shareCount.facebook|formattedNumber}</span>
            </li>
            <li class="twitter social-share-icon" data-role="twitter-share">
                <a href="javascript: void(0);"></a>
                <span class="social-counter">{$weby.shareCount.twitter|formattedNumber}</span>
            </li>
            <li class="gplus social-share-icon" data-role="gplus-share">
                <a href="javascript: void(0);"></a>
                <span class="social-counter">{$weby.shareCount.google|formattedNumber}</span>
            </li>
        </ul>
    </li>
    <script type="weby/tpl" id="no-widgets-dialog">
        <div class="dialog">
            <div style="padding: 20px 10px; color: white;">Before sharing your Weby, please add some widgets!</div>
        </div>
    </script>
{/if}