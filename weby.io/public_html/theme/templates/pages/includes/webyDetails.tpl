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

            <p class="user-name">{$weby.user.firstName} {$weby.user.lastName}</p>
        </div>
        <a class="follow-btn" href="">Follow me</a>
        <a class="unfollow-btn" href="">Unfollow</a>
    </div>

    <div class="favorited-by">
        <h2>Favorited by</h2>
        <ul>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">Mark</a>
            </li>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">Edy</a>
            </li>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">barbie345</a>
            </li>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">david</a>
            </li>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">Mike</a>
            </li>
            <li>
                <a class="photo" href=""></a>
                <a class="name" href="">macaou3895</a>
            </li>
        </ul>
        <a class="view-all" href="">view all people</a>
    </div>

    <div class="tags">
        <h2>
            Tags
        </h2>
        {foreach from=$weby.tags item=tag}
            <span class="weby-tag-blue">
                    tag.tag
                </span>
        {/foreach}
        <a class="view-all" href="">view all tags</a>
    </div>

    <div class="popular-related-btns">
        <a class="view-popular-btn" href="">view popular</a>
        <a class="view-related-btn" href="">view related</a>
    </div>
</div>