$(function(){

	"use strict";

	var DrunkenBear = Backbone.View.extend({

		el: $('#drunken-bear'),

		events: {
			'click .movie' : 'get_details',
			'click #add-btn' : 'add_btn_handler',
			'keypress #ean-input' : 'add_item',
			'click .delete-btn': 'delete_item',
			'click .buy-btn': 'buy_item'
		},


		get_details: function(event){
			var $movie = $(event.currentTarget);
			$.get('/item/details/'+$movie.data('item-id'), function(data){
				$("#main > .content").html(data);
				$('.email-item-selected').removeClass('email-item-selected');
				$movie.addClass('email-item-selected');
			})
		},

		add_btn_handler: function(event){
			var $input = $("#ean-input");
			if(!$input.data('step'))
				$input
					.css({'width': '100px', 'opacity':'1'})
					.data('step',1);
			else
				$input
					.css({'width': '0', 'opacity':'0'})
					.data('step',0);
		},

		delete_item: function(event){
			var $movie = $(event.currentTarget).closest('.movie-details');
			var id = $movie.data('item-id');

			$.ajax('/item/'+id, {
				method:'DELETE'
			}).success(function(){
				$('*[data-item-id='+id+']').remove();
			});
		},
		buy_item: function(event){
			window.open($(event.currentTarget).data('link'),'_blank');

		},
		add_item: function(event){
			var ean = $("#ean-input").val();

			if( ! (isNaN(1*ean) || ean.length !== 13 || event.which !== 13))
				$.ajax('/item/add/'+ean, {
					method: 'GET', data : ean
				}).success(function(data){
					$("#list .content").prepend(data);
				});
			else
				this.import_eans(event);
		},
		import_eans: function(event){
			var ean = $("#ean-input").val();
			console.log('trying to import:', ean.split(','));

			$.ajax('/item/import/'+ean, {
				method: 'GET', data : ean
			}).success(function(data){
				document.location.reload();
			});
		}
	});

	new DrunkenBear();

});
