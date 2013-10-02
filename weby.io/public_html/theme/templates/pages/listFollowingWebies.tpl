{extends file="templates/pages/listing.tpl"}

{block name="title"}Users you follow {if $page>1} - Page {$page}{/if}{/block}
{block name="meta"}
    <meta name="description" content="Recent Webies by following users
    {if $page>1} - Page {$page}{/if} - create and share your content instantly">
    <meta name="robots" content="noindex, nofollow">
{/block}
{block name="headTitle"}
    <span class="header-icon following-users-webies"></span>
    <h2>Users you follow</h2>
{/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}following/</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}