<div class="dialog webies-dialog" id="dashboard-dialog" style="display: none">

    <div class="dialog-loading">
        <div class="disabling-overlay"></div>
        <span class="load-icon"></span>

        <div class="text">
            Loading...
        </div>
    </div>
    <div class="delete-confirmation" style="display:none">
        <div class="overlay"></div>
        <div class="message">
            <img src="{$viewObject.themeWebPath}images/remove-weby.png"/>
        </div>
        <div class="actions">
            <a href="javascript:void(0)" data-role="btn-cancel"><span class="button">No, keep it!</span></a>
            <a href="javascript:void(0)" data-role="btn-delete"><span class="button">Yes, remove it!</span></a>
        </div>
    </div>
    <h1>My Webies</h1>

    <div class="empty-list" style="display:none; margin: 100px 0 0 50px;">
        <img src="{$viewObject.themeWebPath}images/empty.png"/>
    </div>
    <ul class="webies-list"></ul>
    <div class="webies-footer">
        <div class="webies-pager"></div>
        <a href="{$viewObject.webPath}editor/create/" style="float:right;"><span
                    class="button">Create new Weby</span></a>
    </div>
</div>

{literal}
    <script type="weby/tpl" id="webies-list-item-tpl">
        <li class="webies-list-item" data-id="${id}">
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
                <p>Edited
                    <time class="passed" datetime="${modified_on}">${modified_on}</time>
                </p>
                <p>
                    <span class="tag-info">${hits} hits</span>
                    <span class="tag-info">${favorites} favorites</span></p>

                <p class="buttons">
                    #if (isEditor){#
                        #if (currentWeby != id){#
                        <a href="javascript: void(0);"><span class="button delete">Delete</span></a>
                        #}#
                    #} else {#
                        <a href="javascript: void(0);"><span class="button delete">Delete</span></a>
                    #}#

                    <a href="${editor_url}"><span class="button edit">Edit</span></a>
                    <a href="${public_url}"><span class="button main view">View</span></a>
                </p>
            </div>
        </li>

    </script>
{/literal}

