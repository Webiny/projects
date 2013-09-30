{extends file="layouts/staticPage.tpl"}

{block name="title"}Weby editor{/block}
{block name="head"}
    {minify type="css"}
        list.css
    {/minify}

    {minify type="js" obfuscate=true}
        frontend/webyListing.js
    {/minify}
{/block}

{block name="headerMiddle"}
    <div class="header-middle header-middle-wrap">
        {block name="headTitle"}{/block}
    </div>
{/block}

{block name="content"}{/block}
{block name="outerTemplates"}
    {include file="templates/pages/includes/listBox.tpl"}
{/block}
