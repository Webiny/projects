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
    {assign var="editor" value="true"}
        <li class="my-webies">
            <a href="javascript:void(0)" data-role="dashboard-dialog-open"></a>
        </li>
        {include file="templates/common/socialShare.tpl"}
        {include file="templates/common/userOptions.tpl"}
        </div>
{/block}

{block name="content"}
    <div class="bootstrap" data-role="weby">{$weby->toJson()}</div>
    <div class="bootstrap" data-role="content-validator">{$contentValidator}</div>
    <div class="bootstrap" data-role="user-onboarding">{$viewObject.user->completedOnboarding()}</div>
    <div id="toolbar">
        <ul></ul>
    </div>
    <div id="drag-helper" style="position: absolute; width:0; height: 0;"></div>
    {include file="templates/editor/includes/loading.tpl"}
    {include file="templates/common/webyContent.tpl"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    {include file="templates/editor/includes/webyToolbar.tpl"}
    {include file="templates/common/dashboard.tpl"}
    <div id="outer-widgets" style="display:none">
        <p>There are some widgets located outside of your new canvas.<br/> Would you like to move them inside your new
            canvas?</p>
        <button id="button-move-widgets">Yes, sure!</button>
        <button id="button-dont-move-widgets">No, leave them.</button>
    </div>
    {include file="templates/common/favorites.tpl"}đ
    {if !$viewObject.user->completedOnboarding()}
        {include file="templates/editor/includes/introDialog.tpl"}
    {/if}
{/block}

