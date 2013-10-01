{extends file="templates/pages/listing.tpl"}

{block name="title"}Webies - search{/block}
{block name="headTitle"}
    <span class="header-icon tag"></span>
    <h2>{$searchValue}</h2>
    {/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}recent/</div>
        <div data-role="search-value">{$searchValue}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}