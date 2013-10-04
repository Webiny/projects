{* My Webies and Search template *}
<script type="weby/tpl" id="search-webies-tpl">
    <div class="search-btn">
        <a data-role="open-search-field" class="search-icon" href="javascript:void(0);"></a>

        <div id="search-field" class="search-field">
            <span class="close-form close-search" data-role="close-search-field"></span>
            <input class="search-input" data-role="webies-search-field" type="text"
                   placeholder="Enter your search terms and hit enter">
            <ul class="search-results">
            </ul>
        </div>
    </div>
    <li class="my-webies">
        <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
    </li>
</script>
{* Webies search result template *}
<script type="weby/tpl" id="webies-header-search-result">
    {literal}
        <li class="result-item">
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
    {/literal}
</script>
{* Webies search result template *}
<script type="weby/tpl" id="webies-user-menu-tpl">
    {literal}
    <li class="dropdown">
        <span class="user-photo"
        #if (avatar != '') {# style="background: url(#= avatar #) top left; background-size: cover" #}#>
        </span>
        <span class="username">#= name #</span>
        <span class="dropdown-arrow"></span>
        <ul>
            <li>
                <a href="{$viewObject.webPath}editor/create">Create a Weby</a>
            </li>
            <li>
                <a href="javascript:void(0);" data-role="dashboard-dialog-open">My Webies</a>
            </li>
            <li>
                <a href="javascript:void(0);" data-role="favorites-dialog-open">My favorites</a>
            </li>
            <li>
                <a href="javascript:void(0);" data-role="followers-dialog-open">My followers</a>
            </li>
            <li>
                <a href="{$viewObject.webPath}popular">Popular Webies</a>
            </li>
            <li>
                <a href="{$viewObject.webPath}following">Users you follow</a>
            </li>
            <li>
                <a href="{$viewObject.webPath}logout">Sign out</a>
            </li>
        </ul>
    </li>
    {/literal}
</script>
{* Webies authorize button template *}
<script type="weby/tpl" id="weby-authorize-tpl">
    {literal}
    <li class="register-btn">
        <a data-role="authorize" href="javascript: void(0);"></a>

        <div class="dialog" id="authorization-dialog" style="display: none">
            <div class="register-dialog">
                <h1>Create your Weby</h1>

                <p>Login with Facebook or Google and create as many webies as you like - it's completely
                    free!</p>
                <ul>
                    <li class="signin-facebook">
                        <a class="icon" href=""></a>
                        <a href="{/literal}{$viewObject.webPath}{literal}security/login-fb/">Sign in with Facebook</a>
                    </li>
                    <li class="signin-google">
                        <a class="icon" href=""></a>
                        <a href="{/literal}{$viewObject.webPath}{literal}security/login-gp/">Sign in with Google</a>
                    </li>
                </ul>
            </div>
        </div>
    </li>
    {/literal}
</script>