{extends file="templates/pages/listing.tpl"}

{block name="title"}By Webies{/block}

{block name="headerMiddle"}
    <div class="header-middle header-middle-wrap">
        <span class="header-icon default-user-avatar" {if $searchingUser.avatarUrl}style="background-image: url({$searchingUser.avatarUrl});"{/if}></span>
        <h2>{block name="headTitle"}{if $searchingUser.username} {$searchingUser.username}{/if}{/block}</h2>
    </div>
{/block}

{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}user/</div>
        <div data-role="search-value">{$searchingUser.username}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    <div class="tpl-holder"></div>
    <div class="pagination"></div>
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}