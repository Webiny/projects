<div class="dialog favorites-dialog" id="favorites-dialog" style="display: none">

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
            Delete Weby from favorites?
        </div>
        <div class="actions">
            <a href="javascript:void(0)" data-role="fav-btn-cancel"><span class="button">Cancel</span></a>
            <a href="javascript:void(0)" data-role="fav-btn-delete"><span class="button">Yes, remove it!</span></a>
        </div>
    </div>
    <h1>My Favorites</h1>

    <div class="empty-list" style="display:none; margin: 100px 0 0 50px;">
        <img src="{$viewObject.themeWebPath}images/empty-favorites.png"/>
    </div>
    <ul class="favorites-list"></ul>
    <div class="favorites-footer">
        <div class="favorites-pager"></div>
    </div>
</div>

{literal}
    <script type="weby/tpl" id="favorites-list-item-tpl">
        <li class="favorites-list-item" data-id="${id}">
            <img class="weby-thumbnail" src="${thumbnail}"/>

            <div class="weby-data left">
                <h2>${title}</h2>
                #if(tags.length == 0){#
                <p>No tags</p>
                #}else{#
                <h3>Tags</h3>
                <ul class="tags-list">
                    #for(var x=0; x < tags.length; x++){#
                    <li class="weby-tag white">#= tags[x].tag #</li>
                    #}#
                </ul>
                #}#
            </div>
            <div class="weby-actions right">
                <p>Added
                    <time class="passed" datetime="${addedToFavoritesTime}">${addedToFavoritesTime}</time>
                </p>
                <p>
                    <span class="tag-info">${hits} hits</span>
                    <span class="tag-info">${favorites} favorites</span></p>

                <p class="buttons">
                    <a href="javascript: void(0);"><span class="button delete">Delete</span></a>
                    <a href="${public_url}"><span class="button main view">View</span></a>
                </p>
            </div>
        </li>

    </script>
{/literal}

