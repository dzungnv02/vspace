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
				});
			};

			this.createDir = function() {
				objLayout.showCreateFolderDlg(function() {});
			};

			this.delete = function() {
				var selectedNodes = objGrid.getSelectedNodes();
				if (selectedNodes.length > 0) {
					var aryId = [];
					$(selectedNodes).each(function(idx) {
						aryId[idx] = $($(selectedNodes)[idx]).attr('data-id');
					});
					objLayout.showDeleteConfirm(aryId);
				}
			};

			this.upload = function() {

			};

			this.download = function() {

			};

			this.copy = function() {

			};

			this.move = function() {

			};

			this.paste = function() {

			};

			this.rename = function() {

			};

			this.share = function() {

			};

			this.preview = function() {

			};

			this.refresh = function() {
				var selectedNode = objTree.findNodeById(objTree.getSelectedNode());					
				self.openDir(selectedNode, function() {
					objTree.nodeClick(selectedNode, true);
				});
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
				objTree.setOptions('eventHandlers', treeEventHandlers);
				objGrid.setOptions('eventHandlers', gridEventHandlers);
				objTree.createRootNode();

				objSpaceModel.getListItemsByParentId(rootDirId, function(data) {
					objTree.renderTreeBranch(data, rootDirId);
					objGrid.renderGrid(data);
				});
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