<div id="document-settings">
    <ul class="tabs">
        <li>
            <a href="#doc-color">Color</a>
        </li>
        <li>
            <a href="#doc-pattern">Pattern</a>
        </li>
        <li data-tab="video">
            <a href="#doc-video">Youtube</a>
        </li>
        <li class="dummy"></li>
    </ul>
    <div id="doc-color" class="tab">
        <div id="doc-color-picker" style="width: 264px; border: none;"></div>
    </div>
    <div id="doc-video" class="tab">
        <span class="error-message"></span>
        <input type="text" data-role="input-youtube" class="settings-input"
               value="" placeholder="Paste a Youtube video URL" />
        <div class="volume-control" data-role="video-volume-control">
            <span class="title">Volume:</span>
            <input data-role="k-slider-video-volume"/>
        </div>
        <a data-role="btn-youtube-remove" href="javascript:void(0)" class="green-button icon delete">Remove video</a>
        <a data-role="btn-youtube-apply" href="javascript:void(0)" class="green-button">Load video</a>
        <span class="info-message top-margin"></span>
    </div>
    <div id="doc-pattern" class="tab">
        <div id="doc-patterns-list" class="patterns-list"></div>
        <div class="k-pager-wrap patterns-pager"></div>
        <span class="credits">
            Powered by <a target="_blank" href="http://subtlepatterns.com">SubtlePatterns.com</a>
        </span>
    </div>
</div>