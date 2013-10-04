{extends file="templates/pages/listing.tpl"}

{block name="title"}{$searchValue} - Webies{if $page>1} - Page {$page}{/if}{/block}
{block name="meta"}
    <meta name="description" content="{$searchValue} Webies by community users
    {if $page>1} - Page {$page}{/if} - create and share your content instantly">
    <meta name="robots" content="noindex, nofollow">
{/block}
{block name="headTitle"}
    <span class="header-icon search"></span>
    <h2>{$searchValue}</h2>
    {/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}search/</div>
        <div data-role="search-value">{$searchValue}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}