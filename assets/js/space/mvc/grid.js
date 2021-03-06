$.extend(
	$.fn, {
		vsViewGrid: function(o) {
			if (o == null) o = {};
			if (o.gridContainer == undefined) o.gridContainer = $('DIV#file-container.vsgrid');
			if (o.eventHandlers == undefined) o.eventHandlers = null;
			var self = this;
			var data = [];
			var currentViewMode = 'grid';
			var aryImg = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
			var aryVideo = ['mp4', 'flv', 'webm'];

			var init = function() {
				var ul = $('<ul></ul>', {
					'class': 'vsgrid'
				});
				$(o.gridContainer).append(ul);
			};

			var createNode = function(item, opts) {
				if (opts.minetype == undefined) opts.minetype = 'directory';
				var icon = 'icon-' + opts.minetype;
				var img = null;
				var preloadedObj = null;
				if (item.thumbnail != undefined) {
					img = item.thumbnail != '' ? $('<img />', {
						src: item.thumbnail,
						align: 'middle'
					}) : null;
				}

				if ($.inArray(opts.minetype, aryImg) > -1) {
					preloadedObj = $('<img />', {
						'id': 'preloadimage-' + item.id,
						'src': window.atob(appprofile.uhandler) + 'space/file/userid/' + appprofile.id + '/id/' + item.id,
						'data-name': item.name
					}).load(function(e){
						$(img).parent().parent().attr('data-width',preloadedObj[0].width);
						$(img).parent().parent().attr('data-height',preloadedObj[0].height);
					});
				}

				var div = $('<div></div>', {
					'class': icon
				});

				if (img != null) $(div).append(img);
				var a = $('<a></a>', {
					id: item.id,
					href: '#',
					rel: item.name,
					text: item.name,
					'data-id': item.id
				});
				var divLink = $('<div></div>', {
					'class': 'file-name'
				}).append(a);

				var divSize = $('<div></div>', {
					class: 'size-column',
					style: 'visibility:' + (viewMode == 'list' ? 'visible' : 'hidden'),
					text: objUltis.formatFileSize(item.size)
				});
				var divMineType = $('<div></div>', {
					class: 'minetype-column',
					style: 'visibility:' + (viewMode == 'list' ? 'visible' : 'hidden'),
					text: (opts.minetype == 'directory' ? 'Thư mục' : opts.minetype)
				});
				var divDate = $('<div></div>', {
					class: 'date-column',
					style: 'visibility:' + (viewMode == 'list' ? 'visible' : 'hidden'),
					text: item.date
				});

				var li = $('<li></li>', {
					'class': 'vscell',
					id: opts.minetype + '-' + item.id,
					'data-id': item.id,
					'data-name': item.name,
					'data-size': item.size,
					'data-type': opts.minetype,
					'data-date': item.date,
					'data-parent': item.parentID,
					'data-child': opts.minetype == 'directory' ? item.subdirs : '0'
				}).append(div, divLink, divSize, divMineType, divDate);
				bindNodeEvents(li, preloadedObj);
				return li;
			};

			var bindNodeEvents = function(node, preloadedObj) {
				if (o.eventHandlers == null) return false;
				$(node).bind('click', function(e) {
						e.stopPropagation();
						nodeClick(this, e);
						return false;
					})
					.bind('dblclick', function(e) {
						var nodeData = $(node).data();
						if ($(node).attr('data-type') == 'directory') {
							o.eventHandlers.open(node, function(node, oViewTree) {
								oViewTree.nodeClick($('DIV#treeview-container').find('A[data-id="' + nodeData.id + '"]'));
							});
						} else {
							var url = window.atob(appprofile.uhandler) + 'space/file/userid/' + appprofile.id + '/id/' + nodeData.id; // decode the string							
							var filename = nodeData.name;
							var preload = preloadedObj != undefined ? preloadedObj[0] : null;
							if (mode == 'plugin') {
								objTinyMCE.tinymcePreview({
									id:nodeData.id,
									src:url,
									file: filename
								});
							} else {
								objLightBox.setup({
									preload: preload,
									src: url,
									file: filename
								});
								objLightBox.show();
							}
						}
					});
			};

			var nodeClick = function(node, event) {
				o.eventHandlers.select(node, function() {
					if (event.ctrlKey || event.metaKey) {
						if (!isHighLight(node))
							highlightNode(node);
						else
							clearHighLightNode(node);
					} else if (event.shiftKey) {
						var firstItem = $(o.gridContainer).find('LI.selected');
						var aryNode = $(o.gridContainer).find('> UL > LI');
						var start = aryNode.index(firstItem);
						var finish = aryNode.index(node);
						aryNode.slice(Math.min(start, finish), Math.max(start, finish) + 1).each(function(i, o) {
							highlightNode(o);
						});
					} else {
						clearAllHighLightNode(node);
						highlightNode(node);
					}
				});
				objLayout.setStatusBar();
			};

			var highlightNode = function(node) {
				$(node).addClass('selected');
			};

			var isHighLight = function(node) {
				return $(node).hasClass('selected');
			};

			var clearAllHighLightNode = function() {
				$(o.gridContainer).find('> UL > LI').removeClass('selected');
			};

			var clearHighLightNode = function(node) {
				$(node).removeClass('selected');
			};

			var highLightAllNode = function() {
				clearAllHighLightNode();
				$(o.gridContainer).find('> UL > LI').addClass('selected');
			};

			var findNodeById = function(nodeId) {
				return $(o.gridContainer).find('> UL > LI[data-id="' + nodeId + '"]');
			};

			this.renderGrid = function(items, isAppend) {
				var ul = $('UL.vsgrid');

				if (isAppend == undefined) isAppend = false;

				if (!isAppend) $(ul).empty();

				$(ul).append(objLayout.showListViewHeader());
				objLayout.binColHeaderEvent();

				if (items.folder.length > 0) {
					for (var i = 0; i < items.folder.length; i++) {
						var opts = {};
						var li = createNode(items.folder[i], opts);
						$(ul).append(li);
					};
				}

				if (items.file.length > 0) {
					for (var i = 0; i < items.file.length; i++) {
						var opts = {
							minetype: items.file[i].type
						};
						var li = createNode(items.file[i], opts);
						$(ul).append(li);
					};
				}
			};

			this.clearContent = function() {
				$(o.gridContainer).find('UL.vsgrid LI').remove();
			};

			this.selectAllNode = function() {
				highLightAllNode();
			};

			this.clearSelecteds = function() {
				clearAllHighLightNode();
			}

			this.highLightNode = function(nodeId) {
				highlightNode(findNodeById(nodeId));
			}

			this.getSelectedNodes = function() {
				return $(o.gridContainer).find('UL.vsgrid LI.vscell.selected');
			};

			this.findNodeById = function(id) {
				return $(o.gridContainer).find('UL.vsgrid LI.vscell[data-id="' + id + '"]');
			}

			this.setOptions = function(opt, value) {
				eval('o.' + opt + '= value;');
			};

			this.getOptions = function(opt) {
				if (opt == null) return o;
				else return eval('o.' + opt);
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});