$(function(){

	"use strict";

	var DrunkenBearTimeline = Backbone.View.extend({

		initialize: function(){
			$(window).on('resize', this.resize_handler).trigger('resize');
		},

		resize_handler: function(){
			$('#main-container').css('min-height', $(window).height() );
		}

	});

	new DrunkenBearTimeline();

});
