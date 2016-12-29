function switchAd (el) {
	if ($(el).css('display') == 'none') {
		$(el).slideDown();
		$(el).prev().find('.wall_post_more').text('Hide');
	} else {
		$(el).slideUp();
		$(el).prev().find('.wall_post_more').text('Show');
	}
}