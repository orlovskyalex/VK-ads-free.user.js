// ==UserScript==
// @name          VK-ads-free
// @description   Removes ads from vk.com/feed
// @version       1.2.3
// @updateURL     https://openuserjs.org/meta/orlovskyalex/VK-ads-free.meta.js
// @downloadURL   https://openuserjs.org/src/scripts/orlovskyalex/VK-ads-free.user.js
// @source        https://github.com/orlovskyalex/VK-ads-free.user.js
// @namespace     orlovskyalex
// @author        Alex Orlovsky
// @grant         none
// @include       *vk.com/feed*
// @require       https://code.jquery.com/jquery-3.1.1.min.js
// @copyright     2016, Alex Orlovsky (https://github.com/orlovskyalex)
// ==/UserScript==

window.onload = function () {

    // this is awful, I know =\
    // wait for a newer version of script
    var script = '<script>function switchAd (el) {if (el.hasAttribute("style")) {el.removeAttribute("style"); el.previousSibling.childNodes[1].innerHTML = "Hide";} else {el.setAttribute("style", "display: none;"); el.previousSibling.childNodes[1].innerHTML = "Show";}}</script>',
        showCSS = 'cursor: pointer; display: block; font: 500 13px -apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif; margin-top: 10px;',
        showAd = '<span class="wall_post_more" onclick="switchAd(this.parentElement.nextSibling)" style="'+showCSS+'">Show</span>',
        adCSS = 'font-family: monospace; padding: 15px 20px 20px;',
        adWasHere = '<div style="'+adCSS+'">Ad was here, so I blocked it for you. '+showAd+script+'</div>',
        // add your keywords to block in this array
        // IMPORTANT! don't forget to backup your keywords before updating script
        keys = ['Читать полностью', 'Результат теста', 'Пoказать пoлностью', 'читать продолжение'];

    // remove ads on page load
    var posts = $('.feed_row');
    posts.each(function () {
        hideAd(this);
    });

    // remove ads on feed updates
    $("#feed_wall").bind("DOMNodeInserted", function (e) {
        var el = e.target;
        if ($(el).hasClass('feed_row')) {
            hideAd(el);
        }
    });

    function hideAd (el) {
        var isAd = false,
            sourceText = $(el).find('.wall_post_text').text().toLowerCase();
        for (var key in keys) {
            var compareText = keys[key].toLowerCase();
            if (sourceText.indexOf(compareText) != -1 || $(el).find('.wall_marked_as_ads').length > 0) {
                isAd = true;
            }
        }
        if (isAd) {
            var content = $(el).find('.post_info');
            $(adWasHere).insertBefore(content);
            content.css('display', 'none');
        }
    }

};