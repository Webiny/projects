{assign var=boxMap value=[
    1=> [1, 3, 4, 5, 2, 6, 7, 8, 9],
    2=> [1, 4, 3, 5, 6, 2, 8, 9 , 7],
    3=> [3, 1, 6, 2, 7, 8, 4, 5, 9],
    4=> [1, 6, 5, 2, 3, 8, 9, 4, 7],
    5=> [1, 6, 3, 2, 5, 4, 8, 7, 9]
]}

{assign var=imageDimensionsMap value=[
    1=> 'square',
    2=> 'square',
    3=> 'vertical',
    4=> 'square',
    5=> 'square',
    6=> 'horizontal',
    7=> 'horizontal',
    8=> 'square',
    9=> 'square'
]}

{assign var=pageHolderHeights value=[
    1=> [ 1=> 335, 2=> 665, 3=> 665, 4=> 665, 5=> 665, 6=> 665, 7=> 995, 8=> 995, 9=> 995 ],
    2=> [ 1=> 335, 2=> 335, 3=> 665, 4=> 665, 5=> 665, 6=> 665, 7=> 995, 8=> 995, 9=> 995 ],
    3=> [ 1=> 665, 2=> 665, 3=> 665, 4=> 665, 5=> 665, 6=> 995, 7=> 995, 8=> 995, 9=> 995 ],
    4=> [ 1=> 335, 2=> 335, 3=> 335, 4=> 665, 5=> 995, 6=> 995, 7=> 995, 8=> 995, 9=> 995 ],
    5=> [ 1=> 335, 2=> 335, 3=> 665, 4=> 665, 5=> 665, 6=> 665, 7=> 995, 8=> 995, 9=> 995 ]
]}

<div class="tpl-holder">
    <div id="page{$page}" class="tpl{$tplId} box-tpl" style="height: {$pageHolderHeights[$tplId][$webies|@count]}px">
        {foreach $webies item=weby}
            <div id="box-{$page}-{$weby@iteration}" class="box{$boxMap[{$tplId}][$weby@index]} box" style="opacity: 0">
                <div class="content"
                     style="background: url({$weby.images[$imageDimensionsMap[$boxMap[$tplId][$weby@index]]]}) no-repeat top left">
                    <a class="image-weby-link" title="{$weby.title}" href="{$weby.publicUrl}"></a>

                    <div class="author">
                        <a class="author-photo" href="{$webPath}user/{$weby.username}"><img src="{$weby.avatarUrl}"></a>
                        <a class="author-name" href="{$webPath}user/{$weby.username}">{$weby.username}</a>
                    </div>
                </div>

                <div class="weby-info">
                    <h2><a class="header-url" title="{$weby.title}" href="{$weby.publicUrl}">{$weby.title}</a></h2>
                    <ul>
                        <li class="favs">
                             <span>
                                 {$weby.favoritedCount}
                             </span>
                            Favs
                        </li>
                        <li class="views">
                             <span>
                                 {$weby.hitsCount}
                             </span>
                            Views
                        </li>
                        <li class="date">
                            <time class="passed" datetime="{$weby.createdOnUnix}">{$weby.createdOnUnix}</time>
                        </li>
                    </ul>
                </div>
            </div>
        {/foreach}
    </div>
</div>
<div class="pagination">
    {$pagination}
</div>