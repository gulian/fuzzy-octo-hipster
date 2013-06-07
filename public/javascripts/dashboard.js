$(function(){

	"use strict";

	var DrunkenBear = Backbone.View.extend({

		el: $('#drunken-bear'),

		events: {
			'submit   #ean13-form'   : 'ean13_form_submit',
			'keypress #ean13-number' : 'ean13_number_handler'
		},

		initialize: function(){
			$(window).on('resize', this.resize_handler).trigger('resize');
		},

		ean13_form_submit: function(event){
			event.preventDefault();
			var ean = $('#ean13-number').val(), self = this;

			if(ean.length !== 13) // TODO: other verification
				return false ;

			$.getJSON('item/search/'+ean, function(data){
				$('#search-results').append((new SearchResult(data)).render());
			});
		},

		resize_handler: function(){
			$('#main-container').css('min-height', $(window).height() );
		}
	});

	var SearchResult = Backbone.View.extend({

		template: _.template($("script#search-result-template").html()),

		events: {
			'click .add-to-collection-btn': 'add_to_collection',
			'click .edit-btn'             : 'edit',
			'click .cancel-btn'           : 'cancel'
		},

		initialize: function(data){
			this.data = data ;
		},

		render: function(){
			this.$el.html(this.template(this.data));
			return this.$el;
		},

		add_to_collection: function(){
			$.ajax('item/add', {
				method: 'POST',
				data : this.data
			}).success(function(data){
				//todo: tell success to ui
			});
		},

		edit: function(){
			console.log(this.data);
		},

		cancel: function(){
			console.log(this.data);
		}

	});

	new DrunkenBear();

});
