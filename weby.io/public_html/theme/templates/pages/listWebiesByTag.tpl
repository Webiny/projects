{extends file="templates/pages/listing.tpl"}

{block name="title"}Tag search{/block}
{block name="headerMiddle"}
    <div class="header-middle header-middle-wrap user-avatar-icon">
        <span class="header-icon default-user-avatar"></span>
        <h2>{block name="headTitle"}{$tag}{/block}</h2>
    </div>
{/block}
{block name="content"}
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}tag/</div>
        <div data-role="search-value">{$tag}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    <div class="tpl-holder"></div>
    <div class="pagination"></div>
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}