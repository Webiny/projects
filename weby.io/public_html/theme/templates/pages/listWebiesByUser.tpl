{extends file="templates/pages/listing.tpl"}

{block name="title"}Webies - {$username}{/block}
{block name="headTitle"}
    <span class="header-icon userAvatar"
          {if $webyUser.avatarUrl}style="background-image: url({$webyUser.avatarUrl}); background-size: cover; background-position: top left"{/if}></span>
    <h2>{$username}</h2>
    {/block}
{block name="content"}
    <span class="header-icon tag"></span>
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}user/</div>
        <div data-role="search-value">{$username}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}