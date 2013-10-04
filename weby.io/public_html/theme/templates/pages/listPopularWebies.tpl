{extends file="templates/pages/listing.tpl"}

{block name="title"}Popular Webies{if $page>1} - Page {$page}{/if}{/block}
{block name="meta"}
    <meta name="description" content="Popular Webies by community users
    {if $page>1} - Page {$page}{/if} - create and share your content instantly">
    <meta name="robots" content="index, follow">
{/block}
{block name="headTitle"}
    <span class="header-icon"></span>
    <h2>Popular Webies</h2>
    {/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}popular/</div>
        <div data-role="search-value"></div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}