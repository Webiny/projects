{extends file="templates/pages/listing.tpl"}

{block name="title"}Webies - following users{/block}
{block name="headTitle"}
    <span class="header-icon following-users-webies"></span>
    <h2>Webies - following users</h2>
{/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}following/</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}