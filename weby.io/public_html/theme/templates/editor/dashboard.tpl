{extends file="layouts/master.tpl"}

{block name="title"}Dashboard{/block}
{block name="head"}
    {include file="templates/editor/includes/dashboardIncludes.tpl"}
{/block}

{block name="headerRightTools"}
    {if $viewObject.user}
        <div style="float:right">
            {include file="templates/common/userOptions.tpl"}
        </div>
    {/if}
{/block}

{block name="content"}
    <div id="content"
         style="width:100%; height:100%; background: url('{$viewObject.themeWebPath}images/patterns/purty_wood.png') repeat"></div>
    {include file="templates/common/dashboard.tpl"}
    {include file="templates/common/favorites.tpl"}
    {include file="templates/common/unsupportedBrowser.tpl"}
    {include file="templates/common/followers.tpl"}
{/block}

{block name="footer"}
    {include file="layouts/includes/editorFooter.tpl"}
{/block}