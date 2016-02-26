$.extend(
	$.fn, {
		vLightbox: function(o) {
			if (o == null) o = {};
			if (o.source == undefined) o.source = {
				title: '',
				type: 'image',
				src: '',
				dimensions: {
					x: '320',
					y: '240'
				},
				minetype: ''
			};


			var self = this;
			var container = null;
			var maxWidth = 0;
			var maxHeight = 0;

			var init = function() {
				renderContainer();
				self.calculate();
			};

			var unsupported = function() {
				var player = $('<span></span>', {
					id: 'emptyPl',
					text: 'Chưa hỗ trợ xem kiểu file này!'
				});
				player.css('display', 'inline-block');
				player.css('width', '100%');
				player.css('height', '100%');
				player.css('text-align', 'center');
				return player;
			};

			var picturePreview = function() {
				var player = $('<img/>', {
					id: 'vLightBoxImage',
					src: o.source.src,
					style: 'max-width:100%;max-height:100%;'
				});

				player.bind('loadedmetadata',function (e){
					console.log(this);
				});

				return player;
			};

			var htmlVideosPreview = function() {
				var player = $('<video controls autoplay></video>', {
					id: 'vLightBoxVideo',
					style: 'max-width:100%;max-height:100%;padding:0px;'
				}).append($('<source />', {
					src: o.source.src,
					type: 'video/' + o.source.minetype
				}));

				$(player).hide();

				player[0].addEventListener('loadedmetadata', function(e) {
					o.source.dimensions.x = player[0].videoWidth;
					o.source.dimensions.y = player[0].videoHeight;
					$(player).width('100%');
					$(player).height('100%');
					$(player).show();
				});

				return player;
			};

			var flashVideosPlayer = function () {
				var generateFlash = function (url, id, width, height, version, bg, flashvars, params, att) {

				};
			};

			var htmlAudioPreview = function() {
				var player = $('<audio></audio>', {
					id: 'vLightBoxAudio',
					'controls': 'controls'
				}).append($('<source />', {
					src: o.source.src,
					type: 'audio/' + o.source.minetype
				}));

				return player;
			};

			var renderContainer = function() {
				container = $('<div></div>', {
					id: 'vLightBoxDlg',
					class: 'modal fade',
					tabindex: '-1',
					role: 'dialog'
				});
				var modalDlg = $('<div></div>', {
					class: 'modal-dialog',
					style: 'padding:0px;background: rgba(0, 0, 0, 0)'
				});
				var dlgContent = $('<div></div>', {
					class: 'modal-content',
					style: 'background: rgba(0, 0, 0, 0.4)'
				});
				var dlgHeader = $('<div></div>', {
						class: 'modal-header',
						style: 'padding:5px;background: rgba(0, 0, 0, 0.4);margin:0px;'
					})
					.append($('<span></span>', {
						id: 'previewTitle',
						class: 'modal-title',
						style: 'font-size:10px;min-height:10px;color:#aaa'
					}));

				var dlgBody = $('<div></div>', {
					class: 'modal-body',
					style: 'padding:0px;border:none;margin:0px;background: rgba(0, 0, 0, 0.4)'
				});
				var dlgFooter = $('<div></div>', {
					class: 'modal-footer'
				});
				container.append(modalDlg.append(dlgContent.append(dlgHeader, dlgBody)));
			}

			var generatePlayer = function() {
				var player = null;
				if (o.source.src == '') return null;

				switch (o.source.type) {
					case 'image':
						player = picturePreview();
						break;
					case 'video':
						if ($.inArray(o.source.minetype, htmlvideos) > -1) {
							player = htmlVideosPreview();
						} else {
							player = unsupported();
						}

						break;
					case 'audio':
						player = htmlAudioPreview();
						break;
					default:
						// statements_def
						player = unsupported();
						break;
				}

				return player;
			};

			this.setup = function(opts) {
				o = opts;
			};

			this.show = function(opts) {
				if (opts != undefined) o = opts;
				var player = generatePlayer();

				container.find('DIV.modal-header span').html('File: <strong>' + o.source.title + '</strong> - Kích thước: ' + o.source.dimensions.x + 'px × ' + o.source.dimensions.y + 'px');

				var width = o.source.dimensions.x > maxWidth ? maxWidth : o.source.dimensions.x;
				var ratio = (o.source.dimensions.x / o.source.dimensions.y);

				var height = parseInt(o.source.dimensions.y) <= maxHeight ? parseInt(o.source.dimensions.y) : Math.ceil((width * o.source.dimensions.y) / o.source.dimensions.x);
				height += parseInt(Math.abs(container.find('DIV.modal-header').height()));

				if (height > maxHeight) {
					height = maxHeight;
					width = Math.ceil((height - Math.abs(container.find('DIV.modal-header').height())) * ratio);
				}

				container.find('DIV.modal-dialog').css('max-width', '100%');
				container.find('DIV.modal-dialog').css('max-height', '100%');
				container.find('DIV.modal-dialog').css('width', width + 'px');
				container.find('DIV.modal-dialog').css('height', height + 'px');
				container.find('DIV.modal-body').css('height', (height - Math.abs(container.find('DIV.modal-header').height())) + 'px');

				$(container).on('shown.bs.modal', function(e) {
					container.find('DIV.modal-body').empty();
					container.find('DIV.modal-body').append(player);

					if (o.source.type == 'video') {
						if (player[0].tagName == 'VIDEO') {
							player[0].play();
						}
					}
				}).on('hide.bs.modal', function(e) {
					if (player[0].tagName == 'VIDEO') {
						player[0].pause();
					}
					container.find('DIV.modal-body').empty();
				}).modal('show');
			};

			this.calculate = function() {
				maxWidth = Math.ceil($(document).width() / 100 * 85);
				maxHeight = Math.ceil($(document).height() / 100 * 85);
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});