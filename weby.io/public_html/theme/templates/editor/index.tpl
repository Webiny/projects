{extends file="layouts/master.tpl"}

{block name="title"}Weby editor{/block}
{block name="body-class"}editor {/block}
{block name="head"}
    {include file="templates/editor/includes/editorIncludes.tpl"}
    {include file="templates/editor/includes/editorRemoteIncludes.tpl"}
{/block}

{block name="headerMiddle"}
    {include file="templates/editor/includes/title.tpl"}
{/block}

{block name="headerRightTools"}
    {include file="templates/common/searchWebies.tpl"}
    {include file="templates/common/socialShare.tpl"}
    {include file="templates/common/userOptions.tpl"}
{/block}

{block name="content"}
    <div class="bootstrap" data-role="weby">{$weby->toJson()}</div>
    <div class="bootstrap" data-role="disabled-tools">{$disabledTools}</div>
    <div class="bootstrap" data-role="content-validator">{$contentValidator}</div>
    <div class="bootstrap" data-role="tag-finder">{$tagFinder}</div>
    <div class="bootstrap" data-role="user-onboarding">{$viewObject.user->completedOnboarding()}</div>
    <div id="toolbar">
        <ul></ul>
    </div>
    <div id="drag-helper" style="position: absolute; width:0; height: 0;"></div>
    {include file="templates/editor/includes/loading.tpl"}
    {include file="templates/common/webyContent.tpl"}
    {include file="templates/editor/includes/webyToolbar.tpl"}
    {include file="templates/common/dashboard.tpl"}
    <div id="outer-widgets" class="dialog" style="display:none">
        <img src="{$viewObject.themeWebPath}images/widgets-too-far.png"/>

        <p class="buttons">
            <span id="button-dont-move-widgets" class="button">No, leave them.</span>
            <span id="button-move-widgets" class="button main" data-role="weby-dialog-save">Yes, sure!</span>
        </p>
    </div>
    {include file="templates/common/favorites.tpl"}
    {include file="templates/common/followers.tpl"}

    {if !$viewObject.user->completedOnboarding()}
        {include file="templates/editor/includes/introDialog.tpl"}
    {/if}
    {include file="templates/common/linkWidgetTemplates.tpl"}
{/block}

{block name="footer"}
    {include file="layouts/includes/editorFooter.tpl"}
{/block}
