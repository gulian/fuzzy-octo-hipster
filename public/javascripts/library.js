$(function(){

	"use strict";

	var DrunkenBearLibrary = Backbone.View.extend({

		el: $('#movie-list'),

		events: {
			'click .remove-btn' : 'remove',
			'click .edit-btn' : 'edit',
			'click .share-btn' : 'share'
		},

		initialize: function(){
			$(window).on('resize', this.resize_handler).trigger('resize');
		},

		resize_handler: function(){
			$('#main-container').css('min-height', $(window).height() );
		},

		share: function(event){
			var id = $(event.currentTarget).closest('blockquote').data('item-id');
			console.log(id);
		},

		edit: function(event){

		},

		remove: function(event){
			$('#confirm-delete-modal')
				.find('.movie-sumup')
					.html($(event.currentTarget).closest('blockquote').clone().removeClass('span6').addClass('span4').find('.btn-group').remove().end())
					.end()
				.find('.modal-remove-btn').unbind()
					.on('click', function(){ // unbind all before
						$.ajax('item', {
							method:'DELETE',
							data : {_id : $(event.currentTarget).closest('blockquote').data('item-id')}
						}).success(function(){
							$(event.currentTarget).closest('blockquote').remove();
						});
					})
					.end()
			.modal();
		}
	});

	new DrunkenBearLibrary();

});
