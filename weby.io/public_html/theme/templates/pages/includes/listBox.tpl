{literal}
    <script type="weby/tpl" id="listing-tpl">
        <div id="page{pageNumber}" class="tpl{templateNumber} box-tpl"></div>
    </script>
    <script type="weby/tpl" id="listing-box-tpl">
        <div id="box-{pageNumber}-{boxNumber}" class="box{boxNumber} box">
            <div class="content" style="background: url({screenshot}) no-repeat top left">
                <a title="{webyTitle}" class="image-weby-link" href="{publicUrl}"></a>
                <div class="author">
                    <a class="author-photo" href="{userUrl}"><img src="{authorAvatarUrl}"></a>
                    <a class="author-name" href="{userUrl}">{authorName}</a>
                </div>
            </div>

            <div class="weby-info">
                <h2><a class="header-url" title="{webyTitle}" href="{publicUrl}">{webyTitle}</a></h2>
                <ul>
                    <li class="favs">
                             <span>
                                 {favoritedCount}
                             </span>
                        Favs
                    </li>
                    <li class="views">
                             <span>
                                 {hitsCount}
                             </span>
                        Views
                    </li>
                    <li class="date">
                        <time class="passed" datetime="{createdOnUnix}">{createdOnUnix}</time>
                    </li>
                </ul>
            </div>
        </div>
    </script>
{/literal}