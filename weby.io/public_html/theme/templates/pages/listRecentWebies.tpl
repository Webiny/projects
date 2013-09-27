{extends file="templates/pages/listing.tpl"}

{block name="title"}Recent Webies{/block}
{block name="headTitle"}Recent Webies{/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}recent/</div>
        <div data-role="search-value"></div>
        <div data-role="search-page">{$page}</div>
    </div>
    <div class="tpl-holder"></div>
    <div class="pagination"></div>
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}