<div class="weby-details">
    <div class="details-arrow">
        <a href=""></a>
    </div>
    <div class="favorites">
        <p>
            <span>
                {$weby.favoriteCount}
            </span>
            favorites
        </p>
            <span class="views">
                {$weby.hits} hits
            </span>
    </div>

    <div class="user-info">
        <div>
            <span class="user-photo"><img src="{$weby.user.avatarUrl}"></span>

            <p class="user-name">{$weby.user.username}</p>
            <p class="user-name"><b>4</b> followers</p>
        </div>
        {if $viewObject.user->isFollowing($weby.user)}
            <a data-role="follow-user" data-id="{$weby.user.id}" class="unfollow-btn" href="javascript: void(0);">Unfollow</a>
        {else}
            <a data-role="follow-user" data-id="{$weby.user.id}" class="follow-btn" href="javascript: void(0);">Follow
                me</a>
        {/if}
    </div>

    <div class="favorited-by">
        <h2>Favorited by</h2>
        <ul>
            {foreach from=$weby.usersFavorited item=user}
                <li>
                    <a class="photo" href="javascript:void();"><img src="{$user.avatarUrl}"/></a>
                    <a class="name" href="javascript:void();">{$user.username}</a>
                </li>
            {/foreach}
        </ul>
        {if ({$weby.countOfMoreUsers} > 0)}
            <a class="view-all" href="javascript:void(0);">...and {$weby.countOfMoreUsers} more.</a>
        {/if}
    </div>

    <div class="tags">
        <h2>
            Tags
        </h2>
        {foreach from=$weby->getTags(true) item=tag}
            <span class="weby-tag-blue">
            {$tag.tag|truncate:17}
        </span>
        {/foreach}
    </div>
</div>