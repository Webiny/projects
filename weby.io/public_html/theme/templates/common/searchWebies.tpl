<div class="search-btn" data-role="open-search-field">
    <a class="search-icon" href="javascript:void(0);"></a>

    <div id="search-field" class="search-field">
        <a href="javascript:void(0);" class="close-form close-search" data-role="close-search-field"></a>
        <input class="search-input" data-role="webies-search-field" type="text"
               placeholder="Enter your search terms and hit enter">
        <ul class="search-results">
        </ul>
    </div>
</div>
<li class="my-webies">
    <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
</li>

{literal}
    <script type="weby/tpl" id="webies-header-search-result">
        <li>
            <a href="{webyUrl}">
                </span>
                    <span class="search-img">
                        <img style="width: 30px; height: 30px" src="{screenshot}" src="">
                    </span>
            </a>

            <p>
                <a href="{webyUrl}">{title}</a>
            </p>
            <ul class="search-info">
                <li>
                    By <strong><a href="{userList}">{username}</a></strong>
                </li>
                <li>
                    {favoritedCount} Favs
                </li>
                <li>
                    {hitCount} Views
                </li>
            </ul>
        </li>
    </script>
{/literal}