<div class="weby-details" id="weby-details">
    <div class="details-arrow">
        <span class="handler"></span>
        {if $weby.tags->count()}<a class="shown" data-role="show-full-details" href="javascript:void(0);"></a>{/if}
    </div>

    <div class="favorites">
        <div class="loading-favorites" style="display: none"></div>
        {if $viewObject.user}
            {if $viewObject.user.id != $weby.user.id}
                <span data-role="add-to-favorites"
                      data-tooltip="{if !$weby->inUsersFavorites()}Add to favorites{else}Remove from favorites{/if} "
                      class="favorites-icon has-tooltip-bottom {if $weby->inUsersFavorites()}added{/if} clickable"></span>
            {else}
                <span class="favorites-icon"></span>
            {/if}
        {else}
            <span class="favorites-icon pointer-cursor" data-role="create-weby"></span>
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
    <div class="full-weby-data">
        <div class="flip-front">
            <div class="user-info">
                <div style="display: none" class="loading-following"></div>
                <div>
                    <a href="{$viewObject.webPath}user/{$weby.user.username}">
                    <span class="user-photo" {if $weby.user.avatarUrl != ''}
                          style="background: url({$weby.user.avatarUrl}) top left; background-size: cover{/if}">
                    </span>
                    </a>

                    <p class="user-name" {if $weby.user.username|count_characters>=14}data-role="weby-user"
                       data-tooltip="{$weby.user.username}"
                       class="has-tootip-top"{/if}>{$weby.user.username|truncate:14:'...':true}</p>

                    <p class="user-name"><b class="followers-count">{$weby.user.usersFollowingCount}</b>
                        followers</p>
                </div>
                {if $viewObject.user && $viewObject.user.id != $weby.user.id}
                    {if $viewObject.user->isFollowing($weby.user)}
                        <a data-role="follow-user" data-id="{$weby.user.id}" class="unfollow-btn"
                           href="javascript: void(0);">Unfollow</a>
                    {else}
                        <a data-role="follow-user" data-id="{$weby.user.id}" class="follow-btn"
                           href="javascript: void(0);">Follow</a>
                    {/if}
                {/if}
            </div>
            <div class="favorited-by" {if $weby.favoriteCount==0}style='display:none'{/if}>
                <h2>Favorited by</h2>
                <ul>
                    {foreach from=$weby.usersFavorited item=user}
                        <li class=" has-tooltip-top" data-tooltip="{$user.username}">
                            <a class="photo" href="{$viewObject.webPath}user/{$user.id}"><img src="{$user.avatarUrl}"/></a>
                        </li>
                    {/foreach}
                </ul>
                {if ({$weby.countOfMoreUsers} > 0)}
                    <a class="view-all" href="javascript:void(0);">...and {$weby.countOfMoreUsers} more.</a>
                {/if}
            </div>
            <div class="tags flip-behind" {if $weby.numberOfTags == 0}style="display: none"{/if}">
            <h2>
                Tags
            </h2>
            {foreach from=$weby->getTags(true) item=tag name=tagsFront}
                <a href="{$viewObject.webPath}tag/{$tag.slug}"><span class="weby-tag-blue">
                    {$tag.tag|truncate:14:'...':true}
                    </span></a>
                {if $smarty.foreach.tagsFront.index == 4 && $weby.numberOfTags > 5}
                    <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">view all
                        tags &raquo;</a>
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
            <a href="{$viewObject.webPath}tag/{$tag.slug}"><span class="weby-tag-blue">
                {$tag.tag|truncate:14:'...':true}
                </span></a>
        {/foreach}
        <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">&laquo; view less tags</a>
    </div>
</div>
</div>
{literal}
    <script type="weby/tpl" id="user-favorited">
        <li class="has-tooltip-top" data-tooltip="{username}">
            <a class="photo" href="javascript:void();"><img src="{avatarUrl}"></a>
        </li>
    </script>
{/literal}