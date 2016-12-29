// ==UserScript==
// @name         VK-ads-free
// @description  Removes ads from vk.com/feed
// @version      1.0
// @namespace    orlovskyalex
// @author       Alex Orlovsky
// @grant        none
// @include      *//vk.com/feed*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @copyright    2016, Alex Orlovsky (https://github.com/orlovskyalex)
// ==/UserScript==

window.onload = function () {

    // this is awful, I know =\
    // wait for a newer version of script
    var script = '<script>function switchAd (el) {if (el.hasAttribute("style")) {el.removeAttribute("style"); el.previousSibling.childNodes[1].innerHTML = "Hide";} else {el.setAttribute("style", "display: none;"); el.previousSibling.childNodes[1].innerHTML = "Show";}}</script>',
        showCSS = 'color: #2a5885; font-weight: 700; text-decoration: underline;',
        showAd = '<span onclick="switchAd(this.parentElement.nextSibling)" style="'+showCSS+'">Show</span>',
        adCSS = 'font-family: monospace; padding: 15px 20px 20px;',
        adWasHere = '<div style="'+adCSS+'">Shit was here. '+showAd+script+'</div>';

    // remove ads on page load
    var adPosts = $('.wall_marked_as_ads').closest('.post');
    adPosts.each(function () {
        hideAd(this);
    });

    // remove ads on feed updates
    $("#feed_wall").bind("DOMNodeInserted", function (e) {
        var el = e.target;
        if ($(el).hasClass('feed_row')) {
            if ($(el).find('.wall_marked_as_ads').length > 0) {
                hideAd(el);
            }
        }
    });

    function hideAd (el) {
        var content = $(el).find('.post_info');
        $(adWasHere).insertBefore(content);
        content.css('display', 'none');
    }

};