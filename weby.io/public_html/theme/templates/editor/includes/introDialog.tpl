<div class="dialog" id="introduction-dialog" style="display: none">
    <!-- confirmation message -->
    <div class="overlay" style="display: none"></div>
    <div class="confirmation-message" style="position: absolute; top: 84px; left: 70px; z-index: 10100; display: none">
        <span class="skip-confirmation"></span>
        <p style="text-align: center">
            <span class="button main" data-role="skip-confirm-no">No, return to the introduction!</span>
            <span data-role="skip-confirm-yes" class="button">Yes</span>
        </p>
    </div>

    <!-- main dialog -->
    <h1>Welcome to Weby.io</h1>

    <h2>Best place to create and share your content</h2>

    <p>
        Experience the new way of creating something beautiful - from content collections, family albums,
        birthday party
        invitations, to band and celebrity fan pages - Weby.io is a fun and exciting new ways to mash and share
        what is important to you.
    </p>

    <p>
        With Weby.io fun never stops - you decide what you want to create and share with your friends and the
        rest of
        the world.
    </p>

    <p>
        Go through our short few steps intro or immediately create your first Weby!
    </p>

    <p class="buttons" style="text-align: center">
        <span data-role="start-introduction" class="button main">Start introduction</span>
        <a target="_blank" href="{$viewObject.webPath}recent"><span class="button">What can you do with Weby</span></a>
        <span class="button" data-role="skip-introduction">Skip</span>
    </p>

</div>