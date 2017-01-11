// ==UserScript==
// @name              VK-ads-free
// @description       Removes ads from vk.com/feed
// @version           1.4.1
// @updateURL         https://openuserjs.org/meta/orlovskyalex/VK-ads-free.meta.js
// @downloadURL       https://openuserjs.org/src/scripts/orlovskyalex/VK-ads-free.user.js
// @source            https://github.com/orlovskyalex/VK-ads-free.user.js
// @namespace         orlovskyalex
// @author            Alex Orlovsky
// @grant             none
// @include           *vk.com/feed*
// @require           https://code.jquery.com/jquery-3.1.1.min.js
// @copyright         2016, Alex Orlovsky (https://github.com/orlovskyalex)
// ==/UserScript==

$(document).ready(function () {

	// add your keywords to block in this array
	// IMPORTANT! don't forget to backup your keywords before updating script
	var keys = ['Читать полностью', 'Результат теста', 'Пoказать пoлностью', 'читать продолжение'];

	// remove ads on page load
	var posts = $('.feed_row');
	posts.each(function () {
		hideAd(this);
	});

	// remove ads on feed updates
	$('#feed_wall').bind('DOMNodeInserted', function (e) {
		var el = e.target;
		if ($(el).hasClass('feed_row')) {
			hideAd(el);
		}
	});

	function hideAd(el) {
		var isAd = false,
			sourceText = $(el).find('.wall_post_text').text().toLowerCase();
		for (var key in keys) {
			var compareText = keys[key].toLowerCase();
			if (sourceText.indexOf(compareText) != -1 || $(el).find('.wall_marked_as_ads').length > 0) {
				isAd = true;
			}
		}
		if (isAd) {
			$(el).find('.post_header').hide();
			$(el).find('.post_content').css({
				'height': '43px',
				'overflow': 'hidden'
			});
			$(el).find('.wall_text').css('padding-top', '0');
			if ($(el).find('.copy_quote').length > 0) {
				$(el).find('.copy_quote').css({
					'border-left': 'none',
					'margin': '0',
					'padding-left': '0'
				});
				$(el).find('.copy_post_header').hide();
				$(el).find('.wall_post_text').css('padding-top', '3px');
			}
		}
	}

});