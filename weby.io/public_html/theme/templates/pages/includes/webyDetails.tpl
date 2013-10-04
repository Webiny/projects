{literal}
    <script type="weby/tpl" id="weby-details-tpl">
        <div class="weby-details" id="weby-details">
            <div class="details-arrow">
                <span class="handler"></span>
                #if (data.tags.length > 0) {#<a class="shown" data-role="show-full-details"
                                                href="javascript:void(0);"></a>#}#
            </div>

            <div class="favorites">
                <div class="loading-favorites" style="display: none"></div>
                #if (data.currentUser) {#
                #if (data.currentUser.id != data.webyUser.id) {#
                    <span data-role="add-to-favorites"
                          data-tooltip="#if (!data.isFavorited){#Add to favorites#}else{#Remove from favorites#}#"
                          class="favorites-icon has-tooltip-bottom #if (isFavorited){#added#}# clickable"></span>
                #}else{#
                <span class="favorites-icon"></span>
                #}#
                #}else{#
                <span class="favorites-icon pointer-cursor" data-role="add-to-favorites"></span>
                #}#
                <div class="weby-stats">
                    <p>
                <span class="favorites-count">
                    #= formatNumber(data.favoriteCount) #
                </span>
                        favorites
                    </p>
                <span class="views">
                    #= formatNumber(data.hits) # hits
                </span>
                </div>
            </div>
            <div class="full-weby-data">
                <div class="flip-front">
                    <div class="user-info">
                        <div style="display: none" class="loading-following"></div>
                        <div>
                            <a href="#= WEB+'user/'+ data.webyUser.name #">
                                <span class="user-photo" #if (data.webyUser.avatar != '') {# style="background: url(#=
                                data.webyUser.avatar #) top left; background-size: cover" #}#></span>
                            </a>

                            <p class="user-name" #if (data.webyUser.name.length > 14) {# data-role="weby-user"
                            data-tooltip="#= data.webyUser.name #" class="has-tooltip-top" #}#>
                            #if (data.webyUser.name.length > 14) {# #= data.webyUser.name.substring(0, 14) #... #} else
                            {# <a href="#= WEB+'user/'+ data.webyUser.name #"> #= data.webyUser.name# </a> #}#</p>
                            <p class="user-name"><b class="followers-count">#= formatNumber(data.webyUser.followers) #</b> followers
                            </p>
                        </div>
                        # if (data.currentUser && data.currentUser.id != data.webyUser.id) {#
                        #if (data.currentUser.isFollowing) {#
                        <a data-role="follow-user" data-id="#= data.webyUser.id #" class="unfollow-btn"
                           href="javascript: void(0);">Unfollow</a>
                        #}else{#
                        <a data-role="follow-user" data-id="#= data.webyUser.id #" class="follow-btn"
                           href="javascript: void(0);">Follow</a>
                        #}#
                        #}#
                    </div>
                    <div class="favorited-by"
                    #if (data.favoriteCount==0) {# style="display:none" #}#>
                    <h2>Favorited by</h2>
                    <ul>
                        #for(var i in data.favoritedBy){#
                        <li class="has-tooltip-top" data-tooltip="#= data.favoritedBy[i].username #">
                            <a class="photo" href="#= WEB+'user/'+data.favoritedBy[i].username #"><img
                                        src="#= data.favoritedBy[i].avatarUrl #"/></a>
                        </li>
                        #}#
                    </ul>
                    # if (data.otherFavoriteCount > 0){#
                    <a class="view-all" href="javascript:void(0);">...and #= formatNumber(data.otherFavoriteCount) # more.</a>
                    #}#
                </div>
                <div class="tags flip-behind"
                #if (data.tags.length == 0){# style="display: none" #}#>
                <h2>
                    Tags
                </h2>
                #for(var i in data.tags){#
                <a href="#= WEB+'tag/'+data.tags[i].slug #">
                    <span #if(data.tags[i].tag.length > 14){# data-tooltip="#= data.tags[i].tag #" #}#
                    class="weby-tag-blue #if(data.tags[i].tag.length > 14){# has-tooltip-top#}#">
                    #if(data.tags[i].tag.length > 14){# #= data.tags[i].tag.substring(0, 10) #... #}else{# #=
                    data.tags[i].tag # #}#</span>
                </a>
                #if (i == 4 && data.tags.length > 5){#
                <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">view all tags &raquo;</a>
                # break; #
                #}#
                #}#
            </div>
        </div>
        <div class="tags flip-behind" style="display: none;">
            <h2>
                Tags
            </h2>
            #for(var i in data.tags){#
            <a href="#= WEB+'tag/'+data.tags[i].slug #">
                <span #if(data.tags[i].tag.length > 14){# data-tooltip="#= data.tags[i].tag #" #}# class="weby-tag-blue
                #if(data.tags[i].tag.length > 14){# has-tooltip-top#}#">
                #if(data.tags[i].tag.length > 14){# #= data.tags[i].tag.substring(0, 10) #... #}else{# #=
                data.tags[i].tag # #}#</span>
            </a>
            #}#
            <a data-role="flip-weby-details" href="javascript: void(0);" class="view-all">&laquo; view less tags</a>
        </div>
        </div>
        <label class="checkbox-mute" data-role="video-background-mute" title="Mute background video sound">Mute sound</label>
        </div>
    </script>
    <script type="weby/tpl" id="user-favorited">
        <li class="has-tooltip-top" data-tooltip="{username}">
            <a class="photo" href="{userUrl}"><img src="{avatarUrl}"></a>
        </li>
    </script>
{/literal}