{extends file="templates/pages/listing.tpl"}

{block name="title"}Recent Webies{if $page>1} - Page {$page}{/if}{/block}
{block name="meta"}
    <meta name="description" content="Recent Webies by community users
    {if $page>1} - Page {$page}{/if} - create and share your content instantly">
    <meta name="robots" content="noindex, follow">
{/block}
{block name="headTitle"}
    <span class="header-icon recent-webies"></span>
    <h2>Recent Webies</h2>
{/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}recent/</div>
        <div data-role="search-value"></div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}