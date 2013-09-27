<li class="dropdown">
    <span class="user-photo" {if $viewObject.user.avatarUrl != ''}
          style="background: url({$viewObject.user.avatarUrl}) top left; background-size: cover{/if}">
        </span>
    <span class="username">{$viewObject.user.firstName} {$viewObject.user.lastName|truncate:2:".":true}</span>
    <span class="dropdown-arrow"></span>
    <ul>
        <li>
            <a href="javascript:void(0);" data-role="dashboard-dialog-open">My Webies</a>
        </li>
        <li>
            <a href="javascript:void(0);" data-role="favorites-dialog-open">My favorites</a>
        </li>
        <li>
            <a href="{$viewObject.webPath}recent" data-role="">Recent Webies</a>
        </li>
        <li>
            <a href="{$viewObject.webPath}following" data-role="">Followed users</a>
        </li>
        <li>
            <a href="{$viewObject.webPath}logout">Sign out</a>
        </li>
    </ul>
</li>