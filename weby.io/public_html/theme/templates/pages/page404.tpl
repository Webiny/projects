{extends file="layouts/staticPage.tpl"}

{block name="title"}Page not found{/block}
{block name="head"}{/block}
{block name="content"}
    <div class="error-text">
        <div class="box404">
            <h1>404</h1>
            <span>Error page</span>
        </div>
        <div class="message404">
            <h2>
                Oop, this weby no longer exists!
            </h2>
            <p>
                Check out Webies by recent by tags:
            </p>
            <div class="tags">
                {foreach from=$recentTags item=tag}
                <span class="weby-tag-blue">
                    <a style="color:white; text-decoration: none;" href="{$viewObject.webPath}tag/{$tag.slug}">{$tag.tag}</a>
                </span>
                {/foreach}
            </div>
        </div>
    </div>
{/block}