{if !isset($empty)}{$empty = false}{/if}
<li class="dropdown">
    <span class="user-photo" {if $viewObject.user.avatarUrl != '' && !$empty} style="background: url({$viewObject.user.avatarUrl}) top left; background-size: cover{/if}"></span>
    <span class="username">{if $viewObject.user && !$empty}{$viewObject.user.firstName} {$viewObject.user.lastName|truncate:2:".":true}{/if}</span>
    <span class="dropdown-arrow"></span>
    <ul>
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