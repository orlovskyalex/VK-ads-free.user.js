// ==UserScript==
// @name              VK-ads-free
// @description       Removes ads from vk.com/feed
// @version           2.0.6
// @updateURL         https://openuserjs.org/meta/orlovskyalex/VK-ads-free.meta.js
// @downloadURL       https://openuserjs.org/src/scripts/orlovskyalex/VK-ads-free.user.js
// @source            https://github.com/orlovskyalex/VK-ads-free.user.js
// @namespace         orlovskyalex
// @author            Alex Orlovsky
// @grant             none
// @include           *vk.com/feed*
// @require           https://code.jquery.com/jquery-3.1.1.min.js
// @copyright         2016-2017, Alex Orlovsky (https://github.com/orlovskyalex)
// ==/UserScript==

$(function () {

	var html = $('html'),
		keysMenu = $('<a id="top_vk-ads-free_settings_link" class="top_profile_mrow">').text('VK-ads-free'),
		keysForm = $('<div id="keywords_field" contenteditable="true" autofocus="true">'),
		keysFormLabel = $('<div class="label">').text('Keywords:'),
		keysSaveBtn = $('<button id="keywords_save_btn" class="flat_button wk_like_wrap _like_wrap">Save</button>'),
		keysClearBtn = $('<button id="keywords_clear_btn" class="flat_button secondary button_light wl_action_link">Clear</button>'),
		keysBlock = $('<div id="keywords_wrapper" class="popup_box_container">')
		.append($('<div class="box_layout">')
			.append($('<div class="box_title_wrap">')
				.append($('<div class="box_x_button">'))
				.append($('<div class="box_title">')
					.text('VK-ads-free 2.0.6')))
			.append($('<div class="box_body box_no_buttons">')
				.append(keysFormLabel)
				.append(keysForm)
				.append($('<div class="clear_fix">')
					.append(keysSaveBtn)
					.append(keysClearBtn)))),
		boxlayerbg = $('#box_layer_bg'),
		boxlayerwrap = $('#box_layer_wrap'),
		boxlayer = $('#box_layer'),
		keys,
		posts;

	// css
	$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/orlovskyalex/VK-ads-free.user.js/master/VK-ads-free.style.css">');

	if (!localStorage.getItem('vk-ads-free_menu_opened') || !localStorage.getItem('vk-ads-free_keywords')) {
		html.addClass('vk-ads-free_guide');
	}

	if (localStorage.getItem('vk-ads-free_instruction_readed') != '2.0.6') {
		window.open('https://github.com/orlovskyalex/VK-ads-free.user.js#Функционал', '_blank');
		localStorage.setItem('vk-ads-free_instruction_readed', '2.0.6');
	}

	// sets keywords
	if (localStorage.getItem('vk-ads-free_keywords')) {
		keys = localStorage.getItem('vk-ads-free_keywords').split('; ');
	}

	// removes all visible ads on page
	hideAllVisibleAd();

	// removes ads on feed updates
	$('#feed_wall').bind('DOMNodeInserted', function (e) {
		var el = e.target;
		if ($(el).hasClass('feed_row')) {
			hideAd(el);
		}
	});

	keysMenu.insertBefore('#top_logout_link').after($('<div>').addClass('top_profile_sep'));

	keysMenu.on('click', function () {
		keywordsShow();
	});

	keysBlock.on('click', '.box_x_button', keywordsHide);

	$(document).on('mouseup', function (e) {
		if (boxlayer.find('#keywords_wrapper').length && e.target != keysBlock[0] && !keysBlock.has(e.target).length) {
			keywordsHide();
		}
	});

	function keywordsShow() {
		boxlayer.append(keysBlock);
		boxlayerbg.show();
		boxlayerwrap.show();
		if (keys) {
			var skeys = '';
			for (var i in keys) {
				skeys += keys[i];
				if (i < keys.length - 1) skeys += '; ';
			}
			keysForm.text(skeys);
		}
		keysForm.focus();
		keywordsDo();
		return false;
	}

	function keywordsHide() {
		if (!localStorage.getItem('vk-ads-free_menu_opened')) localStorage.setItem('vk-ads-free_menu_opened', true);
		localStorage.getItem('vk-ads-free_keywords') ? html.removeClass('vk-ads-free_guide') : html.addClass('vk-ads-free_guide');
		boxlayerbg.hide();
		boxlayerwrap.hide();
		keysBlock.detach();
	}

	function keywordsDo() {
		keysSaveBtn.on('click', function () {
			keys = keysForm.text();
			if (keys) {
				localStorage.setItem('vk-ads-free_keywords', keys);
				keys = keys.split('; ');
			} else {
				localStorage.removeItem('vk-ads-free_keywords');
			}
			keywordsHide();
			hideAllVisibleAd();
		});

		keysClearBtn.on('click', function () {
			keysForm.empty();
		});
	}

	function hideAd(el) {
		var post = $(el),
			isAd = false,
			sourceText = post.find('.wall_post_text').text().toLowerCase(),
			compareText;

		// check if current post is ad
		if (keys) {
			for (var i in keys) {
				compareText = keys[i].toLowerCase();
				if (sourceText.indexOf(compareText) != -1) {
					isAd = true;
				}
			}
		}
		if (post.find('.wall_marked_as_ads').length) isAd = true;

		if (isAd) {
			var text = post.find('.wall_post_text');

			// creates text content for non-text ads or removes emoji
			text.length ? text.find('.emoji').remove() : text = '<div class="wall_post_text">' + post.find('.wall_marked_as_ads').text() + '</div>';

			post.find('.post').html('').append(text);
			post.find('.post').addClass('post_marked_as_ads');
		}

		// removes advertised applications
		if (post.find('.ads_ads_news_wrap').length) {
			post.remove();
		}
	}

	function hideAllVisibleAd() {
		posts = $('.feed_row');
		posts.each(function () {
			hideAd(this);
		});
	}

});