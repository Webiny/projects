{extends file="templates/pages/listing.tpl"}

{block name="title"}{$user.username} Webies{if $page>1} - Page {$page}{/if}{/block}
{block name="meta"}
    <meta name="description" content="{$user.username} Webies - Page {if $page>1} - Page {$page}{/if} - create and share your content instantly">
    <meta name="robots" content="index, follow">
    {if $user.serviceName == 'google'}
        <link rel="author" href="https://plus.google.com/{$user.serviceUserId}">
    {else}
    {*<link href="https://plus.google.com/TREBA-NAM-GPLUS" rel="publisher"/>*}
    {/if}
{/block}
{block name="headTitle"}
    <span class="header-icon userAvatar"
          {if $user.avatarUrl}style="background-image: url({$user.avatarUrl}); background-size: cover; background-position: top left"{/if}></span>
    <h2>{$searchValue}</h2>
    {/block}
{block name="content"}
    <span class="header-icon tag"></span>
    <div class="bootstrap">
        <div data-role="search-url">{$viewObject.webPath}user/</div>
        <div data-role="search-value">{$user.username}</div>
        <div data-role="search-page">{$page}</div>
    </div>
    {$html}
    <div class="bottom-spacing" style="height: 40px; width: 100%"></div>
{/block}