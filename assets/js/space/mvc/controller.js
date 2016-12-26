$.extend(
	$.fn, {
		vsController: function(o) {
			if (o == null) o = {};
			var self = this;

			/**************************
			 * EVENT HANDLING - BEGIN *
			 *************************/
			this.selectItem = function(node, callback) {
				callback();
			};

			this.openDir = function(node, callback) {
				var itemId = $(node).attr('data-id');
				objSpaceModel.getListItemsByParentId(itemId, function(data) {
					objTree.renderTreeBranch(data, itemId);
					objGrid.renderGrid(data);
					if ($(node).prop('tagName').toLowerCase() == 'li') {
						callback(node, objTree);
					} else {
						callback(node);
					}
					objLayout.setBreadcrumb();
				});
			};

			this.createDir = function() {
				objLayout.showCreateFolderDlg(function() {});
			};

			this.delete = function() {
				var items = getSelectedItems();
				if (items.length > 0) objLayout.showDeleteConfirm(items);
			};

			this.upload = function() {
				objUpload.showUploadDlg();
			};

			this.download = function() {
				var node = objGrid.getSelectedNodes();
				if (node.length > 0) node = $($(node)[0]);
				if ($(node).attr('data-type') != 'directory')
					window.location.href = window.atob(appprofile.uhandler) + 'space/download/userid/' + appprofile.id + '/id/' + $(node).attr('data-id');
			};

			this.copy = function() {
				var items = getSelectedItems();
				objUltis.notification('Copy file');
				objUltis.clipBoard.put(items);
				objUltis.clipBoard.do('copy');
			};

			this.move = function() {
				$('li.vscell.selected').css('opacity', 0.5);
				var items = getSelectedItems();
				objUltis.clipBoard.put(items);
				objUltis.clipBoard.do('move');
			};

			this.paste = function() {
				var destination = objTree.getSelectedNode();
				var items = objUltis.clipBoard.get();
				var act = objUltis.clipBoard.act;

				var arySource = [];
				if (objUltis.clipBoard.act == 'move') {
					var source = objUltis.clipBoard.get();
					for (var i = 0; i < source.length; i++) {
						var node = objTree.findNodeById(source[i]);
						arySource[i] = node;
					}
				}

				objSpaceModel.paste(items, destination, act, function(data) {
					self.refresh(destination, function(data) {
						if (data.file != undefined) {
							for (var i = 0; i < data.file.length; i++) {
								objGrid.highLightNode(data.file[i].id);
							};
						}
						if (data.folder != undefined) {
							for (var i = 0; i < data.folder.length; iß++) {
								objGrid.highLightNode(data.file[i].id);
							};
						}

						for (var i = 0; i < arySource.length; i++) {
							objTree.deleteNode(arySource[i]);
						}

					}, data);
				});
			};

			this.rename = function() {
				var node = objGrid.getSelectedNodes();
				if (node.length > 0) node = $($(node)[0]);
				else if (node.length == 0) node = $(objTree.findNodeById(objTree.getSelectedNode())).parent();
				objLayout.rename(node, function() {
					var parentId = $(node).attr('data-parent');
					self.refresh(parentId);
				});
			};

			this.share = function() {
				objUltis.alert('Chưa hỗ trợ tính năng này');
				// var node = objGrid.getSelectedNodes();
				// var str = $(node).data('id')+$(node).data('name')+$(node).data('date');
				// var link = window.atob(appprofile.uhandler)+'file/'+objUltis.base64(str,'encode');
				// alertify.okBtn('Copy').cancelBtn('Hủy').defaultValue(link).prompt('Đường link chia sẻ', function (val, e) {
				// 	e.preventDefault();
				// 	var aux = document.createElement('input');
    //                 aux.setAttribute('value', val);
    //                 document.body.appendChild(aux);
    //                 aux.select();
    //                 document.execCommand("copy");
    //                 document.body.removeChild(aux);
				// });
				// var worker = new Worker(includeDir + 'pi.js');
				// var d = new Date();
				
				// worker.onmessage = function(e) {
				// 	console.log(e.data.PiValue);
				// 	console.log(d.getTime());
				// };
				// worker.onerror = function(e) {
				// 	console.log('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
				// 	console.log(d.getTime());
				// };

				// console.log(d.getTime());
				// //start the worker
				// worker.postMessage({
				// 	'cmd': 'CalculatePi',
				// 	'value': 1000000000
				// });
			};

			this.preview = function() {
				var node = objGrid.getSelectedNodes();
				if (node.length > 0) node = $($(node)[0]);
				if ($(node).attr('data-type') == 'directory') return;
				$(node).trigger('dblclick');
			};

			this.requestVideoPreview = function() {
				var node = objGrid.getSelectedNodes();
				if (node.length > 0) node = $($(node)[0]);
				var thumb = $(node).find('.has-thumb > img').attr('src');
				return thumb.replace('thumbnail.jpg', 'preview.mp4');
			};

			this.logout = function() {
				objSpaceModel.logout(function(result) {
					objTree.clearContent();
					objGrid.clearContent();
					submitCount = false;
					self.refresh();
				});
			};

			this.signinButtonClick = function() {
				var loginButton = $(o.toolsbar).find('BUTTON#btnLogout');
				if (appprofile != null) {
					self.logout();
				} else {
					objUser.showLogin();
				}
			};

			this.refresh = function(currDir, callback, callbackparam) {
				objUltis.clipBoard.clear();
				if (currDir == undefined) currDir = objTree.getSelectedNode();
				var selectedNode = objTree.findNodeById((currDir != undefined) ? currDir : rootDirId);

				if (selectedNode.length > 0) {
					self.openDir(selectedNode, function() {
						objTree.nodeClick(selectedNode, true);
						if (callback != undefined) {
							callback(callbackparam);
						}
					});
				} else {

				}
			};

			this.addonInsert = function() {};

			this.switchToListView = function() {
				objLayout.changeViewMode('list');
			};

			this.switchToGridView = function() {
				objLayout.changeViewMode('grid');
			};
			/**************************
			 * EVENT HANDLING - END *
			 *************************/

			var treeEventHandlers = {
				open: self.openDir,
				create: self.createDir,
				delete: self.delete,
				rename: self.rename,
				copy: self.copy,
				paste: self.paste,
				move: self.move,
				refresh: self.refresh
			};

			var gridEventHandlers = {
				select: self.selectItem,
				open: self.openDir,
				create: self.createDir,
				delete: self.delete,
				rename: self.rename,
				copy: self.copy,
				paste: self.paste,
				move: self.move,
				refresh: self.refresh
			};

			var init = function() {
				$('DIV#file-container.vsgrid').attr('unselectable', 'on')
					.css({
						'-moz-user-select': '-moz-none',
						'-moz-user-select': 'none',
						'-o-user-select': 'none',
						'-khtml-user-select': 'none',
						'-webkit-user-select': 'none',
						'-ms-user-select': 'none',
						'user-select': 'none'
					}).unbind('selectstart').bind('selectstart', function() {
						return false;
					}).unbind('click').bind('click', function(e) {
						objGrid.clearSelecteds();
						return false;
					}).unbind('contextmenu').bind('contextmenu', function(e) {
						if ($(this).find('.vscell.selected').length == 0) {
							objGrid.clearSelecteds();	
							var positionClick = {
		    					'x': e.pageX - 16,
		    					'y': e.pageY,
		    				};
							objLayout.showContextMenu($(this), objTree.getSelectedNode(), positionClick);
						}
					});

				objTree.setOptions('eventHandlers', treeEventHandlers);
				objGrid.setOptions('eventHandlers', gridEventHandlers);
				objTree.createRootNode();

				objSpaceModel.loadSpace(function(data) {
					appprofile = data.USER;
					self.refresh(null, function(data) {
						objLayout.setStatusBar();
					}, null);

				});

				objConnection.ping();
			};

			var getSelectedItems = function() {
				var selectedNode = objGrid.getSelectedNodes();
				var items = [];
				if (selectedNode.length > 0) {
					for (var i = 0; i < selectedNode.length; i++) {
						items[i] = $($(selectedNode)[i]).attr('data-id');
					}
				} else {
					var id = objTree.getSelectedNode();
					if (id != rootDirId) items[0] = objTree.getSelectedNode();
				}
				return items;
			};

			this.setOptions = function(opts) {
				o = opts;
			};

			this.getOptions = function(opt) {
				if (opt == null) return o;
				else {
					return eval('o.' + opt);
				}
			};

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});