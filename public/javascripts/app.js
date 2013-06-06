$(function(){

	"use strict";

	var DrunkenBear = Backbone.View.extend({

		el: $('#drunken-bear'),

		events: {
			'submit   #ean13-form'   : 'ean13_form_submit',
			'keypress #ean13-number' : 'ean13_number_handler'
		},

		ean13_form_submit: function(event){
			event.preventDefault();
			var ean = $('#ean13-number').val(), self = this;

			if(ean.length !== 13){
				return false;
			}

			$.getJSON('item/search/'+ean, function(data){
				self.fill_search_result(data);
			});
		},

		ean13_number_handler: function(event){
		},

		fill_search_result: function(data){
			$('#search-results').append(_.template($("script#search-result-template").html())(data));
		}

	});

	new DrunkenBear();

});
