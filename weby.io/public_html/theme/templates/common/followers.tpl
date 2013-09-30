<div class="dialog followers-dialog" id="followers-dialog" style="display: none">
    <div class="dialog-loading">
        <div class="overlay"></div>
        <span class="load-icon"></span>
        <div class="text">
            Loading...
        </div>
    </div>
    <div class="delete-confirmation" style="display:none">
        <div class="overlay"></div>
        <div class="message">
            <img src="{$viewObject.themeWebPath}images/remove-favorite.png" />
        </div>
        <div class="actions buttons">
            <span id="button-dont-move-widgets" data-role="fav-btn-cancel" class="button">No, I changed my mind.</span>
            <span id="button-move-widgets" data-role="fav-btn-delete" class="button main" data-role="weby-dialog-save">Yes, remove it!</span>
        </div>
    </div>
    <h1>My Followers</h1>

    <div class="empty-list" style="display:none; margin:145px 0px 0px 185px">
        <img src="{$viewObject.themeWebPath}images/msg/msg-no-followers.png"/>
    </div>
    <ul class="followers-list"></ul>
    <div class="followers-footer">
        <div class="followers-pager followers-pager"></div>
    </div>
</div>

{literal}
    <script type="weby/tpl" id="followers-list-item-tpl">
        <li class="followers-list-item" data-id="${id}">
            <a href="{/literal}{$viewObject.webPath}{literal}user/${username}"><img class="user-avatar" src="${avatarUrl}"/></a>
            <p class="user-info"><a href="{/literal}{$viewObject.webPath}{literal}user/${username}">${username}</a></p>
            <p class="user-info">${usersFollowingCount} followers</p>
        </li>

    </script>
{/literal}

