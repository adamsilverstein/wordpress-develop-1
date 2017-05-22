(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * wp.media.controller.EditAttachmentMetadata
 *
 * A state for editing an attachment's metadata.
 *
 * @class
 * @augments wp.media.controller.State
 * @augments Backbone.Model
 */
var l10n = wp.media.view.l10n,
	EditAttachmentMetadata;

EditAttachmentMetadata = wp.media.controller.State.extend({
	defaults: {
		id:      'edit-attachment',
		// Title string passed to the frame's title region view.
		title:   l10n.attachmentDetails,
		// Region mode defaults.
		content: 'edit-metadata',
		menu:    false,
		toolbar: false,
		router:  false
	}
});

module.exports = EditAttachmentMetadata;

},{}],2:[function(require,module,exports){
var media = wp.media;

media.controller.EditAttachmentMetadata = require( './controllers/edit-attachment-metadata.js' );
media.view.MediaFrame.Manage = require( './views/frame/manage.js' );
media.view.Attachment.Details.TwoColumn = require( './views/attachment/details-two-column.js' );
media.view.MediaFrame.Manage.Router = require( './routers/manage.js' );
media.view.EditImage.Details = require( './views/edit-image-details.js' );
media.view.MediaFrame.EditAttachments = require( './views/frame/edit-attachments.js' );
media.view.SelectModeToggleButton = require( './views/button/select-mode-toggle.js' );
media.view.DeleteSelectedButton = require( './views/button/delete-selected.js' );
media.view.DeleteSelectedPermanentlyButton = require( './views/button/delete-selected-permanently.js' );

},{"./controllers/edit-attachment-metadata.js":1,"./routers/manage.js":3,"./views/attachment/details-two-column.js":4,"./views/button/delete-selected-permanently.js":5,"./views/button/delete-selected.js":6,"./views/button/select-mode-toggle.js":7,"./views/edit-image-details.js":8,"./views/frame/edit-attachments.js":9,"./views/frame/manage.js":10}],3:[function(require,module,exports){
/**
 * wp.media.view.MediaFrame.Manage.Router
 *
 * A router for handling the browser history and application state.
 *
 * @class
 * @augments Backbone.Router
 */
var Router = Backbone.Router.extend({
	routes: {
		'upload.php?item=:slug&mode=edit': 'editItem',
		'upload.php?item=:slug':           'showItem',
		'upload.php?search=:query':        'search',
		'upload.php':                      'reset'
	},

	// Map routes against the page URL
	baseUrl: function( url ) {
		return 'upload.php' + url;
	},

	reset: function() {
		var frame = wp.media.frames.edit;

		if ( frame ) {
			frame.close();
		}
	},

	// Respond to the search route by filling the search field and trigggering the input event
	search: function( query ) {
		jQuery( '#media-search-input' ).val( query ).trigger( 'input' );
	},

	// Show the modal with a specific item
	showItem: function( query ) {
		var media = wp.media,
			frame = media.frames.browse,
			library = frame.state().get('library'),
			item;

		// Trigger the media frame to open the correct item
		item = library.findWhere( { id: parseInt( query, 10 ) } );
		item.set( 'skipHistory', true );

		if ( item ) {
			frame.trigger( 'edit:attachment', item );
		} else {
			item = media.attachment( query );
			frame.listenTo( item, 'change', function( model ) {
				frame.stopListening( item );
				frame.trigger( 'edit:attachment', model );
			} );
			item.fetch();
		}
	},

	// Show the modal in edit mode with a specific item.
	editItem: function( query ) {
		this.showItem( query );
		wp.media.frames.edit.content.mode( 'edit-details' );
	}
});

module.exports = Router;

},{}],4:[function(require,module,exports){
/**
 * wp.media.view.Attachment.Details.TwoColumn
 *
 * A similar view to media.view.Attachment.Details
 * for use in the Edit Attachment modal.
 *
 * @class
 * @augments wp.media.view.Attachment.Details
 * @augments wp.media.view.Attachment
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 */
var Details = wp.media.view.Attachment.Details,
	TwoColumn;

TwoColumn = Details.extend({
	template: wp.template( 'attachment-details-two-column' ),

	initialize: function() {
		this.controller.on( 'content:activate:edit-details', _.bind( this.editAttachment, this ) );

		Details.prototype.initialize.apply( this, arguments );
	},

	editAttachment: function( event ) {
		if ( event ) {
			event.preventDefault();
		}
		this.controller.content.mode( 'edit-image' );
	},

	/**
	 * Noop this from parent class, doesn't apply here.
	 */
	toggleSelectionHandler: function() {},

	render: function() {
		Details.prototype.render.apply( this, arguments );

		wp.media.mixin.removeAllPlayers();
		this.$( 'audio, video' ).each( function (i, elem) {
			var el = wp.media.view.MediaDetails.prepareSrc( elem );
			new window.MediaElementPlayer( el, wp.media.mixin.mejsSettings );
		} );
	}
});

module.exports = TwoColumn;

},{}],5:[function(require,module,exports){
/**
 * wp.media.view.DeleteSelectedPermanentlyButton
 *
 * When MEDIA_TRASH is true, a button that handles bulk Delete Permanently logic
 *
 * @class
 * @augments wp.media.view.DeleteSelectedButton
 * @augments wp.media.view.Button
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 */
var Button = wp.media.view.Button,
	DeleteSelected = wp.media.view.DeleteSelectedButton,
	DeleteSelectedPermanently;

DeleteSelectedPermanently = DeleteSelected.extend({
	initialize: function() {
		DeleteSelected.prototype.initialize.apply( this, arguments );
		this.controller.on( 'select:activate', this.selectActivate, this );
		this.controller.on( 'select:deactivate', this.selectDeactivate, this );
	},

	filterChange: function( model ) {
		this.canShow = ( 'trash' === model.get( 'status' ) );
	},

	selectActivate: function() {
		this.toggleDisabled();
		this.$el.toggleClass( 'hidden', ! this.canShow );
	},

	selectDeactivate: function() {
		this.toggleDisabled();
		this.$el.addClass( 'hidden' );
	},

	render: function() {
		Button.prototype.render.apply( this, arguments );
		this.selectActivate();
		return this;
	}
});

module.exports = DeleteSelectedPermanently;

},{}],6:[function(require,module,exports){
/**
 * wp.media.view.DeleteSelectedButton
 *
 * A button that handles bulk Delete/Trash logic
 *
 * @class
 * @augments wp.media.view.Button
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 */
var Button = wp.media.view.Button,
	l10n = wp.media.view.l10n,
	DeleteSelected;

DeleteSelected = Button.extend({
	initialize: function() {
		Button.prototype.initialize.apply( this, arguments );
		if ( this.options.filters ) {
			this.options.filters.model.on( 'change', this.filterChange, this );
		}
		this.controller.on( 'selection:toggle', this.toggleDisabled, this );
	},

	filterChange: function( model ) {
		if ( 'trash' === model.get( 'status' ) ) {
			this.model.set( 'text', l10n.untrashSelected );
		} else if ( wp.media.view.settings.mediaTrash ) {
			this.model.set( 'text', l10n.trashSelected );
		} else {
			this.model.set( 'text', l10n.deleteSelected );
		}
	},

	toggleDisabled: function() {
		this.model.set( 'disabled', ! this.controller.state().get( 'selection' ).length );
	},

	render: function() {
		Button.prototype.render.apply( this, arguments );
		if ( this.controller.isModeActive( 'select' ) ) {
			this.$el.addClass( 'delete-selected-button' );
		} else {
			this.$el.addClass( 'delete-selected-button hidden' );
		}
		this.toggleDisabled();
		return this;
	}
});

module.exports = DeleteSelected;

},{}],7:[function(require,module,exports){
/**
 * wp.media.view.SelectModeToggleButton
 *
 * @class
 * @augments wp.media.view.Button
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 */
var Button = wp.media.view.Button,
	l10n = wp.media.view.l10n,
	SelectModeToggle;

SelectModeToggle = Button.extend({
	initialize: function() {
		_.defaults( this.options, {
			size : ''
		} );

		Button.prototype.initialize.apply( this, arguments );
		this.controller.on( 'select:activate select:deactivate', this.toggleBulkEditHandler, this );
		this.controller.on( 'selection:action:done', this.back, this );
	},

	back: function () {
		this.controller.deactivateMode( 'select' ).activateMode( 'edit' );
	},

	click: function() {
		Button.prototype.click.apply( this, arguments );
		if ( this.controller.isModeActive( 'select' ) ) {
			this.back();
		} else {
			this.controller.deactivateMode( 'edit' ).activateMode( 'select' );
		}
	},

	render: function() {
		Button.prototype.render.apply( this, arguments );
		this.$el.addClass( 'select-mode-toggle-button' );
		return this;
	},

	toggleBulkEditHandler: function() {
		var toolbar = this.controller.content.get().toolbar, children;

		children = toolbar.$( '.media-toolbar-secondary > *, .media-toolbar-primary > *' );

		// TODO: the Frame should be doing all of this.
		if ( this.controller.isModeActive( 'select' ) ) {
			this.model.set( {
				size: 'large',
				text: l10n.cancelSelection
			} );
			children.not( '.spinner, .media-button' ).hide();
			this.$el.show();
			toolbar.$( '.delete-selected-button' ).removeClass( 'hidden' );
		} else {
			this.model.set( {
				size: '',
				text: l10n.bulkSelect
			} );
			this.controller.content.get().$el.removeClass( 'fixed' );
			toolbar.$el.css( 'width', '' );
			toolbar.$( '.delete-selected-button' ).addClass( 'hidden' );
			children.not( '.media-button' ).show();
			this.controller.state().get( 'selection' ).reset();
		}
	}
});

module.exports = SelectModeToggle;

},{}],8:[function(require,module,exports){
/**
 * wp.media.view.EditImage.Details
 *
 * @class
 * @augments wp.media.view.EditImage
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 */
var View = wp.media.View,
	EditImage = wp.media.view.EditImage,
	Details;

Details = EditImage.extend({
	initialize: function( options ) {
		this.editor = window.imageEdit;
		this.frame = options.frame;
		this.controller = options.controller;
		View.prototype.initialize.apply( this, arguments );
	},

	back: function() {
		this.frame.content.mode( 'edit-metadata' );
	},

	save: function() {
		this.model.fetch().done( _.bind( function() {
			this.frame.content.mode( 'edit-metadata' );
		}, this ) );
	}
});

module.exports = Details;

},{}],9:[function(require,module,exports){
/**
 * wp.media.view.MediaFrame.EditAttachments
 *
 * A frame for editing the details of a specific media item.
 *
 * Opens in a modal by default.
 *
 * Requires an attachment model to be passed in the options hash under `model`.
 *
 * @class
 * @augments wp.media.view.Frame
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 * @mixes wp.media.controller.StateMachine
 */
var Frame = wp.media.view.Frame,
	MediaFrame = wp.media.view.MediaFrame,

	$ = jQuery,
	EditAttachments;

EditAttachments = MediaFrame.extend({

	className: 'edit-attachment-frame',
	template:  wp.template( 'edit-attachment-frame' ),
	regions:   [ 'title', 'content' ],

	events: {
		'click .left':  'previousMediaItem',
		'click .right': 'nextMediaItem'
	},

	initialize: function() {
		Frame.prototype.initialize.apply( this, arguments );

		_.defaults( this.options, {
			modal: true,
			state: 'edit-attachment'
		});

		this.controller = this.options.controller;
		this.gridRouter = this.controller.gridRouter;
		this.library = this.options.library;

		if ( this.options.model ) {
			this.model = this.options.model;
		}

		this.bindHandlers();
		this.createStates();
		this.createModal();

		this.title.mode( 'default' );
		this.toggleNav();
	},

	bindHandlers: function() {
		// Bind default title creation.
		this.on( 'title:create:default', this.createTitle, this );

		this.on( 'content:create:edit-metadata', this.editMetadataMode, this );
		this.on( 'content:create:edit-image', this.editImageMode, this );
		this.on( 'content:render:edit-image', this.editImageModeRender, this );
		this.on( 'refresh', this.rerender, this );
		this.on( 'close', this.detach );

		this.bindModelHandlers();
		this.listenTo( this.gridRouter, 'route:search', this.close, this );
	},

	bindModelHandlers: function() {
		// Close the modal if the attachment is deleted.
		this.listenTo( this.model, 'change:status destroy', this.close, this );
	},

	createModal: function() {
		// Initialize modal container view.
		if ( this.options.modal ) {
			this.modal = new wp.media.view.Modal({
				controller: this,
				title:      this.options.title
			});

			this.modal.on( 'open', _.bind( function () {
				$( 'body' ).on( 'keydown.media-modal', _.bind( this.keyEvent, this ) );
			}, this ) );

			// Completely destroy the modal DOM element when closing it.
			this.modal.on( 'close', _.bind( function() {
				$( 'body' ).off( 'keydown.media-modal' ); /* remove the keydown event */
				// Restore the original focus item if possible
				$( 'li.attachment[data-id="' + this.model.get( 'id' ) +'"]' ).focus();
				this.resetRoute();
			}, this ) );

			// Set this frame as the modal's content.
			this.modal.content( this );
			this.modal.open();
		}
	},

	/**
	 * Add the default states to the frame.
	 */
	createStates: function() {
		this.states.add([
			new wp.media.controller.EditAttachmentMetadata({
				model:   this.model,
				library: this.library
			})
		]);
	},

	/**
	 * Content region rendering callback for the `edit-metadata` mode.
	 *
	 * @param {Object} contentRegion Basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 */
	editMetadataMode: function( contentRegion ) {
		contentRegion.view = new wp.media.view.Attachment.Details.TwoColumn({
			controller: this,
			model:      this.model
		});

		/**
		 * Attach a subview to display fields added via the
		 * `attachment_fields_to_edit` filter.
		 */
		contentRegion.view.views.set( '.attachment-compat', new wp.media.view.AttachmentCompat({
			controller: this,
			model:      this.model
		}) );

		// Update browser url when navigating media details, except on load.
		if ( this.model && ! this.model.get( 'skipHistory' ) ) {
			this.gridRouter.navigate( this.gridRouter.baseUrl( '?item=' + this.model.id ) );
		}
	},

	/**
	 * Render the EditImage view into the frame's content region.
	 *
	 * @param {Object} contentRegion Basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 */
	editImageMode: function( contentRegion ) {
		var editImageController = new wp.media.controller.EditImage( {
			model: this.model,
			frame: this
		} );
		// Noop some methods.
		editImageController._toolbar = function() {};
		editImageController._router = function() {};
		editImageController._menu = function() {};

		contentRegion.view = new wp.media.view.EditImage.Details( {
			model: this.model,
			frame: this,
			controller: editImageController
		} );

		this.gridRouter.navigate( this.gridRouter.baseUrl( '?item=' + this.model.id + '&mode=edit' ) );

	},

	editImageModeRender: function( view ) {
		view.on( 'ready', view.loadEditor );
	},

	toggleNav: function() {
		this.$('.left').toggleClass( 'disabled', ! this.hasPrevious() );
		this.$('.right').toggleClass( 'disabled', ! this.hasNext() );
	},

	/**
	 * Rerender the view.
	 */
	rerender: function( model ) {
		this.stopListening( this.model );

		this.model = model;

		this.bindModelHandlers();

		// Only rerender the `content` region.
		if ( this.content.mode() !== 'edit-metadata' ) {
			this.content.mode( 'edit-metadata' );
		} else {
			this.content.render();
		}

		this.toggleNav();
	},

	/**
	 * Click handler to switch to the previous media item.
	 */
	previousMediaItem: function() {
		if ( ! this.hasPrevious() ) {
			this.$( '.left' ).blur();
			return;
		}
		this.trigger( 'refresh', this.library.at( this.getCurrentIndex() - 1 ) );
		this.$( '.left' ).focus();
	},

	/**
	 * Click handler to switch to the next media item.
	 */
	nextMediaItem: function() {
		if ( ! this.hasNext() ) {
			this.$( '.right' ).blur();
			return;
		}
		this.trigger( 'refresh', this.library.at( this.getCurrentIndex() + 1 ) );
		this.$( '.right' ).focus();
	},

	getCurrentIndex: function() {
		return this.library.indexOf( this.model );
	},

	hasNext: function() {
		return ( this.getCurrentIndex() + 1 ) < this.library.length;
	},

	hasPrevious: function() {
		return ( this.getCurrentIndex() - 1 ) > -1;
	},
	/**
	 * Respond to the keyboard events: right arrow, left arrow, except when
	 * focus is in a textarea or input field.
	 */
	keyEvent: function( event ) {
		if ( ( 'INPUT' === event.target.nodeName || 'TEXTAREA' === event.target.nodeName ) && ! ( event.target.readOnly || event.target.disabled ) ) {
			return;
		}

		// The right arrow key
		if ( 39 === event.keyCode ) {
			this.nextMediaItem();
		}
		// The left arrow key
		if ( 37 === event.keyCode ) {
			this.previousMediaItem();
		}
	},

	resetRoute: function() {
		var searchTerm = this.controller.browserView.toolbar.get( 'search' ).$el.val(),
			url = '' !== searchTerm ? '?search=' + searchTerm : '';
		this.gridRouter.navigate( this.gridRouter.baseUrl( url ), { replace: true } );
	}
});

module.exports = EditAttachments;

},{}],10:[function(require,module,exports){
/**
 * wp.media.view.MediaFrame.Manage
 *
 * A generic management frame workflow.
 *
 * Used in the media grid view.
 *
 * @class
 * @augments wp.media.view.MediaFrame
 * @augments wp.media.view.Frame
 * @augments wp.media.View
 * @augments wp.Backbone.View
 * @augments Backbone.View
 * @mixes wp.media.controller.StateMachine
 */
var MediaFrame = wp.media.view.MediaFrame,
	Library = wp.media.controller.Library,

	$ = Backbone.$,
	Manage;

Manage = MediaFrame.extend({
	/**
	 * @global wp.Uploader
	 */
	initialize: function() {
		_.defaults( this.options, {
			title:     '',
			modal:     false,
			selection: [],
			library:   {}, // Options hash for the query to the media library.
			multiple:  'add',
			state:     'library',
			uploader:  true,
			mode:      [ 'grid', 'edit' ]
		});

		this.$body = $( document.body );
		this.$window = $( window );
		this.$adminBar = $( '#wpadminbar' );
		// Store the Add New button for later reuse in wp.media.view.UploaderInline.
		this.$uploaderToggler = $( '.page-title-action' )
			.attr( 'aria-expanded', 'false' )
			.on( 'click', _.bind( this.addNewClickHandler, this ) );

		this.$window.on( 'scroll resize', _.debounce( _.bind( this.fixPosition, this ), 15 ) );

		// Ensure core and media grid view UI is enabled.
		this.$el.addClass('wp-core-ui');

		// Force the uploader off if the upload limit has been exceeded or
		// if the browser isn't supported.
		if ( wp.Uploader.limitExceeded || ! wp.Uploader.browser.supported ) {
			this.options.uploader = false;
		}

		// Initialize a window-wide uploader.
		if ( this.options.uploader ) {
			this.uploader = new wp.media.view.UploaderWindow({
				controller: this,
				uploader: {
					dropzone:  document.body,
					container: document.body
				}
			}).render();
			this.uploader.ready();
			$('body').append( this.uploader.el );

			this.options.uploader = false;
		}

		this.gridRouter = new wp.media.view.MediaFrame.Manage.Router();

		// Call 'initialize' directly on the parent class.
		MediaFrame.prototype.initialize.apply( this, arguments );

		// Append the frame view directly the supplied container.
		this.$el.appendTo( this.options.container );

		this.createStates();
		this.bindRegionModeHandlers();
		this.render();
		this.bindSearchHandler();

		wp.media.frames.browse = this;
	},

	bindSearchHandler: function() {
		var search = this.$( '#media-search-input' ),
			searchView = this.browserView.toolbar.get( 'search' ).$el,
			listMode = this.$( '.view-list' ),

			input  = _.throttle( function (e) {
				var val = $( e.currentTarget ).val(),
					url = '';

				if ( val ) {
					url += '?search=' + val;
					this.gridRouter.navigate( this.gridRouter.baseUrl( url ), { replace: true } );
				}
			}, 1000 );

		// Update the URL when entering search string (at most once per second)
		search.on( 'input', _.bind( input, this ) );

		this.gridRouter
			.on( 'route:search', function () {
				var href = window.location.href;
				if ( href.indexOf( 'mode=' ) > -1 ) {
					href = href.replace( /mode=[^&]+/g, 'mode=list' );
				} else {
					href += href.indexOf( '?' ) > -1 ? '&mode=list' : '?mode=list';
				}
				href = href.replace( 'search=', 's=' );
				listMode.prop( 'href', href );
			})
			.on( 'route:reset', function() {
				searchView.val( '' ).trigger( 'input' );
			});
	},

	/**
	 * Create the default states for the frame.
	 */
	createStates: function() {
		var options = this.options;

		if ( this.options.states ) {
			return;
		}

		// Add the default states.
		this.states.add([
			new Library({
				library:            wp.media.query( options.library ),
				multiple:           options.multiple,
				title:              options.title,
				content:            'browse',
				toolbar:            'select',
				contentUserSetting: false,
				filterable:         'all',
				autoSelect:         false
			})
		]);
	},

	/**
	 * Bind region mode activation events to proper handlers.
	 */
	bindRegionModeHandlers: function() {
		this.on( 'content:create:browse', this.browseContent, this );

		// Handle a frame-level event for editing an attachment.
		this.on( 'edit:attachment', this.openEditAttachmentModal, this );

		this.on( 'select:activate', this.bindKeydown, this );
		this.on( 'select:deactivate', this.unbindKeydown, this );
	},

	handleKeydown: function( e ) {
		if ( 27 === e.which ) {
			e.preventDefault();
			this.deactivateMode( 'select' ).activateMode( 'edit' );
		}
	},

	bindKeydown: function() {
		this.$body.on( 'keydown.select', _.bind( this.handleKeydown, this ) );
	},

	unbindKeydown: function() {
		this.$body.off( 'keydown.select' );
	},

	fixPosition: function() {
		var $browser, $toolbar;
		if ( ! this.isModeActive( 'select' ) ) {
			return;
		}

		$browser = this.$('.attachments-browser');
		$toolbar = $browser.find('.media-toolbar');

		// Offset doesn't appear to take top margin into account, hence +16
		if ( ( $browser.offset().top + 16 ) < this.$window.scrollTop() + this.$adminBar.height() ) {
			$browser.addClass( 'fixed' );
			$toolbar.css('width', $browser.width() + 'px');
		} else {
			$browser.removeClass( 'fixed' );
			$toolbar.css('width', '');
		}
	},

	/**
	 * Click handler for the `Add New` button.
	 */
	addNewClickHandler: function( event ) {
		event.preventDefault();
		this.trigger( 'toggle:upload:attachment' );

		if ( this.uploader ) {
			this.uploader.refresh();
		}
	},

	/**
	 * Open the Edit Attachment modal.
	 */
	openEditAttachmentModal: function( model ) {
		// Create a new EditAttachment frame, passing along the library and the attachment model.
		if ( wp.media.frames.edit ) {
			wp.media.frames.edit.open().trigger( 'refresh', model );
		} else {
			wp.media.frames.edit = wp.media( {
				frame:       'edit-attachments',
				controller:  this,
				library:     this.state().get('library'),
				model:       model
			} );
		}
	},

	/**
	 * Create an attachments browser view within the content region.
	 *
	 * @param {Object} contentRegion Basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 * @this wp.media.controller.Region
	 */
	browseContent: function( contentRegion ) {
		var state = this.state();

		// Browse our library of attachments.
		this.browserView = contentRegion.view = new wp.media.view.AttachmentsBrowser({
			controller: this,
			collection: state.get('library'),
			selection:  state.get('selection'),
			model:      state,
			sortable:   state.get('sortable'),
			search:     state.get('searchable'),
			filters:    state.get('filterable'),
			date:       state.get('date'),
			display:    state.get('displaySettings'),
			dragInfo:   state.get('dragInfo'),
			sidebar:    'errors',

			suggestedWidth:  state.get('suggestedWidth'),
			suggestedHeight: state.get('suggestedHeight'),

			AttachmentView: state.get('AttachmentView'),

			scrollElement: document
		});
		this.browserView.on( 'ready', _.bind( this.bindDeferred, this ) );

		this.errors = wp.Uploader.errors;
		this.errors.on( 'add remove reset', this.sidebarVisibility, this );
	},

	sidebarVisibility: function() {
		this.browserView.$( '.media-sidebar' ).toggle( !! this.errors.length );
	},

	bindDeferred: function() {
		if ( ! this.browserView.dfd ) {
			return;
		}
		this.browserView.dfd.done( _.bind( this.startHistory, this ) );
	},

	startHistory: function() {
		// Verify pushState support and activate
		if ( window.history && window.history.pushState ) {
			if ( Backbone.History.started ) {
				Backbone.history.stop();
			}
			Backbone.history.start( {
				root: window._wpMediaGridSettings.adminUrl,
				pushState: true
			} );
		}
	}
});

module.exports = Manage;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvY29udHJvbGxlcnMvZWRpdC1hdHRhY2htZW50LW1ldGFkYXRhLmpzIiwic3JjL3dwLWluY2x1ZGVzL2pzL21lZGlhL2dyaWQubWFuaWZlc3QuanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvcm91dGVycy9tYW5hZ2UuanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvdmlld3MvYXR0YWNobWVudC9kZXRhaWxzLXR3by1jb2x1bW4uanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvdmlld3MvYnV0dG9uL2RlbGV0ZS1zZWxlY3RlZC1wZXJtYW5lbnRseS5qcyIsInNyYy93cC1pbmNsdWRlcy9qcy9tZWRpYS92aWV3cy9idXR0b24vZGVsZXRlLXNlbGVjdGVkLmpzIiwic3JjL3dwLWluY2x1ZGVzL2pzL21lZGlhL3ZpZXdzL2J1dHRvbi9zZWxlY3QtbW9kZS10b2dnbGUuanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvdmlld3MvZWRpdC1pbWFnZS1kZXRhaWxzLmpzIiwic3JjL3dwLWluY2x1ZGVzL2pzL21lZGlhL3ZpZXdzL2ZyYW1lL2VkaXQtYXR0YWNobWVudHMuanMiLCJzcmMvd3AtaW5jbHVkZXMvanMvbWVkaWEvdmlld3MvZnJhbWUvbWFuYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogd3AubWVkaWEuY29udHJvbGxlci5FZGl0QXR0YWNobWVudE1ldGFkYXRhXG4gKlxuICogQSBzdGF0ZSBmb3IgZWRpdGluZyBhbiBhdHRhY2htZW50J3MgbWV0YWRhdGEuXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEuY29udHJvbGxlci5TdGF0ZVxuICogQGF1Z21lbnRzIEJhY2tib25lLk1vZGVsXG4gKi9cbnZhciBsMTBuID0gd3AubWVkaWEudmlldy5sMTBuLFxuXHRFZGl0QXR0YWNobWVudE1ldGFkYXRhO1xuXG5FZGl0QXR0YWNobWVudE1ldGFkYXRhID0gd3AubWVkaWEuY29udHJvbGxlci5TdGF0ZS5leHRlbmQoe1xuXHRkZWZhdWx0czoge1xuXHRcdGlkOiAgICAgICdlZGl0LWF0dGFjaG1lbnQnLFxuXHRcdC8vIFRpdGxlIHN0cmluZyBwYXNzZWQgdG8gdGhlIGZyYW1lJ3MgdGl0bGUgcmVnaW9uIHZpZXcuXG5cdFx0dGl0bGU6ICAgbDEwbi5hdHRhY2htZW50RGV0YWlscyxcblx0XHQvLyBSZWdpb24gbW9kZSBkZWZhdWx0cy5cblx0XHRjb250ZW50OiAnZWRpdC1tZXRhZGF0YScsXG5cdFx0bWVudTogICAgZmFsc2UsXG5cdFx0dG9vbGJhcjogZmFsc2UsXG5cdFx0cm91dGVyOiAgZmFsc2Vcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdEF0dGFjaG1lbnRNZXRhZGF0YTtcbiIsInZhciBtZWRpYSA9IHdwLm1lZGlhO1xuXG5tZWRpYS5jb250cm9sbGVyLkVkaXRBdHRhY2htZW50TWV0YWRhdGEgPSByZXF1aXJlKCAnLi9jb250cm9sbGVycy9lZGl0LWF0dGFjaG1lbnQtbWV0YWRhdGEuanMnICk7XG5tZWRpYS52aWV3Lk1lZGlhRnJhbWUuTWFuYWdlID0gcmVxdWlyZSggJy4vdmlld3MvZnJhbWUvbWFuYWdlLmpzJyApO1xubWVkaWEudmlldy5BdHRhY2htZW50LkRldGFpbHMuVHdvQ29sdW1uID0gcmVxdWlyZSggJy4vdmlld3MvYXR0YWNobWVudC9kZXRhaWxzLXR3by1jb2x1bW4uanMnICk7XG5tZWRpYS52aWV3Lk1lZGlhRnJhbWUuTWFuYWdlLlJvdXRlciA9IHJlcXVpcmUoICcuL3JvdXRlcnMvbWFuYWdlLmpzJyApO1xubWVkaWEudmlldy5FZGl0SW1hZ2UuRGV0YWlscyA9IHJlcXVpcmUoICcuL3ZpZXdzL2VkaXQtaW1hZ2UtZGV0YWlscy5qcycgKTtcbm1lZGlhLnZpZXcuTWVkaWFGcmFtZS5FZGl0QXR0YWNobWVudHMgPSByZXF1aXJlKCAnLi92aWV3cy9mcmFtZS9lZGl0LWF0dGFjaG1lbnRzLmpzJyApO1xubWVkaWEudmlldy5TZWxlY3RNb2RlVG9nZ2xlQnV0dG9uID0gcmVxdWlyZSggJy4vdmlld3MvYnV0dG9uL3NlbGVjdC1tb2RlLXRvZ2dsZS5qcycgKTtcbm1lZGlhLnZpZXcuRGVsZXRlU2VsZWN0ZWRCdXR0b24gPSByZXF1aXJlKCAnLi92aWV3cy9idXR0b24vZGVsZXRlLXNlbGVjdGVkLmpzJyApO1xubWVkaWEudmlldy5EZWxldGVTZWxlY3RlZFBlcm1hbmVudGx5QnV0dG9uID0gcmVxdWlyZSggJy4vdmlld3MvYnV0dG9uL2RlbGV0ZS1zZWxlY3RlZC1wZXJtYW5lbnRseS5qcycgKTtcbiIsIi8qKlxuICogd3AubWVkaWEudmlldy5NZWRpYUZyYW1lLk1hbmFnZS5Sb3V0ZXJcbiAqXG4gKiBBIHJvdXRlciBmb3IgaGFuZGxpbmcgdGhlIGJyb3dzZXIgaGlzdG9yeSBhbmQgYXBwbGljYXRpb24gc3RhdGUuXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgQmFja2JvbmUuUm91dGVyXG4gKi9cbnZhciBSb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcblx0cm91dGVzOiB7XG5cdFx0J3VwbG9hZC5waHA/aXRlbT06c2x1ZyZtb2RlPWVkaXQnOiAnZWRpdEl0ZW0nLFxuXHRcdCd1cGxvYWQucGhwP2l0ZW09OnNsdWcnOiAgICAgICAgICAgJ3Nob3dJdGVtJyxcblx0XHQndXBsb2FkLnBocD9zZWFyY2g9OnF1ZXJ5JzogICAgICAgICdzZWFyY2gnLFxuXHRcdCd1cGxvYWQucGhwJzogICAgICAgICAgICAgICAgICAgICAgJ3Jlc2V0J1xuXHR9LFxuXG5cdC8vIE1hcCByb3V0ZXMgYWdhaW5zdCB0aGUgcGFnZSBVUkxcblx0YmFzZVVybDogZnVuY3Rpb24oIHVybCApIHtcblx0XHRyZXR1cm4gJ3VwbG9hZC5waHAnICsgdXJsO1xuXHR9LFxuXG5cdHJlc2V0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZnJhbWUgPSB3cC5tZWRpYS5mcmFtZXMuZWRpdDtcblxuXHRcdGlmICggZnJhbWUgKSB7XG5cdFx0XHRmcmFtZS5jbG9zZSgpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBSZXNwb25kIHRvIHRoZSBzZWFyY2ggcm91dGUgYnkgZmlsbGluZyB0aGUgc2VhcmNoIGZpZWxkIGFuZCB0cmlnZ2dlcmluZyB0aGUgaW5wdXQgZXZlbnRcblx0c2VhcmNoOiBmdW5jdGlvbiggcXVlcnkgKSB7XG5cdFx0alF1ZXJ5KCAnI21lZGlhLXNlYXJjaC1pbnB1dCcgKS52YWwoIHF1ZXJ5ICkudHJpZ2dlciggJ2lucHV0JyApO1xuXHR9LFxuXG5cdC8vIFNob3cgdGhlIG1vZGFsIHdpdGggYSBzcGVjaWZpYyBpdGVtXG5cdHNob3dJdGVtOiBmdW5jdGlvbiggcXVlcnkgKSB7XG5cdFx0dmFyIG1lZGlhID0gd3AubWVkaWEsXG5cdFx0XHRmcmFtZSA9IG1lZGlhLmZyYW1lcy5icm93c2UsXG5cdFx0XHRsaWJyYXJ5ID0gZnJhbWUuc3RhdGUoKS5nZXQoJ2xpYnJhcnknKSxcblx0XHRcdGl0ZW07XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBtZWRpYSBmcmFtZSB0byBvcGVuIHRoZSBjb3JyZWN0IGl0ZW1cblx0XHRpdGVtID0gbGlicmFyeS5maW5kV2hlcmUoIHsgaWQ6IHBhcnNlSW50KCBxdWVyeSwgMTAgKSB9ICk7XG5cdFx0aXRlbS5zZXQoICdza2lwSGlzdG9yeScsIHRydWUgKTtcblxuXHRcdGlmICggaXRlbSApIHtcblx0XHRcdGZyYW1lLnRyaWdnZXIoICdlZGl0OmF0dGFjaG1lbnQnLCBpdGVtICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGl0ZW0gPSBtZWRpYS5hdHRhY2htZW50KCBxdWVyeSApO1xuXHRcdFx0ZnJhbWUubGlzdGVuVG8oIGl0ZW0sICdjaGFuZ2UnLCBmdW5jdGlvbiggbW9kZWwgKSB7XG5cdFx0XHRcdGZyYW1lLnN0b3BMaXN0ZW5pbmcoIGl0ZW0gKTtcblx0XHRcdFx0ZnJhbWUudHJpZ2dlciggJ2VkaXQ6YXR0YWNobWVudCcsIG1vZGVsICk7XG5cdFx0XHR9ICk7XG5cdFx0XHRpdGVtLmZldGNoKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFNob3cgdGhlIG1vZGFsIGluIGVkaXQgbW9kZSB3aXRoIGEgc3BlY2lmaWMgaXRlbS5cblx0ZWRpdEl0ZW06IGZ1bmN0aW9uKCBxdWVyeSApIHtcblx0XHR0aGlzLnNob3dJdGVtKCBxdWVyeSApO1xuXHRcdHdwLm1lZGlhLmZyYW1lcy5lZGl0LmNvbnRlbnQubW9kZSggJ2VkaXQtZGV0YWlscycgKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUm91dGVyO1xuIiwiLyoqXG4gKiB3cC5tZWRpYS52aWV3LkF0dGFjaG1lbnQuRGV0YWlscy5Ud29Db2x1bW5cbiAqXG4gKiBBIHNpbWlsYXIgdmlldyB0byBtZWRpYS52aWV3LkF0dGFjaG1lbnQuRGV0YWlsc1xuICogZm9yIHVzZSBpbiB0aGUgRWRpdCBBdHRhY2htZW50IG1vZGFsLlxuICpcbiAqIEBjbGFzc1xuICogQGF1Z21lbnRzIHdwLm1lZGlhLnZpZXcuQXR0YWNobWVudC5EZXRhaWxzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5BdHRhY2htZW50XG4gKiBAYXVnbWVudHMgd3AubWVkaWEuVmlld1xuICogQGF1Z21lbnRzIHdwLkJhY2tib25lLlZpZXdcbiAqIEBhdWdtZW50cyBCYWNrYm9uZS5WaWV3XG4gKi9cbnZhciBEZXRhaWxzID0gd3AubWVkaWEudmlldy5BdHRhY2htZW50LkRldGFpbHMsXG5cdFR3b0NvbHVtbjtcblxuVHdvQ29sdW1uID0gRGV0YWlscy5leHRlbmQoe1xuXHR0ZW1wbGF0ZTogd3AudGVtcGxhdGUoICdhdHRhY2htZW50LWRldGFpbHMtdHdvLWNvbHVtbicgKSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNvbnRyb2xsZXIub24oICdjb250ZW50OmFjdGl2YXRlOmVkaXQtZGV0YWlscycsIF8uYmluZCggdGhpcy5lZGl0QXR0YWNobWVudCwgdGhpcyApICk7XG5cblx0XHREZXRhaWxzLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0fSxcblxuXHRlZGl0QXR0YWNobWVudDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0XHR0aGlzLmNvbnRyb2xsZXIuY29udGVudC5tb2RlKCAnZWRpdC1pbWFnZScgKTtcblx0fSxcblxuXHQvKipcblx0ICogTm9vcCB0aGlzIGZyb20gcGFyZW50IGNsYXNzLCBkb2Vzbid0IGFwcGx5IGhlcmUuXG5cdCAqL1xuXHR0b2dnbGVTZWxlY3Rpb25IYW5kbGVyOiBmdW5jdGlvbigpIHt9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0RGV0YWlscy5wcm90b3R5cGUucmVuZGVyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdHdwLm1lZGlhLm1peGluLnJlbW92ZUFsbFBsYXllcnMoKTtcblx0XHR0aGlzLiQoICdhdWRpbywgdmlkZW8nICkuZWFjaCggZnVuY3Rpb24gKGksIGVsZW0pIHtcblx0XHRcdHZhciBlbCA9IHdwLm1lZGlhLnZpZXcuTWVkaWFEZXRhaWxzLnByZXBhcmVTcmMoIGVsZW0gKTtcblx0XHRcdG5ldyB3aW5kb3cuTWVkaWFFbGVtZW50UGxheWVyKCBlbCwgd3AubWVkaWEubWl4aW4ubWVqc1NldHRpbmdzICk7XG5cdFx0fSApO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUd29Db2x1bW47XG4iLCIvKipcbiAqIHdwLm1lZGlhLnZpZXcuRGVsZXRlU2VsZWN0ZWRQZXJtYW5lbnRseUJ1dHRvblxuICpcbiAqIFdoZW4gTUVESUFfVFJBU0ggaXMgdHJ1ZSwgYSBidXR0b24gdGhhdCBoYW5kbGVzIGJ1bGsgRGVsZXRlIFBlcm1hbmVudGx5IGxvZ2ljXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5EZWxldGVTZWxlY3RlZEJ1dHRvblxuICogQGF1Z21lbnRzIHdwLm1lZGlhLnZpZXcuQnV0dG9uXG4gKiBAYXVnbWVudHMgd3AubWVkaWEuVmlld1xuICogQGF1Z21lbnRzIHdwLkJhY2tib25lLlZpZXdcbiAqIEBhdWdtZW50cyBCYWNrYm9uZS5WaWV3XG4gKi9cbnZhciBCdXR0b24gPSB3cC5tZWRpYS52aWV3LkJ1dHRvbixcblx0RGVsZXRlU2VsZWN0ZWQgPSB3cC5tZWRpYS52aWV3LkRlbGV0ZVNlbGVjdGVkQnV0dG9uLFxuXHREZWxldGVTZWxlY3RlZFBlcm1hbmVudGx5O1xuXG5EZWxldGVTZWxlY3RlZFBlcm1hbmVudGx5ID0gRGVsZXRlU2VsZWN0ZWQuZXh0ZW5kKHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG5cdFx0RGVsZXRlU2VsZWN0ZWQucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdHRoaXMuY29udHJvbGxlci5vbiggJ3NlbGVjdDphY3RpdmF0ZScsIHRoaXMuc2VsZWN0QWN0aXZhdGUsIHRoaXMgKTtcblx0XHR0aGlzLmNvbnRyb2xsZXIub24oICdzZWxlY3Q6ZGVhY3RpdmF0ZScsIHRoaXMuc2VsZWN0RGVhY3RpdmF0ZSwgdGhpcyApO1xuXHR9LFxuXG5cdGZpbHRlckNoYW5nZTogZnVuY3Rpb24oIG1vZGVsICkge1xuXHRcdHRoaXMuY2FuU2hvdyA9ICggJ3RyYXNoJyA9PT0gbW9kZWwuZ2V0KCAnc3RhdHVzJyApICk7XG5cdH0sXG5cblx0c2VsZWN0QWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudG9nZ2xlRGlzYWJsZWQoKTtcblx0XHR0aGlzLiRlbC50b2dnbGVDbGFzcyggJ2hpZGRlbicsICEgdGhpcy5jYW5TaG93ICk7XG5cdH0sXG5cblx0c2VsZWN0RGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50b2dnbGVEaXNhYmxlZCgpO1xuXHRcdHRoaXMuJGVsLmFkZENsYXNzKCAnaGlkZGVuJyApO1xuXHR9LFxuXG5cdHJlbmRlcjogZnVuY3Rpb24oKSB7XG5cdFx0QnV0dG9uLnByb3RvdHlwZS5yZW5kZXIuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdHRoaXMuc2VsZWN0QWN0aXZhdGUoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlU2VsZWN0ZWRQZXJtYW5lbnRseTtcbiIsIi8qKlxuICogd3AubWVkaWEudmlldy5EZWxldGVTZWxlY3RlZEJ1dHRvblxuICpcbiAqIEEgYnV0dG9uIHRoYXQgaGFuZGxlcyBidWxrIERlbGV0ZS9UcmFzaCBsb2dpY1xuICpcbiAqIEBjbGFzc1xuICogQGF1Z21lbnRzIHdwLm1lZGlhLnZpZXcuQnV0dG9uXG4gKiBAYXVnbWVudHMgd3AubWVkaWEuVmlld1xuICogQGF1Z21lbnRzIHdwLkJhY2tib25lLlZpZXdcbiAqIEBhdWdtZW50cyBCYWNrYm9uZS5WaWV3XG4gKi9cbnZhciBCdXR0b24gPSB3cC5tZWRpYS52aWV3LkJ1dHRvbixcblx0bDEwbiA9IHdwLm1lZGlhLnZpZXcubDEwbixcblx0RGVsZXRlU2VsZWN0ZWQ7XG5cbkRlbGV0ZVNlbGVjdGVkID0gQnV0dG9uLmV4dGVuZCh7XG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdEJ1dHRvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0aWYgKCB0aGlzLm9wdGlvbnMuZmlsdGVycyApIHtcblx0XHRcdHRoaXMub3B0aW9ucy5maWx0ZXJzLm1vZGVsLm9uKCAnY2hhbmdlJywgdGhpcy5maWx0ZXJDaGFuZ2UsIHRoaXMgKTtcblx0XHR9XG5cdFx0dGhpcy5jb250cm9sbGVyLm9uKCAnc2VsZWN0aW9uOnRvZ2dsZScsIHRoaXMudG9nZ2xlRGlzYWJsZWQsIHRoaXMgKTtcblx0fSxcblxuXHRmaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKCBtb2RlbCApIHtcblx0XHRpZiAoICd0cmFzaCcgPT09IG1vZGVsLmdldCggJ3N0YXR1cycgKSApIHtcblx0XHRcdHRoaXMubW9kZWwuc2V0KCAndGV4dCcsIGwxMG4udW50cmFzaFNlbGVjdGVkICk7XG5cdFx0fSBlbHNlIGlmICggd3AubWVkaWEudmlldy5zZXR0aW5ncy5tZWRpYVRyYXNoICkge1xuXHRcdFx0dGhpcy5tb2RlbC5zZXQoICd0ZXh0JywgbDEwbi50cmFzaFNlbGVjdGVkICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubW9kZWwuc2V0KCAndGV4dCcsIGwxMG4uZGVsZXRlU2VsZWN0ZWQgKTtcblx0XHR9XG5cdH0sXG5cblx0dG9nZ2xlRGlzYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMubW9kZWwuc2V0KCAnZGlzYWJsZWQnLCAhIHRoaXMuY29udHJvbGxlci5zdGF0ZSgpLmdldCggJ3NlbGVjdGlvbicgKS5sZW5ndGggKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdEJ1dHRvbi5wcm90b3R5cGUucmVuZGVyLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0XHRpZiAoIHRoaXMuY29udHJvbGxlci5pc01vZGVBY3RpdmUoICdzZWxlY3QnICkgKSB7XG5cdFx0XHR0aGlzLiRlbC5hZGRDbGFzcyggJ2RlbGV0ZS1zZWxlY3RlZC1idXR0b24nICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuJGVsLmFkZENsYXNzKCAnZGVsZXRlLXNlbGVjdGVkLWJ1dHRvbiBoaWRkZW4nICk7XG5cdFx0fVxuXHRcdHRoaXMudG9nZ2xlRGlzYWJsZWQoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVsZXRlU2VsZWN0ZWQ7XG4iLCIvKipcbiAqIHdwLm1lZGlhLnZpZXcuU2VsZWN0TW9kZVRvZ2dsZUJ1dHRvblxuICpcbiAqIEBjbGFzc1xuICogQGF1Z21lbnRzIHdwLm1lZGlhLnZpZXcuQnV0dG9uXG4gKiBAYXVnbWVudHMgd3AubWVkaWEuVmlld1xuICogQGF1Z21lbnRzIHdwLkJhY2tib25lLlZpZXdcbiAqIEBhdWdtZW50cyBCYWNrYm9uZS5WaWV3XG4gKi9cbnZhciBCdXR0b24gPSB3cC5tZWRpYS52aWV3LkJ1dHRvbixcblx0bDEwbiA9IHdwLm1lZGlhLnZpZXcubDEwbixcblx0U2VsZWN0TW9kZVRvZ2dsZTtcblxuU2VsZWN0TW9kZVRvZ2dsZSA9IEJ1dHRvbi5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHRfLmRlZmF1bHRzKCB0aGlzLm9wdGlvbnMsIHtcblx0XHRcdHNpemUgOiAnJ1xuXHRcdH0gKTtcblxuXHRcdEJ1dHRvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0dGhpcy5jb250cm9sbGVyLm9uKCAnc2VsZWN0OmFjdGl2YXRlIHNlbGVjdDpkZWFjdGl2YXRlJywgdGhpcy50b2dnbGVCdWxrRWRpdEhhbmRsZXIsIHRoaXMgKTtcblx0XHR0aGlzLmNvbnRyb2xsZXIub24oICdzZWxlY3Rpb246YWN0aW9uOmRvbmUnLCB0aGlzLmJhY2ssIHRoaXMgKTtcblx0fSxcblxuXHRiYWNrOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5jb250cm9sbGVyLmRlYWN0aXZhdGVNb2RlKCAnc2VsZWN0JyApLmFjdGl2YXRlTW9kZSggJ2VkaXQnICk7XG5cdH0sXG5cblx0Y2xpY2s6IGZ1bmN0aW9uKCkge1xuXHRcdEJ1dHRvbi5wcm90b3R5cGUuY2xpY2suYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdGlmICggdGhpcy5jb250cm9sbGVyLmlzTW9kZUFjdGl2ZSggJ3NlbGVjdCcgKSApIHtcblx0XHRcdHRoaXMuYmFjaygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNvbnRyb2xsZXIuZGVhY3RpdmF0ZU1vZGUoICdlZGl0JyApLmFjdGl2YXRlTW9kZSggJ3NlbGVjdCcgKTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRCdXR0b24ucHJvdG90eXBlLnJlbmRlci5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0dGhpcy4kZWwuYWRkQ2xhc3MoICdzZWxlY3QtbW9kZS10b2dnbGUtYnV0dG9uJyApO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdHRvZ2dsZUJ1bGtFZGl0SGFuZGxlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRvb2xiYXIgPSB0aGlzLmNvbnRyb2xsZXIuY29udGVudC5nZXQoKS50b29sYmFyLCBjaGlsZHJlbjtcblxuXHRcdGNoaWxkcmVuID0gdG9vbGJhci4kKCAnLm1lZGlhLXRvb2xiYXItc2Vjb25kYXJ5ID4gKiwgLm1lZGlhLXRvb2xiYXItcHJpbWFyeSA+IConICk7XG5cblx0XHQvLyBUT0RPOiB0aGUgRnJhbWUgc2hvdWxkIGJlIGRvaW5nIGFsbCBvZiB0aGlzLlxuXHRcdGlmICggdGhpcy5jb250cm9sbGVyLmlzTW9kZUFjdGl2ZSggJ3NlbGVjdCcgKSApIHtcblx0XHRcdHRoaXMubW9kZWwuc2V0KCB7XG5cdFx0XHRcdHNpemU6ICdsYXJnZScsXG5cdFx0XHRcdHRleHQ6IGwxMG4uY2FuY2VsU2VsZWN0aW9uXG5cdFx0XHR9ICk7XG5cdFx0XHRjaGlsZHJlbi5ub3QoICcuc3Bpbm5lciwgLm1lZGlhLWJ1dHRvbicgKS5oaWRlKCk7XG5cdFx0XHR0aGlzLiRlbC5zaG93KCk7XG5cdFx0XHR0b29sYmFyLiQoICcuZGVsZXRlLXNlbGVjdGVkLWJ1dHRvbicgKS5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5tb2RlbC5zZXQoIHtcblx0XHRcdFx0c2l6ZTogJycsXG5cdFx0XHRcdHRleHQ6IGwxMG4uYnVsa1NlbGVjdFxuXHRcdFx0fSApO1xuXHRcdFx0dGhpcy5jb250cm9sbGVyLmNvbnRlbnQuZ2V0KCkuJGVsLnJlbW92ZUNsYXNzKCAnZml4ZWQnICk7XG5cdFx0XHR0b29sYmFyLiRlbC5jc3MoICd3aWR0aCcsICcnICk7XG5cdFx0XHR0b29sYmFyLiQoICcuZGVsZXRlLXNlbGVjdGVkLWJ1dHRvbicgKS5hZGRDbGFzcyggJ2hpZGRlbicgKTtcblx0XHRcdGNoaWxkcmVuLm5vdCggJy5tZWRpYS1idXR0b24nICkuc2hvdygpO1xuXHRcdFx0dGhpcy5jb250cm9sbGVyLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLnJlc2V0KCk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RNb2RlVG9nZ2xlO1xuIiwiLyoqXG4gKiB3cC5tZWRpYS52aWV3LkVkaXRJbWFnZS5EZXRhaWxzXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5FZGl0SW1hZ2VcbiAqIEBhdWdtZW50cyB3cC5tZWRpYS5WaWV3XG4gKiBAYXVnbWVudHMgd3AuQmFja2JvbmUuVmlld1xuICogQGF1Z21lbnRzIEJhY2tib25lLlZpZXdcbiAqL1xudmFyIFZpZXcgPSB3cC5tZWRpYS5WaWV3LFxuXHRFZGl0SW1hZ2UgPSB3cC5tZWRpYS52aWV3LkVkaXRJbWFnZSxcblx0RGV0YWlscztcblxuRGV0YWlscyA9IEVkaXRJbWFnZS5leHRlbmQoe1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHR0aGlzLmVkaXRvciA9IHdpbmRvdy5pbWFnZUVkaXQ7XG5cdFx0dGhpcy5mcmFtZSA9IG9wdGlvbnMuZnJhbWU7XG5cdFx0dGhpcy5jb250cm9sbGVyID0gb3B0aW9ucy5jb250cm9sbGVyO1xuXHRcdFZpZXcucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHR9LFxuXG5cdGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZnJhbWUuY29udGVudC5tb2RlKCAnZWRpdC1tZXRhZGF0YScgKTtcblx0fSxcblxuXHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm1vZGVsLmZldGNoKCkuZG9uZSggXy5iaW5kKCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZnJhbWUuY29udGVudC5tb2RlKCAnZWRpdC1tZXRhZGF0YScgKTtcblx0XHR9LCB0aGlzICkgKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0YWlscztcbiIsIi8qKlxuICogd3AubWVkaWEudmlldy5NZWRpYUZyYW1lLkVkaXRBdHRhY2htZW50c1xuICpcbiAqIEEgZnJhbWUgZm9yIGVkaXRpbmcgdGhlIGRldGFpbHMgb2YgYSBzcGVjaWZpYyBtZWRpYSBpdGVtLlxuICpcbiAqIE9wZW5zIGluIGEgbW9kYWwgYnkgZGVmYXVsdC5cbiAqXG4gKiBSZXF1aXJlcyBhbiBhdHRhY2htZW50IG1vZGVsIHRvIGJlIHBhc3NlZCBpbiB0aGUgb3B0aW9ucyBoYXNoIHVuZGVyIGBtb2RlbGAuXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5GcmFtZVxuICogQGF1Z21lbnRzIHdwLm1lZGlhLlZpZXdcbiAqIEBhdWdtZW50cyB3cC5CYWNrYm9uZS5WaWV3XG4gKiBAYXVnbWVudHMgQmFja2JvbmUuVmlld1xuICogQG1peGVzIHdwLm1lZGlhLmNvbnRyb2xsZXIuU3RhdGVNYWNoaW5lXG4gKi9cbnZhciBGcmFtZSA9IHdwLm1lZGlhLnZpZXcuRnJhbWUsXG5cdE1lZGlhRnJhbWUgPSB3cC5tZWRpYS52aWV3Lk1lZGlhRnJhbWUsXG5cblx0JCA9IGpRdWVyeSxcblx0RWRpdEF0dGFjaG1lbnRzO1xuXG5FZGl0QXR0YWNobWVudHMgPSBNZWRpYUZyYW1lLmV4dGVuZCh7XG5cblx0Y2xhc3NOYW1lOiAnZWRpdC1hdHRhY2htZW50LWZyYW1lJyxcblx0dGVtcGxhdGU6ICB3cC50ZW1wbGF0ZSggJ2VkaXQtYXR0YWNobWVudC1mcmFtZScgKSxcblx0cmVnaW9uczogICBbICd0aXRsZScsICdjb250ZW50JyBdLFxuXG5cdGV2ZW50czoge1xuXHRcdCdjbGljayAubGVmdCc6ICAncHJldmlvdXNNZWRpYUl0ZW0nLFxuXHRcdCdjbGljayAucmlnaHQnOiAnbmV4dE1lZGlhSXRlbSdcblx0fSxcblxuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcblx0XHRGcmFtZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHRfLmRlZmF1bHRzKCB0aGlzLm9wdGlvbnMsIHtcblx0XHRcdG1vZGFsOiB0cnVlLFxuXHRcdFx0c3RhdGU6ICdlZGl0LWF0dGFjaG1lbnQnXG5cdFx0fSk7XG5cblx0XHR0aGlzLmNvbnRyb2xsZXIgPSB0aGlzLm9wdGlvbnMuY29udHJvbGxlcjtcblx0XHR0aGlzLmdyaWRSb3V0ZXIgPSB0aGlzLmNvbnRyb2xsZXIuZ3JpZFJvdXRlcjtcblx0XHR0aGlzLmxpYnJhcnkgPSB0aGlzLm9wdGlvbnMubGlicmFyeTtcblxuXHRcdGlmICggdGhpcy5vcHRpb25zLm1vZGVsICkge1xuXHRcdFx0dGhpcy5tb2RlbCA9IHRoaXMub3B0aW9ucy5tb2RlbDtcblx0XHR9XG5cblx0XHR0aGlzLmJpbmRIYW5kbGVycygpO1xuXHRcdHRoaXMuY3JlYXRlU3RhdGVzKCk7XG5cdFx0dGhpcy5jcmVhdGVNb2RhbCgpO1xuXG5cdFx0dGhpcy50aXRsZS5tb2RlKCAnZGVmYXVsdCcgKTtcblx0XHR0aGlzLnRvZ2dsZU5hdigpO1xuXHR9LFxuXG5cdGJpbmRIYW5kbGVyczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmluZCBkZWZhdWx0IHRpdGxlIGNyZWF0aW9uLlxuXHRcdHRoaXMub24oICd0aXRsZTpjcmVhdGU6ZGVmYXVsdCcsIHRoaXMuY3JlYXRlVGl0bGUsIHRoaXMgKTtcblxuXHRcdHRoaXMub24oICdjb250ZW50OmNyZWF0ZTplZGl0LW1ldGFkYXRhJywgdGhpcy5lZGl0TWV0YWRhdGFNb2RlLCB0aGlzICk7XG5cdFx0dGhpcy5vbiggJ2NvbnRlbnQ6Y3JlYXRlOmVkaXQtaW1hZ2UnLCB0aGlzLmVkaXRJbWFnZU1vZGUsIHRoaXMgKTtcblx0XHR0aGlzLm9uKCAnY29udGVudDpyZW5kZXI6ZWRpdC1pbWFnZScsIHRoaXMuZWRpdEltYWdlTW9kZVJlbmRlciwgdGhpcyApO1xuXHRcdHRoaXMub24oICdyZWZyZXNoJywgdGhpcy5yZXJlbmRlciwgdGhpcyApO1xuXHRcdHRoaXMub24oICdjbG9zZScsIHRoaXMuZGV0YWNoICk7XG5cblx0XHR0aGlzLmJpbmRNb2RlbEhhbmRsZXJzKCk7XG5cdFx0dGhpcy5saXN0ZW5UbyggdGhpcy5ncmlkUm91dGVyLCAncm91dGU6c2VhcmNoJywgdGhpcy5jbG9zZSwgdGhpcyApO1xuXHR9LFxuXG5cdGJpbmRNb2RlbEhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHQvLyBDbG9zZSB0aGUgbW9kYWwgaWYgdGhlIGF0dGFjaG1lbnQgaXMgZGVsZXRlZC5cblx0XHR0aGlzLmxpc3RlblRvKCB0aGlzLm1vZGVsLCAnY2hhbmdlOnN0YXR1cyBkZXN0cm95JywgdGhpcy5jbG9zZSwgdGhpcyApO1xuXHR9LFxuXG5cdGNyZWF0ZU1vZGFsOiBmdW5jdGlvbigpIHtcblx0XHQvLyBJbml0aWFsaXplIG1vZGFsIGNvbnRhaW5lciB2aWV3LlxuXHRcdGlmICggdGhpcy5vcHRpb25zLm1vZGFsICkge1xuXHRcdFx0dGhpcy5tb2RhbCA9IG5ldyB3cC5tZWRpYS52aWV3Lk1vZGFsKHtcblx0XHRcdFx0Y29udHJvbGxlcjogdGhpcyxcblx0XHRcdFx0dGl0bGU6ICAgICAgdGhpcy5vcHRpb25zLnRpdGxlXG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5tb2RhbC5vbiggJ29wZW4nLCBfLmJpbmQoIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JCggJ2JvZHknICkub24oICdrZXlkb3duLm1lZGlhLW1vZGFsJywgXy5iaW5kKCB0aGlzLmtleUV2ZW50LCB0aGlzICkgKTtcblx0XHRcdH0sIHRoaXMgKSApO1xuXG5cdFx0XHQvLyBDb21wbGV0ZWx5IGRlc3Ryb3kgdGhlIG1vZGFsIERPTSBlbGVtZW50IHdoZW4gY2xvc2luZyBpdC5cblx0XHRcdHRoaXMubW9kYWwub24oICdjbG9zZScsIF8uYmluZCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoICdib2R5JyApLm9mZiggJ2tleWRvd24ubWVkaWEtbW9kYWwnICk7IC8qIHJlbW92ZSB0aGUga2V5ZG93biBldmVudCAqL1xuXHRcdFx0XHQvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBmb2N1cyBpdGVtIGlmIHBvc3NpYmxlXG5cdFx0XHRcdCQoICdsaS5hdHRhY2htZW50W2RhdGEtaWQ9XCInICsgdGhpcy5tb2RlbC5nZXQoICdpZCcgKSArJ1wiXScgKS5mb2N1cygpO1xuXHRcdFx0XHR0aGlzLnJlc2V0Um91dGUoKTtcblx0XHRcdH0sIHRoaXMgKSApO1xuXG5cdFx0XHQvLyBTZXQgdGhpcyBmcmFtZSBhcyB0aGUgbW9kYWwncyBjb250ZW50LlxuXHRcdFx0dGhpcy5tb2RhbC5jb250ZW50KCB0aGlzICk7XG5cdFx0XHR0aGlzLm1vZGFsLm9wZW4oKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCB0aGUgZGVmYXVsdCBzdGF0ZXMgdG8gdGhlIGZyYW1lLlxuXHQgKi9cblx0Y3JlYXRlU3RhdGVzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlcy5hZGQoW1xuXHRcdFx0bmV3IHdwLm1lZGlhLmNvbnRyb2xsZXIuRWRpdEF0dGFjaG1lbnRNZXRhZGF0YSh7XG5cdFx0XHRcdG1vZGVsOiAgIHRoaXMubW9kZWwsXG5cdFx0XHRcdGxpYnJhcnk6IHRoaXMubGlicmFyeVxuXHRcdFx0fSlcblx0XHRdKTtcblx0fSxcblxuXHQvKipcblx0ICogQ29udGVudCByZWdpb24gcmVuZGVyaW5nIGNhbGxiYWNrIGZvciB0aGUgYGVkaXQtbWV0YWRhdGFgIG1vZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50UmVnaW9uIEJhc2ljIG9iamVjdCB3aXRoIGEgYHZpZXdgIHByb3BlcnR5LCB3aGljaFxuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGQgYmUgc2V0IHdpdGggdGhlIHByb3BlciByZWdpb24gdmlldy5cblx0ICovXG5cdGVkaXRNZXRhZGF0YU1vZGU6IGZ1bmN0aW9uKCBjb250ZW50UmVnaW9uICkge1xuXHRcdGNvbnRlbnRSZWdpb24udmlldyA9IG5ldyB3cC5tZWRpYS52aWV3LkF0dGFjaG1lbnQuRGV0YWlscy5Ud29Db2x1bW4oe1xuXHRcdFx0Y29udHJvbGxlcjogdGhpcyxcblx0XHRcdG1vZGVsOiAgICAgIHRoaXMubW9kZWxcblx0XHR9KTtcblxuXHRcdC8qKlxuXHRcdCAqIEF0dGFjaCBhIHN1YnZpZXcgdG8gZGlzcGxheSBmaWVsZHMgYWRkZWQgdmlhIHRoZVxuXHRcdCAqIGBhdHRhY2htZW50X2ZpZWxkc190b19lZGl0YCBmaWx0ZXIuXG5cdFx0ICovXG5cdFx0Y29udGVudFJlZ2lvbi52aWV3LnZpZXdzLnNldCggJy5hdHRhY2htZW50LWNvbXBhdCcsIG5ldyB3cC5tZWRpYS52aWV3LkF0dGFjaG1lbnRDb21wYXQoe1xuXHRcdFx0Y29udHJvbGxlcjogdGhpcyxcblx0XHRcdG1vZGVsOiAgICAgIHRoaXMubW9kZWxcblx0XHR9KSApO1xuXG5cdFx0Ly8gVXBkYXRlIGJyb3dzZXIgdXJsIHdoZW4gbmF2aWdhdGluZyBtZWRpYSBkZXRhaWxzLCBleGNlcHQgb24gbG9hZC5cblx0XHRpZiAoIHRoaXMubW9kZWwgJiYgISB0aGlzLm1vZGVsLmdldCggJ3NraXBIaXN0b3J5JyApICkge1xuXHRcdFx0dGhpcy5ncmlkUm91dGVyLm5hdmlnYXRlKCB0aGlzLmdyaWRSb3V0ZXIuYmFzZVVybCggJz9pdGVtPScgKyB0aGlzLm1vZGVsLmlkICkgKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlbmRlciB0aGUgRWRpdEltYWdlIHZpZXcgaW50byB0aGUgZnJhbWUncyBjb250ZW50IHJlZ2lvbi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRSZWdpb24gQmFzaWMgb2JqZWN0IHdpdGggYSBgdmlld2AgcHJvcGVydHksIHdoaWNoXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZCBiZSBzZXQgd2l0aCB0aGUgcHJvcGVyIHJlZ2lvbiB2aWV3LlxuXHQgKi9cblx0ZWRpdEltYWdlTW9kZTogZnVuY3Rpb24oIGNvbnRlbnRSZWdpb24gKSB7XG5cdFx0dmFyIGVkaXRJbWFnZUNvbnRyb2xsZXIgPSBuZXcgd3AubWVkaWEuY29udHJvbGxlci5FZGl0SW1hZ2UoIHtcblx0XHRcdG1vZGVsOiB0aGlzLm1vZGVsLFxuXHRcdFx0ZnJhbWU6IHRoaXNcblx0XHR9ICk7XG5cdFx0Ly8gTm9vcCBzb21lIG1ldGhvZHMuXG5cdFx0ZWRpdEltYWdlQ29udHJvbGxlci5fdG9vbGJhciA9IGZ1bmN0aW9uKCkge307XG5cdFx0ZWRpdEltYWdlQ29udHJvbGxlci5fcm91dGVyID0gZnVuY3Rpb24oKSB7fTtcblx0XHRlZGl0SW1hZ2VDb250cm9sbGVyLl9tZW51ID0gZnVuY3Rpb24oKSB7fTtcblxuXHRcdGNvbnRlbnRSZWdpb24udmlldyA9IG5ldyB3cC5tZWRpYS52aWV3LkVkaXRJbWFnZS5EZXRhaWxzKCB7XG5cdFx0XHRtb2RlbDogdGhpcy5tb2RlbCxcblx0XHRcdGZyYW1lOiB0aGlzLFxuXHRcdFx0Y29udHJvbGxlcjogZWRpdEltYWdlQ29udHJvbGxlclxuXHRcdH0gKTtcblxuXHRcdHRoaXMuZ3JpZFJvdXRlci5uYXZpZ2F0ZSggdGhpcy5ncmlkUm91dGVyLmJhc2VVcmwoICc/aXRlbT0nICsgdGhpcy5tb2RlbC5pZCArICcmbW9kZT1lZGl0JyApICk7XG5cblx0fSxcblxuXHRlZGl0SW1hZ2VNb2RlUmVuZGVyOiBmdW5jdGlvbiggdmlldyApIHtcblx0XHR2aWV3Lm9uKCAncmVhZHknLCB2aWV3LmxvYWRFZGl0b3IgKTtcblx0fSxcblxuXHR0b2dnbGVOYXY6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuJCgnLmxlZnQnKS50b2dnbGVDbGFzcyggJ2Rpc2FibGVkJywgISB0aGlzLmhhc1ByZXZpb3VzKCkgKTtcblx0XHR0aGlzLiQoJy5yaWdodCcpLnRvZ2dsZUNsYXNzKCAnZGlzYWJsZWQnLCAhIHRoaXMuaGFzTmV4dCgpICk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlcmVuZGVyIHRoZSB2aWV3LlxuXHQgKi9cblx0cmVyZW5kZXI6IGZ1bmN0aW9uKCBtb2RlbCApIHtcblx0XHR0aGlzLnN0b3BMaXN0ZW5pbmcoIHRoaXMubW9kZWwgKTtcblxuXHRcdHRoaXMubW9kZWwgPSBtb2RlbDtcblxuXHRcdHRoaXMuYmluZE1vZGVsSGFuZGxlcnMoKTtcblxuXHRcdC8vIE9ubHkgcmVyZW5kZXIgdGhlIGBjb250ZW50YCByZWdpb24uXG5cdFx0aWYgKCB0aGlzLmNvbnRlbnQubW9kZSgpICE9PSAnZWRpdC1tZXRhZGF0YScgKSB7XG5cdFx0XHR0aGlzLmNvbnRlbnQubW9kZSggJ2VkaXQtbWV0YWRhdGEnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29udGVudC5yZW5kZXIoKTtcblx0XHR9XG5cblx0XHR0aGlzLnRvZ2dsZU5hdigpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDbGljayBoYW5kbGVyIHRvIHN3aXRjaCB0byB0aGUgcHJldmlvdXMgbWVkaWEgaXRlbS5cblx0ICovXG5cdHByZXZpb3VzTWVkaWFJdGVtOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgdGhpcy5oYXNQcmV2aW91cygpICkge1xuXHRcdFx0dGhpcy4kKCAnLmxlZnQnICkuYmx1cigpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnRyaWdnZXIoICdyZWZyZXNoJywgdGhpcy5saWJyYXJ5LmF0KCB0aGlzLmdldEN1cnJlbnRJbmRleCgpIC0gMSApICk7XG5cdFx0dGhpcy4kKCAnLmxlZnQnICkuZm9jdXMoKTtcblx0fSxcblxuXHQvKipcblx0ICogQ2xpY2sgaGFuZGxlciB0byBzd2l0Y2ggdG8gdGhlIG5leHQgbWVkaWEgaXRlbS5cblx0ICovXG5cdG5leHRNZWRpYUl0ZW06IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggISB0aGlzLmhhc05leHQoKSApIHtcblx0XHRcdHRoaXMuJCggJy5yaWdodCcgKS5ibHVyKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMudHJpZ2dlciggJ3JlZnJlc2gnLCB0aGlzLmxpYnJhcnkuYXQoIHRoaXMuZ2V0Q3VycmVudEluZGV4KCkgKyAxICkgKTtcblx0XHR0aGlzLiQoICcucmlnaHQnICkuZm9jdXMoKTtcblx0fSxcblxuXHRnZXRDdXJyZW50SW5kZXg6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmxpYnJhcnkuaW5kZXhPZiggdGhpcy5tb2RlbCApO1xuXHR9LFxuXG5cdGhhc05leHQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMuZ2V0Q3VycmVudEluZGV4KCkgKyAxICkgPCB0aGlzLmxpYnJhcnkubGVuZ3RoO1xuXHR9LFxuXG5cdGhhc1ByZXZpb3VzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLmdldEN1cnJlbnRJbmRleCgpIC0gMSApID4gLTE7XG5cdH0sXG5cdC8qKlxuXHQgKiBSZXNwb25kIHRvIHRoZSBrZXlib2FyZCBldmVudHM6IHJpZ2h0IGFycm93LCBsZWZ0IGFycm93LCBleGNlcHQgd2hlblxuXHQgKiBmb2N1cyBpcyBpbiBhIHRleHRhcmVhIG9yIGlucHV0IGZpZWxkLlxuXHQgKi9cblx0a2V5RXZlbnQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoICggJ0lOUFVUJyA9PT0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lIHx8ICdURVhUQVJFQScgPT09IGV2ZW50LnRhcmdldC5ub2RlTmFtZSApICYmICEgKCBldmVudC50YXJnZXQucmVhZE9ubHkgfHwgZXZlbnQudGFyZ2V0LmRpc2FibGVkICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIHJpZ2h0IGFycm93IGtleVxuXHRcdGlmICggMzkgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHR0aGlzLm5leHRNZWRpYUl0ZW0oKTtcblx0XHR9XG5cdFx0Ly8gVGhlIGxlZnQgYXJyb3cga2V5XG5cdFx0aWYgKCAzNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdHRoaXMucHJldmlvdXNNZWRpYUl0ZW0oKTtcblx0XHR9XG5cdH0sXG5cblx0cmVzZXRSb3V0ZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaFRlcm0gPSB0aGlzLmNvbnRyb2xsZXIuYnJvd3NlclZpZXcudG9vbGJhci5nZXQoICdzZWFyY2gnICkuJGVsLnZhbCgpLFxuXHRcdFx0dXJsID0gJycgIT09IHNlYXJjaFRlcm0gPyAnP3NlYXJjaD0nICsgc2VhcmNoVGVybSA6ICcnO1xuXHRcdHRoaXMuZ3JpZFJvdXRlci5uYXZpZ2F0ZSggdGhpcy5ncmlkUm91dGVyLmJhc2VVcmwoIHVybCApLCB7IHJlcGxhY2U6IHRydWUgfSApO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0QXR0YWNobWVudHM7XG4iLCIvKipcbiAqIHdwLm1lZGlhLnZpZXcuTWVkaWFGcmFtZS5NYW5hZ2VcbiAqXG4gKiBBIGdlbmVyaWMgbWFuYWdlbWVudCBmcmFtZSB3b3JrZmxvdy5cbiAqXG4gKiBVc2VkIGluIHRoZSBtZWRpYSBncmlkIHZpZXcuXG4gKlxuICogQGNsYXNzXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5NZWRpYUZyYW1lXG4gKiBAYXVnbWVudHMgd3AubWVkaWEudmlldy5GcmFtZVxuICogQGF1Z21lbnRzIHdwLm1lZGlhLlZpZXdcbiAqIEBhdWdtZW50cyB3cC5CYWNrYm9uZS5WaWV3XG4gKiBAYXVnbWVudHMgQmFja2JvbmUuVmlld1xuICogQG1peGVzIHdwLm1lZGlhLmNvbnRyb2xsZXIuU3RhdGVNYWNoaW5lXG4gKi9cbnZhciBNZWRpYUZyYW1lID0gd3AubWVkaWEudmlldy5NZWRpYUZyYW1lLFxuXHRMaWJyYXJ5ID0gd3AubWVkaWEuY29udHJvbGxlci5MaWJyYXJ5LFxuXG5cdCQgPSBCYWNrYm9uZS4kLFxuXHRNYW5hZ2U7XG5cbk1hbmFnZSA9IE1lZGlhRnJhbWUuZXh0ZW5kKHtcblx0LyoqXG5cdCAqIEBnbG9iYWwgd3AuVXBsb2FkZXJcblx0ICovXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdF8uZGVmYXVsdHMoIHRoaXMub3B0aW9ucywge1xuXHRcdFx0dGl0bGU6ICAgICAnJyxcblx0XHRcdG1vZGFsOiAgICAgZmFsc2UsXG5cdFx0XHRzZWxlY3Rpb246IFtdLFxuXHRcdFx0bGlicmFyeTogICB7fSwgLy8gT3B0aW9ucyBoYXNoIGZvciB0aGUgcXVlcnkgdG8gdGhlIG1lZGlhIGxpYnJhcnkuXG5cdFx0XHRtdWx0aXBsZTogICdhZGQnLFxuXHRcdFx0c3RhdGU6ICAgICAnbGlicmFyeScsXG5cdFx0XHR1cGxvYWRlcjogIHRydWUsXG5cdFx0XHRtb2RlOiAgICAgIFsgJ2dyaWQnLCAnZWRpdCcgXVxuXHRcdH0pO1xuXG5cdFx0dGhpcy4kYm9keSA9ICQoIGRvY3VtZW50LmJvZHkgKTtcblx0XHR0aGlzLiR3aW5kb3cgPSAkKCB3aW5kb3cgKTtcblx0XHR0aGlzLiRhZG1pbkJhciA9ICQoICcjd3BhZG1pbmJhcicgKTtcblx0XHQvLyBTdG9yZSB0aGUgQWRkIE5ldyBidXR0b24gZm9yIGxhdGVyIHJldXNlIGluIHdwLm1lZGlhLnZpZXcuVXBsb2FkZXJJbmxpbmUuXG5cdFx0dGhpcy4kdXBsb2FkZXJUb2dnbGVyID0gJCggJy5wYWdlLXRpdGxlLWFjdGlvbicgKVxuXHRcdFx0LmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApXG5cdFx0XHQub24oICdjbGljaycsIF8uYmluZCggdGhpcy5hZGROZXdDbGlja0hhbmRsZXIsIHRoaXMgKSApO1xuXG5cdFx0dGhpcy4kd2luZG93Lm9uKCAnc2Nyb2xsIHJlc2l6ZScsIF8uZGVib3VuY2UoIF8uYmluZCggdGhpcy5maXhQb3NpdGlvbiwgdGhpcyApLCAxNSApICk7XG5cblx0XHQvLyBFbnN1cmUgY29yZSBhbmQgbWVkaWEgZ3JpZCB2aWV3IFVJIGlzIGVuYWJsZWQuXG5cdFx0dGhpcy4kZWwuYWRkQ2xhc3MoJ3dwLWNvcmUtdWknKTtcblxuXHRcdC8vIEZvcmNlIHRoZSB1cGxvYWRlciBvZmYgaWYgdGhlIHVwbG9hZCBsaW1pdCBoYXMgYmVlbiBleGNlZWRlZCBvclxuXHRcdC8vIGlmIHRoZSBicm93c2VyIGlzbid0IHN1cHBvcnRlZC5cblx0XHRpZiAoIHdwLlVwbG9hZGVyLmxpbWl0RXhjZWVkZWQgfHwgISB3cC5VcGxvYWRlci5icm93c2VyLnN1cHBvcnRlZCApIHtcblx0XHRcdHRoaXMub3B0aW9ucy51cGxvYWRlciA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgYSB3aW5kb3ctd2lkZSB1cGxvYWRlci5cblx0XHRpZiAoIHRoaXMub3B0aW9ucy51cGxvYWRlciApIHtcblx0XHRcdHRoaXMudXBsb2FkZXIgPSBuZXcgd3AubWVkaWEudmlldy5VcGxvYWRlcldpbmRvdyh7XG5cdFx0XHRcdGNvbnRyb2xsZXI6IHRoaXMsXG5cdFx0XHRcdHVwbG9hZGVyOiB7XG5cdFx0XHRcdFx0ZHJvcHpvbmU6ICBkb2N1bWVudC5ib2R5LFxuXHRcdFx0XHRcdGNvbnRhaW5lcjogZG9jdW1lbnQuYm9keVxuXHRcdFx0XHR9XG5cdFx0XHR9KS5yZW5kZXIoKTtcblx0XHRcdHRoaXMudXBsb2FkZXIucmVhZHkoKTtcblx0XHRcdCQoJ2JvZHknKS5hcHBlbmQoIHRoaXMudXBsb2FkZXIuZWwgKTtcblxuXHRcdFx0dGhpcy5vcHRpb25zLnVwbG9hZGVyID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5ncmlkUm91dGVyID0gbmV3IHdwLm1lZGlhLnZpZXcuTWVkaWFGcmFtZS5NYW5hZ2UuUm91dGVyKCk7XG5cblx0XHQvLyBDYWxsICdpbml0aWFsaXplJyBkaXJlY3RseSBvbiB0aGUgcGFyZW50IGNsYXNzLlxuXHRcdE1lZGlhRnJhbWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0Ly8gQXBwZW5kIHRoZSBmcmFtZSB2aWV3IGRpcmVjdGx5IHRoZSBzdXBwbGllZCBjb250YWluZXIuXG5cdFx0dGhpcy4kZWwuYXBwZW5kVG8oIHRoaXMub3B0aW9ucy5jb250YWluZXIgKTtcblxuXHRcdHRoaXMuY3JlYXRlU3RhdGVzKCk7XG5cdFx0dGhpcy5iaW5kUmVnaW9uTW9kZUhhbmRsZXJzKCk7XG5cdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR0aGlzLmJpbmRTZWFyY2hIYW5kbGVyKCk7XG5cblx0XHR3cC5tZWRpYS5mcmFtZXMuYnJvd3NlID0gdGhpcztcblx0fSxcblxuXHRiaW5kU2VhcmNoSGFuZGxlcjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlYXJjaCA9IHRoaXMuJCggJyNtZWRpYS1zZWFyY2gtaW5wdXQnICksXG5cdFx0XHRzZWFyY2hWaWV3ID0gdGhpcy5icm93c2VyVmlldy50b29sYmFyLmdldCggJ3NlYXJjaCcgKS4kZWwsXG5cdFx0XHRsaXN0TW9kZSA9IHRoaXMuJCggJy52aWV3LWxpc3QnICksXG5cblx0XHRcdGlucHV0ICA9IF8udGhyb3R0bGUoIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdHZhciB2YWwgPSAkKCBlLmN1cnJlbnRUYXJnZXQgKS52YWwoKSxcblx0XHRcdFx0XHR1cmwgPSAnJztcblxuXHRcdFx0XHRpZiAoIHZhbCApIHtcblx0XHRcdFx0XHR1cmwgKz0gJz9zZWFyY2g9JyArIHZhbDtcblx0XHRcdFx0XHR0aGlzLmdyaWRSb3V0ZXIubmF2aWdhdGUoIHRoaXMuZ3JpZFJvdXRlci5iYXNlVXJsKCB1cmwgKSwgeyByZXBsYWNlOiB0cnVlIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTAwMCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBVUkwgd2hlbiBlbnRlcmluZyBzZWFyY2ggc3RyaW5nIChhdCBtb3N0IG9uY2UgcGVyIHNlY29uZClcblx0XHRzZWFyY2gub24oICdpbnB1dCcsIF8uYmluZCggaW5wdXQsIHRoaXMgKSApO1xuXG5cdFx0dGhpcy5ncmlkUm91dGVyXG5cdFx0XHQub24oICdyb3V0ZTpzZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRcdGlmICggaHJlZi5pbmRleE9mKCAnbW9kZT0nICkgPiAtMSApIHtcblx0XHRcdFx0XHRocmVmID0gaHJlZi5yZXBsYWNlKCAvbW9kZT1bXiZdKy9nLCAnbW9kZT1saXN0JyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhyZWYgKz0gaHJlZi5pbmRleE9mKCAnPycgKSA+IC0xID8gJyZtb2RlPWxpc3QnIDogJz9tb2RlPWxpc3QnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGhyZWYgPSBocmVmLnJlcGxhY2UoICdzZWFyY2g9JywgJ3M9JyApO1xuXHRcdFx0XHRsaXN0TW9kZS5wcm9wKCAnaHJlZicsIGhyZWYgKTtcblx0XHRcdH0pXG5cdFx0XHQub24oICdyb3V0ZTpyZXNldCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWFyY2hWaWV3LnZhbCggJycgKS50cmlnZ2VyKCAnaW5wdXQnICk7XG5cdFx0XHR9KTtcblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIHRoZSBkZWZhdWx0IHN0YXRlcyBmb3IgdGhlIGZyYW1lLlxuXHQgKi9cblx0Y3JlYXRlU3RhdGVzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdGlmICggdGhpcy5vcHRpb25zLnN0YXRlcyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBBZGQgdGhlIGRlZmF1bHQgc3RhdGVzLlxuXHRcdHRoaXMuc3RhdGVzLmFkZChbXG5cdFx0XHRuZXcgTGlicmFyeSh7XG5cdFx0XHRcdGxpYnJhcnk6ICAgICAgICAgICAgd3AubWVkaWEucXVlcnkoIG9wdGlvbnMubGlicmFyeSApLFxuXHRcdFx0XHRtdWx0aXBsZTogICAgICAgICAgIG9wdGlvbnMubXVsdGlwbGUsXG5cdFx0XHRcdHRpdGxlOiAgICAgICAgICAgICAgb3B0aW9ucy50aXRsZSxcblx0XHRcdFx0Y29udGVudDogICAgICAgICAgICAnYnJvd3NlJyxcblx0XHRcdFx0dG9vbGJhcjogICAgICAgICAgICAnc2VsZWN0Jyxcblx0XHRcdFx0Y29udGVudFVzZXJTZXR0aW5nOiBmYWxzZSxcblx0XHRcdFx0ZmlsdGVyYWJsZTogICAgICAgICAnYWxsJyxcblx0XHRcdFx0YXV0b1NlbGVjdDogICAgICAgICBmYWxzZVxuXHRcdFx0fSlcblx0XHRdKTtcblx0fSxcblxuXHQvKipcblx0ICogQmluZCByZWdpb24gbW9kZSBhY3RpdmF0aW9uIGV2ZW50cyB0byBwcm9wZXIgaGFuZGxlcnMuXG5cdCAqL1xuXHRiaW5kUmVnaW9uTW9kZUhhbmRsZXJzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm9uKCAnY29udGVudDpjcmVhdGU6YnJvd3NlJywgdGhpcy5icm93c2VDb250ZW50LCB0aGlzICk7XG5cblx0XHQvLyBIYW5kbGUgYSBmcmFtZS1sZXZlbCBldmVudCBmb3IgZWRpdGluZyBhbiBhdHRhY2htZW50LlxuXHRcdHRoaXMub24oICdlZGl0OmF0dGFjaG1lbnQnLCB0aGlzLm9wZW5FZGl0QXR0YWNobWVudE1vZGFsLCB0aGlzICk7XG5cblx0XHR0aGlzLm9uKCAnc2VsZWN0OmFjdGl2YXRlJywgdGhpcy5iaW5kS2V5ZG93biwgdGhpcyApO1xuXHRcdHRoaXMub24oICdzZWxlY3Q6ZGVhY3RpdmF0ZScsIHRoaXMudW5iaW5kS2V5ZG93biwgdGhpcyApO1xuXHR9LFxuXG5cdGhhbmRsZUtleWRvd246IGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUud2hpY2ggKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVNb2RlKCAnc2VsZWN0JyApLmFjdGl2YXRlTW9kZSggJ2VkaXQnICk7XG5cdFx0fVxuXHR9LFxuXG5cdGJpbmRLZXlkb3duOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLiRib2R5Lm9uKCAna2V5ZG93bi5zZWxlY3QnLCBfLmJpbmQoIHRoaXMuaGFuZGxlS2V5ZG93biwgdGhpcyApICk7XG5cdH0sXG5cblx0dW5iaW5kS2V5ZG93bjogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy4kYm9keS5vZmYoICdrZXlkb3duLnNlbGVjdCcgKTtcblx0fSxcblxuXHRmaXhQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRicm93c2VyLCAkdG9vbGJhcjtcblx0XHRpZiAoICEgdGhpcy5pc01vZGVBY3RpdmUoICdzZWxlY3QnICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGJyb3dzZXIgPSB0aGlzLiQoJy5hdHRhY2htZW50cy1icm93c2VyJyk7XG5cdFx0JHRvb2xiYXIgPSAkYnJvd3Nlci5maW5kKCcubWVkaWEtdG9vbGJhcicpO1xuXG5cdFx0Ly8gT2Zmc2V0IGRvZXNuJ3QgYXBwZWFyIHRvIHRha2UgdG9wIG1hcmdpbiBpbnRvIGFjY291bnQsIGhlbmNlICsxNlxuXHRcdGlmICggKCAkYnJvd3Nlci5vZmZzZXQoKS50b3AgKyAxNiApIDwgdGhpcy4kd2luZG93LnNjcm9sbFRvcCgpICsgdGhpcy4kYWRtaW5CYXIuaGVpZ2h0KCkgKSB7XG5cdFx0XHQkYnJvd3Nlci5hZGRDbGFzcyggJ2ZpeGVkJyApO1xuXHRcdFx0JHRvb2xiYXIuY3NzKCd3aWR0aCcsICRicm93c2VyLndpZHRoKCkgKyAncHgnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGJyb3dzZXIucmVtb3ZlQ2xhc3MoICdmaXhlZCcgKTtcblx0XHRcdCR0b29sYmFyLmNzcygnd2lkdGgnLCAnJyk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgYEFkZCBOZXdgIGJ1dHRvbi5cblx0ICovXG5cdGFkZE5ld0NsaWNrSGFuZGxlcjogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy50cmlnZ2VyKCAndG9nZ2xlOnVwbG9hZDphdHRhY2htZW50JyApO1xuXG5cdFx0aWYgKCB0aGlzLnVwbG9hZGVyICkge1xuXHRcdFx0dGhpcy51cGxvYWRlci5yZWZyZXNoKCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBPcGVuIHRoZSBFZGl0IEF0dGFjaG1lbnQgbW9kYWwuXG5cdCAqL1xuXHRvcGVuRWRpdEF0dGFjaG1lbnRNb2RhbDogZnVuY3Rpb24oIG1vZGVsICkge1xuXHRcdC8vIENyZWF0ZSBhIG5ldyBFZGl0QXR0YWNobWVudCBmcmFtZSwgcGFzc2luZyBhbG9uZyB0aGUgbGlicmFyeSBhbmQgdGhlIGF0dGFjaG1lbnQgbW9kZWwuXG5cdFx0aWYgKCB3cC5tZWRpYS5mcmFtZXMuZWRpdCApIHtcblx0XHRcdHdwLm1lZGlhLmZyYW1lcy5lZGl0Lm9wZW4oKS50cmlnZ2VyKCAncmVmcmVzaCcsIG1vZGVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdwLm1lZGlhLmZyYW1lcy5lZGl0ID0gd3AubWVkaWEoIHtcblx0XHRcdFx0ZnJhbWU6ICAgICAgICdlZGl0LWF0dGFjaG1lbnRzJyxcblx0XHRcdFx0Y29udHJvbGxlcjogIHRoaXMsXG5cdFx0XHRcdGxpYnJhcnk6ICAgICB0aGlzLnN0YXRlKCkuZ2V0KCdsaWJyYXJ5JyksXG5cdFx0XHRcdG1vZGVsOiAgICAgICBtb2RlbFxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogQ3JlYXRlIGFuIGF0dGFjaG1lbnRzIGJyb3dzZXIgdmlldyB3aXRoaW4gdGhlIGNvbnRlbnQgcmVnaW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gY29udGVudFJlZ2lvbiBCYXNpYyBvYmplY3Qgd2l0aCBhIGB2aWV3YCBwcm9wZXJ0eSwgd2hpY2hcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkIGJlIHNldCB3aXRoIHRoZSBwcm9wZXIgcmVnaW9uIHZpZXcuXG5cdCAqIEB0aGlzIHdwLm1lZGlhLmNvbnRyb2xsZXIuUmVnaW9uXG5cdCAqL1xuXHRicm93c2VDb250ZW50OiBmdW5jdGlvbiggY29udGVudFJlZ2lvbiApIHtcblx0XHR2YXIgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XG5cblx0XHQvLyBCcm93c2Ugb3VyIGxpYnJhcnkgb2YgYXR0YWNobWVudHMuXG5cdFx0dGhpcy5icm93c2VyVmlldyA9IGNvbnRlbnRSZWdpb24udmlldyA9IG5ldyB3cC5tZWRpYS52aWV3LkF0dGFjaG1lbnRzQnJvd3Nlcih7XG5cdFx0XHRjb250cm9sbGVyOiB0aGlzLFxuXHRcdFx0Y29sbGVjdGlvbjogc3RhdGUuZ2V0KCdsaWJyYXJ5JyksXG5cdFx0XHRzZWxlY3Rpb246ICBzdGF0ZS5nZXQoJ3NlbGVjdGlvbicpLFxuXHRcdFx0bW9kZWw6ICAgICAgc3RhdGUsXG5cdFx0XHRzb3J0YWJsZTogICBzdGF0ZS5nZXQoJ3NvcnRhYmxlJyksXG5cdFx0XHRzZWFyY2g6ICAgICBzdGF0ZS5nZXQoJ3NlYXJjaGFibGUnKSxcblx0XHRcdGZpbHRlcnM6ICAgIHN0YXRlLmdldCgnZmlsdGVyYWJsZScpLFxuXHRcdFx0ZGF0ZTogICAgICAgc3RhdGUuZ2V0KCdkYXRlJyksXG5cdFx0XHRkaXNwbGF5OiAgICBzdGF0ZS5nZXQoJ2Rpc3BsYXlTZXR0aW5ncycpLFxuXHRcdFx0ZHJhZ0luZm86ICAgc3RhdGUuZ2V0KCdkcmFnSW5mbycpLFxuXHRcdFx0c2lkZWJhcjogICAgJ2Vycm9ycycsXG5cblx0XHRcdHN1Z2dlc3RlZFdpZHRoOiAgc3RhdGUuZ2V0KCdzdWdnZXN0ZWRXaWR0aCcpLFxuXHRcdFx0c3VnZ2VzdGVkSGVpZ2h0OiBzdGF0ZS5nZXQoJ3N1Z2dlc3RlZEhlaWdodCcpLFxuXG5cdFx0XHRBdHRhY2htZW50Vmlldzogc3RhdGUuZ2V0KCdBdHRhY2htZW50VmlldycpLFxuXG5cdFx0XHRzY3JvbGxFbGVtZW50OiBkb2N1bWVudFxuXHRcdH0pO1xuXHRcdHRoaXMuYnJvd3NlclZpZXcub24oICdyZWFkeScsIF8uYmluZCggdGhpcy5iaW5kRGVmZXJyZWQsIHRoaXMgKSApO1xuXG5cdFx0dGhpcy5lcnJvcnMgPSB3cC5VcGxvYWRlci5lcnJvcnM7XG5cdFx0dGhpcy5lcnJvcnMub24oICdhZGQgcmVtb3ZlIHJlc2V0JywgdGhpcy5zaWRlYmFyVmlzaWJpbGl0eSwgdGhpcyApO1xuXHR9LFxuXG5cdHNpZGViYXJWaXNpYmlsaXR5OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmJyb3dzZXJWaWV3LiQoICcubWVkaWEtc2lkZWJhcicgKS50b2dnbGUoICEhIHRoaXMuZXJyb3JzLmxlbmd0aCApO1xuXHR9LFxuXG5cdGJpbmREZWZlcnJlZDogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAhIHRoaXMuYnJvd3NlclZpZXcuZGZkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLmJyb3dzZXJWaWV3LmRmZC5kb25lKCBfLmJpbmQoIHRoaXMuc3RhcnRIaXN0b3J5LCB0aGlzICkgKTtcblx0fSxcblxuXHRzdGFydEhpc3Rvcnk6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIFZlcmlmeSBwdXNoU3RhdGUgc3VwcG9ydCBhbmQgYWN0aXZhdGVcblx0XHRpZiAoIHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSApIHtcblx0XHRcdGlmICggQmFja2JvbmUuSGlzdG9yeS5zdGFydGVkICkge1xuXHRcdFx0XHRCYWNrYm9uZS5oaXN0b3J5LnN0b3AoKTtcblx0XHRcdH1cblx0XHRcdEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoIHtcblx0XHRcdFx0cm9vdDogd2luZG93Ll93cE1lZGlhR3JpZFNldHRpbmdzLmFkbWluVXJsLFxuXHRcdFx0XHRwdXNoU3RhdGU6IHRydWVcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hbmFnZTtcbiJdfQ==
