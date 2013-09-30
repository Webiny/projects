{extends file="layouts/master.tpl"}

{block name="title"}{$weby.title}{/block}
{block name="head"}
    <meta name="description" content="{$weby.description|default:'Created with Weby.io'}"/>
    <meta property="og:site_name" content="Weby.io"/>
    <meta property="og:title" content="{$weby.title}"/>
    <meta property="og:url" content="{$weby.publicUrl}"/>
    <meta property="og:image" content="{$weby->getImage('original-screenshot')}"/>
    <meta property="og:description" content="{$weby.description|default:'Created with Weby.io'}"/>
    {if !$weby.metaFollow}<meta name="robots" content="noindex, nofollow">{/if}

    <link data-page-subject="true" href="{$weby->getImage('original-screenshot')}" rel="image_src"/>
    {include file="templates/pages/includes/appIncludes.tpl"}
    {include file="templates/pages/includes/appRemoteIncludes.tpl"}
{/block}
{block name="headerMiddle"}
    {include file="templates/pages/includes/title.tpl"}
{/block}
{block name="content"}
    {include file="templates/pages/includes/webyDetails.tpl"}
    {include file="templates/common/webyContent.tpl"}
    {include file="templates/common/loading.tpl"}
    {include file="templates/common/dashboard.tpl"}
    {include file="templates/common/favorites.tpl"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    <div class="bootstrap" data-role="weby">{$weby->toJson()}</div>
    <div class="bootstrap" data-role="json-data">{$weby->getSummaryData()}</div>
    {*
    {if $viewObject.mode}
    var data = {$weby->getSummaryData()};
    {else}
    var data = {literal}<esi:include src="/tools/weby-summary/{/literal}{$weby->getId()}{literal}"/>{/literal}
    {/if}
    *}

{/block}
{block name="headerRightTools"}
    {if $viewObject.user}
        <li class="my-webies">
            <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
        </li>
    {/if}

    {include file="templates/common/socialShare.tpl"}
    {if $viewObject.user}
        {include file="templates/common/userOptions.tpl" empty="true"}
    {else}
        {include file="templates/pages/includes/authorization.tpl"}
    {/if}
{/block}