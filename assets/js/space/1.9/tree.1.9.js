if(jQuery) (function($){
	$.extend($.fn, {
		violetTree : function (o) {
			if( !o ) var o = {};
			if( o.data == undefined ) o.data = null;
			if( o.rootName == undefined ) o.rootName = 'Thư mục gốc';

			if( o.draggable == undefined ) o.draggable = false;

			if( o.expandSpeed == undefined ) o.expandSpeed= 300;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 300;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.manager ==  undefined) o.manager = null;

			var treeNodes = [];
			var oContainer = this;
			var selectedNode = null;
			//var documentBoundEvent = false;
			var self = this;

			var createNode = function (node) {

				if( !node ) var node = {};
				if( node.item == undefined ) node.item = null; //item.id, item.name, item.parentID
				if( node.isRoot == undefined ) node.isRoot = false;
				if( node.defaultStatus == undefined ) node.defaultStatus = 0; //0: collapsed; 1:expanded;
				if( node.showContextMenu == undefined ) node.showContextMenu = true; //0: collapsed; 1:expanded;
				if (node.callback == undefined ) node.callback = null;

				var hc = hasChild(node.item.id);

				var nodeClass = node.isRoot == true ? 'home': ( hc == true ? 'directory-hc' : 'directory');
				var hidden = (node.isRoot == true || node.item.parentID == 0 ) ? null:'display:none';
				var defaulState = (node.isRoot == false && node.defaultStatus == 1 ) ? 'expanded' : 'collapsed';

				var a = $('<a></a>',{id: node.item.id,href: '#',rel: node.item.name,text: node.item.name});
				var li = $('<li></li>',{'class': nodeClass,rel: 'folder'})
																		.addClass(defaulState)
																		.append(a);
				var ul = null;
				bindNodeEvents(a);

				treeNodes[node.item.id] = {id:node.item.id, name:node.item.name, parentID:node.item.parentID, html:ul, status:defaulState, isRoot:node.isRoot};
				if (node.isRoot == true) {
					ul = $('<ul></ul>',{'class':'vstree',rel:'node-1',style:hidden}).append(li);
					$(oContainer).append(ul);
				}
				else {
					var preUL = $(oContainer).find('UL.vstree[rel^="node-1"]');

					if (preUL != null) {
						if (node.item.parentID == 0) {
							var groupUL = $(oContainer).find('UL.vstree[rel^="node0"]');
							if ($(groupUL).length == 0) {
								ul = $('<ul></ul>',{'class':'vstree',rel:'node0',style:hidden}).append(li);
								$(preUL).find('> LI.home').append(ul);
							}
							else {
								$(groupUL).append(li);
							}
						}
						else {
							var liArray = $(oContainer).find('UL.vstree LI[rel="folder"]');
							for (var i = 0; i < $(liArray).length; i++) {
								var id = $(liArray[i]).find('A').attr('id');

								if (id == node.item.parentID) {

									var groupUL = $(oContainer).find('UL.vstree[rel^="node' + id + '"]');
									if ($(groupUL).length == 0) {
										ul = $('<ul></ul>',{'class':'vstree',rel:'node'+node.item.parentID,style:hidden}).append(li);
										$(liArray[i]).append(ul);
									}
									else {
										$(groupUL).append(li);
									}
								}
							}
						}
					}
				}

				if (node.callback != null) node.callback(this);
				//return (parentNode.length == 1);
				return true;
			};

			var bindNodeEvents = function (node) {
				if (node == null) return false;

				//click event
				$(node).bind("click", function (e){if(e.button == 0)nodeClick(this);return false;});
				$(node).parent().bind("click", function (e){if(e.button == 0)nodeClick(node);return false;});
			};

			var nodeClick = function (node) {
				var folderID = $(node).attr('id');
				selectedNode = highlightNode(node);
				o.manager.setTreeCurrentNode(folderID);

				if (treeNodes[folderID].isRoot) {
					return;
				}
				if (treeNodes[folderID].status == 'collapsed') {
					expandNode(node);
					treeNodes[folderID].status = 'expanded';
				}
				else {
					collapseNode(node);
					treeNodes[folderID].status = 'collapsed';
				}

				o.manager.refreshStatusBar();
			};

			var highlightNode = function (node) {
				$(oContainer).find('.currentDir').removeClass('currentDir');
				$(node).addClass('currentDir');
				$(node).select();
				return node;
			}

			var expandNode = function (node) {
				var li = $(node).parent();
				var hc = hasChild($(node).attr('id'));
				var cls = hc ? 'expanded-hc' : 'expanded';
				$(li).find('> UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
				$(li).removeClass('collapsed').addClass(cls);
			};

			var collapseNode = function (node) {
				var li = $(node).parent();
				var hc = hasChild($(node).attr('id'));
				var cls = hc ? 'expanded-hc' : 'expanded';
				$(li).find('> UL').slideUp({ duration: o.expandSpeed, easing: o.expandEasing });
				$(li).removeClass(cls).addClass('collapsed');
			};

			var isCollapsedNode = function (node) {
				return $(node).parent().hasClass('collapsed');
			}

			var nodeIsExisted = function (nodeID) {
				var node = $(oContainer).find('UL.vstree LI.directory > A#' + nodeID + ', UL.vstree LI.directory-hc > A#' + nodeID);
				return ($(node).length > 0) ? node : false;
			}

			var initTree = function () {
				$(oContainer).attr('unselectable','on')
				     .css({'-moz-user-select':'-moz-none',
				           '-moz-user-select':'none',
				           '-o-user-select':'none',
				           '-khtml-user-select':'none',
				           '-webkit-user-select':'none',
				           '-ms-user-select':'none',
				           'user-select':'none'
				     }).bind('selectstart', function(){ return false;});

				if (o.data == null) {
					console.error(o.data, 'No directory to display!');
					return;
				}

				o.data.sort(function (a,b) {
					return a.parentID - b.parentID;
				});

				$(oContainer).find ('.vstree').remove();
				var homeNode = createNode({
					item: {id:0, name:o.rootName, parentID:-1},
					isRoot: true
				});

				if (homeNode && o.data.length > 0) {
					for (var i = 0; i < o.data.length; i++) {
						createNode ({item: o.data[i]});
					}
				}
				o.manager.setTreeCurrentNode(0);
			};

			var hasChild = function (id) {
				var result = false;
				for (var i = 0; i < o.data.length; i++) {
					if (o.data[i].parentID == id) {
						result = true;
						break;
					}
				}
				return result;
			}

			/******************
			 * RENAME - START *
			 ******************/
			var renameInit = function (node) {
				var editor = $('<input>',{class:'rename', type: 'text', value:$(node).text()});
				$(editor).bind('focusout', function(e){renameCancel(node)});
				$(editor).bind('keydown', function(e){
						var keycode = (e.keyCode ? e.keyCode : e.which);
						if (keycode == '27') {
							renameCancel(node);
						}else if(keycode == '13') renameComplete(node);
						e.stopPropagation();
					});

				$(node).text('');
				$(node).append(editor);
				$(editor).focus();
				$(editor).select();
			}

			var renameCancel = function (node) {
				var dirID = $(node).attr('id');
				$(node).find('>INPUT').remove();
				$(node).text(treeNodes[dirID].name);
				$(node).focus();
			}

			var renameComplete = function (node) {
				var editor = $(node).find('>INPUT');
				var id = $(node).attr('id');
				var idx = o.manager.searchItemByID(id, 'directory');
				var dir = o.data[idx];
				var name = dir.name;
				var newName = $(editor).val();

				var item = {
						id:id,
						name:name,
						type:'directory',
						parentID: dir.parentID,
						newName:newName
						};

				o.manager.rename(item);

				$(node).attr('rel', newName);
				$(node).text(newName);
				$(node).find('>INPUT').remove();
				/*treeNodes[id].name = newName;
				updateData(id, 'rename');*/
			}
			/******************
			 * RENAME - END *
			 ******************/

			/******************
			 * DELTE - START *
			 ******************/
			var destroyNode = function (node) {
				var nodeID = $(node).attr('id');
				$(node).parent().remove();
				delete treeNodes[nodeID];

				var parentNodeID = o.data[o.manager.searchItemByID(nodeID, 'directory')].parentID;
				console.log(parentNodeID);
				var hc = hasChild(parentNodeID);
				var parentNodeLI = $(oContainer).find('UL.vstree LI.directory > A#' + parentNodeID + ', UL.vstree LI.directory-hc > A#' + parentNodeID).parent();
				if (hc == false && parentNodeID != 0) $(parentNodeLI).removeClass('directory-hc').addClass('directory');
			}
			/******************
			 * DELTE - END    *
			 ******************/
			var updateData = function (id, act) {
				for (var i = 0; i < o.data.length; i++) {
					if (o.data[i].id == id) {
						if(act == 'deletion') {
							delete o.data[i];
						}
						else {
							o.data[i].name = treeNodes[id].name
							o.data[i].parentID = treeNodes[id].parentID;
						}
						break;
					}
				}

				o.manager.updateData({item:treeNodes[id], from:'tree', type:'directory', callback:act});
			}

			this.createNode = function (node) {
				createNode ({item: node});
				if (node.parentID != 0) {
					var parentNode = nodeIsExisted(node.parentID);
					$(parentNode).parent('LI').removeClass('directory').addClass('directory-hc');
					expandNode(parentNode);
				}
			}

			this.activeNode = function (node) {
				var dirID = $(node).attr('id');
				selectedNode = highlightNode(node);
				o.manager.setTreeCurrentNode(dirID);
				expandNode(node);
				$(node).select();
			}

			this.refeshTree = function () {
				//for (var i = 0; i < o.data.length; i++) {
				for (var i in o.data) {
					var node = nodeIsExisted(o.data[i].id);
					var defaulState = isCollapsedNode(node) ? 0:1;
					if (node == false) {
						createNode ({item: o.data[i],defaulState:defaulState});
					}
					else {
						var node = $(oContainer).find('UL.vstree LI.directory > A#' + o.data[i].id + ',UL.vstree LI.directory-hc > A#' + o.data[i].id);
						$(node).text(o.data[i].name);
					}
				}

				o.manager.setTreeCurrentNode($(selectedNode).attr('id'));
			}

			this.getSelectedNode = function () {
				return selectedNode;
			}

			this.deletion = function (id) {
				destroyNode($(oContainer).find('A#'+id));
			}

			this.findNodebyID = function (id) {

			}

			this.setData = function (data) {
				o.data = null;
				o.data = data;
			}

			this.getRoot = function () {
				return treeNodes[0];
			}

			this.createCopyNode = function (data) {
				for(var i in data) {
					createNode ({item: data[i]});
				}
				self.refeshTree();
			}

			this.rename = function (key) {
				if (selectedNode == null || $(selectedNode).attr('id') == 0) return false;
				if (key == 113) {
					renameInit(selectedNode);
				}
				else if (key == 27) {
					renameCancel(selectedNode);
				}

				return true;
			}

			this.getRootName = function () {
				return o.rootName;
			}

			this.initialize = function () {
				initTree();
				return this;
			};

			return this.initialize();
		}
	});
})(jQuery);