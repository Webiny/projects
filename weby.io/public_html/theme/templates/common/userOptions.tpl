<li class="dropdown">
    {*<div class="user-dropdown-wrapper">*}
    <span class="user-photo">
            <a href="{$viewObject.webPath}">
                <img style="display: inline-block; width:40px; height:40px" src="{$viewObject.user.avatarUrl}"
                     id="user-avatar">
            </a>
        </span>
    <span class="username">{$viewObject.user.firstName} {$viewObject.user.lastName}</span>
    <span class="dropdown-arrow"></span>
    <ul>
        <li>
            <a href="javascript:void(0);" data-role="dashboard-dialog-open">Your Webies</a>
        </li>
        <li>
            <a href="javascript:void(0);" data-role="favorites-dialog-open">Your favorites</a>
        </li>
        <li>
            <a href="{$viewObject.webPath}logout">Sign out</a>
        </li>
    </ul>
    {*</div>*}
</li>