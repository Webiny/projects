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
            <img src="{$viewObject.themeWebPath}images/remove-favorite.png" />
        </div>
        <div class="actions buttons">
            <span id="button-dont-move-widgets" data-role="fav-btn-cancel" class="button">No, I changed my mind.</span>
            <span id="button-move-widgets" data-role="fav-btn-delete" class="button main" data-role="weby-dialog-save">Yes, remove it!</span>
        </div>
    </div>
    <h1>My Favorites</h1>

    <div class="empty-list" style="display:none; margin: 100px 0 0 50px;">
        <img src="{$viewObject.themeWebPath}images/empty-favorites.png"/>
    </div>
    <ul class="favorites-list"></ul>
    <div class="favorites-footer">
        <div class="webies-pager favorites-pager"></div>
    </div>
</div>

{literal}
    <script type="weby/tpl" id="favorites-list-item-tpl">
        <li class="favorites-list-item" data-id="${id}">
            <a href="${public_url}"><img class="weby-thumbnail" src="${thumbnail}"/></a>

            <div class="weby-data left">
                <h2><a href="${public_url}">${title}</a></h2>
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
                    <time class="passed" datetime="${addedToFavoritesTimeUnix}">${addedToFavoritesTimeUnix}</time>
                </p>
                <p>
                    <span class="tag-info">${hits} hits</span>
                    <span class="tag-info">${favorites} favorites</span></p>

                <p class="buttons">
                    <a href="javascript: void(0);"><span class="button delete">Remove</span></a>
                    <a href="${public_url}"><span class="button main view">View</span></a>
                </p>
            </div>
        </li>

    </script>
{/literal}

