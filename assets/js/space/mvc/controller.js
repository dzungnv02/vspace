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

			};

			this.copy = function() {
				var items = getSelectedItems();
				objUltis.clipBoard.put(items);
				objUltis.clipBoard.do('copy');
			};

			this.move = function() {
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
					console.log(parentId);
					self.refresh(parentId);
				});
			};

			this.share = function() {

			};

			this.preview = function() {

			};

			this.logout = function() {

			}

			this.refresh = function(currDir, callback, callbackparam) {
				if (currDir == undefined) currDir = objTree.getSelectedNode();
				var selectedNode = objTree.findNodeById((currDir != undefined) ? currDir : rootDirId);

				if (selectedNode.length > 0) {
					self.openDir(selectedNode, function() {
						objTree.nodeClick(selectedNode, true);
						if (callback != undefined) {
							callback(callbackparam);
						}
					});
				}
				else {

				}
			};

			this.addonInsert = function() {};
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
					});


				objTree.setOptions('eventHandlers', treeEventHandlers);
				objGrid.setOptions('eventHandlers', gridEventHandlers);
				objTree.createRootNode();

				objSpaceModel.loadSpace(function(data) {
					appprofile = data.USER;
					self.refresh();				
				});

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