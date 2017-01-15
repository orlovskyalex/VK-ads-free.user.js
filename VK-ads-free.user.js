// ==UserScript==
// @name              VK-ads-free
// @description       Removes ads from vk.com/feed
// @version           2.1.0
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

var $keywords_field = $('<div id="keywords_field" contenteditable="true" autofocus="true">'),
	$keywords_save = $('<button id="keywords_save_btn" class="flat_button wk_like_wrap _like_wrap">Save</button>'),
	$keywords_clear = $('<button id="keywords_clear_btn" class="flat_button secondary button_light wl_action_link">Clear</button>'),
	$script_link = $('<a class="title_link" href="https://github.com/orlovskyalex/VK-ads-free.user.js#vk-ads-free" target="_blank">VK-ads-free</a>'),
	$script_menu = $('<div id="vk-ads-free_menu" class="popup_box_container">')
	.append($('<div class="box_layout">')
		.append($('<div class="box_title_wrap">')
			.append($('<div class="box_x_button">'))
			.append($('<div class="box_title">')
				.append($script_link)
				.append('2.1.0')))
		.append($('<div class="box_body box_no_buttons">')
			.append('<div>Keywords:</div>')
			.append($keywords_field)
			.append($('<div class="buttons_wrap clear_fix">')
				.append($keywords_save)
				.append($keywords_clear)))),
	$script_menu_link = $('<a id="top_vk-ads-free_settings_link" class="top_profile_mrow">VK-ads-free</a>'),
	body,
	box_layer_bg,
	box_layer_wrap,
	$box_layer,
	keywords;

$(function () {

	body = document.body;
	box_layer_bg = document.getElementById('box_layer_bg');
	box_layer_wrap = document.getElementById('box_layer_wrap');
	$box_layer = $('#box_layer');
	keywords;

	// css
	$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/orlovskyalex/VK-ads-free.user.js/e306c7cd9402623f85b67ef857fcf8b12eb189a4/VK-ads-free.style.css">');

	// show guide arrow
	if (!localStorage.getItem('vk-ads-free_menu_opened') || !localStorage.getItem('vk-ads-free_keywords')) {
		body.classList.add('vk-ads-free_guide');
	}

	// read keywords from localStorage
	if (localStorage.getItem('vk-ads-free_keywords')) {
		keywords = localStorage.getItem('vk-ads-free_keywords').split('; ');
	}

	// remove all visible ads on page
	hideAllVisibleAd();

	// remove ads on feed updates
	$('#feed_wall').bind('DOMNodeInserted', function (e) {
		var el = e.target;
		if (el.classList.contains('feed_row')) {
			hideAd(el);
		}
	});

	$script_menu_link.insertBefore('#top_logout_link').after('<div class="top_profile_sep">');

	$script_menu_link.on('click', keywordsShow);

	$script_menu.on('click', function (e) {
		if (e.target.classList.contains('box_x_button')) {
			keywordsHide();
		}
	});

	$script_link.on('click', function () {
		window.open($(this).attr('href'), '_blank');
	});

	body.addEventListener('mouseup', function (e) {
		if ($box_layer.find('#vk-ads-free_menu').length && e.target != $script_menu && !$script_menu.has(e.target).length) {
			keywordsHide();
		}
	});

});

function keywordsShow() {
	$box_layer.append($script_menu);
	box_layer_bg.style.display = 'block';
	box_layer_wrap.style.display = 'block';
	if (keywords) {
		var skeys = '',
			i;
		for (i in keywords) {
			skeys += keywords[i] + '; ';
		}
		$keywords_field.text(skeys.slice(0, -2));
	}
	$keywords_field.focus();
	keywordsDo();
}

function keywordsHide() {
	if (!localStorage.getItem('vk-ads-free_menu_opened')) localStorage.setItem('vk-ads-free_menu_opened', true);
	localStorage.getItem('vk-ads-free_keywords') ? body.classList.remove('vk-ads-free_guide') : body.classList.add('vk-ads-free_guide');
	box_layer_bg.style.display = 'none';
	box_layer_wrap.style.display = 'none';
	$script_menu.detach();
}

function keywordsDo() {
	$keywords_save.on('click', function () {
		keywords = $keywords_field.text();
		if (keywords) {
			localStorage.setItem('vk-ads-free_keywords', keywords);
			keywords = keywords.split('; ');
		} else {
			localStorage.removeItem('vk-ads-free_keywords');
		}
		keywordsHide();
		hideAllVisibleAd();
	});

	$keywords_clear.on('click', function () {
		$keywords_field.empty();
	});
}

function hideAd(el) {
	var post = $(el),
		isAd = false;

	// check if current post is ad
	if (keywords) {
		var sourceText = post.find('.wall_post_text').text().toLowerCase(),
			compareText;
		for (var i in keywords) {
			compareText = keywords[i].toLowerCase();
			if (sourceText.indexOf(compareText) != -1) {
				isAd = true;
			}
		}
	}
	if (post.find('.wall_marked_as_ads').length) isAd = true;

	if (isAd) {
		var text = post.find('.wall_post_text');

		// create text content for non-text ads or removes emoji
		text.length ? text.find('.emoji').remove() : text = '<div class="wall_post_text">' + post.find('.wall_marked_as_ads').text() + '</div>';

		// replace original content with preview
		post.find('.post').addClass('post_marked_as_ads').empty().append(text);
	}

	// remove advertised applications
	if (post.find('.ads_ads_news_wrap').length) {
		post.remove();
	}
}

function hideAllVisibleAd() {
	var $posts = $('.feed_row');
	$posts.each(function () {
		hideAd(this);
	});
}