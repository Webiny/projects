<div class="weby-details" id="weby-details">
    <div class="details-arrow">
        {if $weby.tags->count()}<a data-role="show-full-details" href="javascript:void(0);"></a>{/if}
    </div>

    <div class="favorites">
        <div class="loading-favorites" style="display: none"></div>
        {if $viewObject.user}
            {if $viewObject.user.id != $weby.user.id}
                <span data-role="add-to-favorites"
                      data-tooltip="{if !$weby->inUsersFavorites()}Add to favorites{else}Remove from favorites{/if} "
                      class="favorites-icon has-tooltip {if $weby->inUsersFavorites()}added{/if} clickable"></span>
            {else}
                <span class="favorites-icon"></span>
            {/if}
        {else}
            <span class="favorites-icon"></span>
        {/if}
        <div class="weby-stats">
            <p>
            <span class="favorites-count">
                {$weby.favoriteCount|formattedNumber}
            </span>
                favorites
            </p>
            <span class="views">
                {$weby.hits|formattedNumber} hits
            </span>
        </div>
    </div>
    <div class="full-weby-data" style="display:none;">
        <div class="user-info">
            <div>
                <span class="user-photo"><img src="{$weby.user.avatarUrl}"></span>

                <p class="user-name">{$weby.user.username}</p>

                <p class="user-name"><b class="followers-count">{$weby.user.followingUsersCount|formattedNumber}</b>
                    followers</p>
            </div>
            {if $viewObject.user.id != $weby.user.id && $viewObject.user}
                {if $viewObject.user->isFollowing($weby.user)}
                    <a data-role="follow-user" data-id="{$weby.user.id}" class="unfollow-btn"
                       href="javascript: void(0);">Unfollow</a>
                {else}
                    <a data-role="follow-user" data-id="{$weby.user.id}" class="follow-btn" href="javascript: void(0);">Follow
                        me</a>
                {/if}
            {/if}
        </div>
        <div class="flip-front">
            <div class="favorited-by" {if $weby.favoriteCount==0}style='display:none'{/if}>
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
            <div class="tags flip-behind" style="">
                <h2>
                    Tags
                </h2>
                {foreach from=$weby->getTags(true) item=tag name=tagsFront}
                    <span class="weby-tag-blue">
                    {$tag.tag|truncate:17}
                </span>
                    {if $smarty.foreach.tagsFront.index == 4 && $weby.numberOfTags > 5}
                        <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">view all tags</a>
                        {break}
                    {/if}
                {/foreach}
            </div>
        </div>
        <div class="tags flip-behind" style="display: none;">
            <h2>
                Tags
            </h2>
            {foreach from=$weby->getTags(true) item=tag}
                <span class="weby-tag-blue">
            {$tag.tag|truncate:17}
                </span>
            {/foreach}
            <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">view less tags</a>
        </div>
    </div>
</div>
{literal}
    <script type="weby/tpl" id="user-favorited">
        <li>
            <a class="photo" href="javascript:void();"><img src="{avatarUrl}"></a>
            <a class="name" href="javascript:void(0);">{username}</a>
        </li>
    </script>
{/literal}