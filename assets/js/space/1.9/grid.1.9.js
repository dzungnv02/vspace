if(jQuery) (function($){
	$.extend($.fn, {
		violetGrid : function (o) {
			if( !o ) var o = {};
			if( o.data == undefined ) o.data = null;
			if( o.draggable == undefined ) o.draggable = false;
			if( o.manager ==  undefined) o.manager = null;

			var oContainer = this;
			var documentBoundEvent = false;
			var posTopArray = [];
			var posLeftArray = [];
			var self = this;
			var viewMode = 'grid';

			var initialW = 0;
			var initialH = 0;

			var createNode = function (node) {
				if( !node ) var node = {};
				if( node.item == undefined ) node.item = null; //item.id, item.name, item.parentID
				if( node.isDirectory == undefined ) node.isDirectory = false;
				if( node.showContextMenu == undefined ) node.showContextMenu = true;

				var icon = (node.item.minetype != undefined) ? 'icon-' + node.item.minetype: 'icon-directory';
				var type = (node.item.minetype != undefined) ? node.item.minetype: 'directory';
				var date = type == 'directory' ? node.item.mdate : node.item.mdate;
				var thumb = null;
				var filehosting = o.manager.getFileHosting();
                var filedomain = o.manager.getFileDomain();

                thumb = node.item.thumbnail != '' ? $('<img>', {src:node.item.thumbnail,align:'middle'}): null;

                var div = $('<div></div>',{'class':icon});
                $(div).append(thumb);

				var typeid = type == 'directory' ? 'directory':'file';

				var size = typeid == 'file' ? o.manager.formatFileSize(node.item.size, 1) : 'n/a';

				var inputID = $('<input />',{'class':'id', type:'hidden',value:node.item.id});
				var inputName = $('<input />',{'class':'name',type:'hidden',value:node.item.name});

				var inputFileUrl = $('<input />',{'class':'fileurl',type:'hidden',value: node.item.fileurl});
				var inputParent = $('<input />',{'class':'parentID',type:'hidden',value:node.item.parentID});
				var inputType = $('<input />',{'class':'type',type:'hidden',value:typeid});

				var a = $('<a></a>',{id: node.item.id,href: '#',rel: node.item.name,text: node.item.name});
				var divLink = $('<div></div>',{'class':'file-name'}).append(a,inputID,inputName,inputParent,inputType,inputFileUrl);

				var divSize = $('<div></div>',{class:'size-column',style:'visibility:' + (viewMode == 'list' ? 'visible':'hidden'), text:size});

				var divMineType = $('<div></div>',{class:'minetype-column',style:'visibility:' + (viewMode == 'list' ? 'visible':'hidden'), text: (type == 'directory' ? 'Thư mục':type)});
				var divDate = $('<div></div>',{class:'date-column',style:'visibility:' + (viewMode == 'list' ? 'visible':'hidden'), text:date});
				var li = $('<li></li>',{'class':'vscell',id:typeid+node.item.id, 'data-name':node.item.name, 'data-size':(type == 'directory' ? 0: node.item.size), 'data-type':(type == 'directory' ? 'Thư mục':type), 'data-date':date}).append(div,divLink,divSize,divMineType,divDate);

				bindNodeEvents(li);

				return li;
			}

			var showListViewHeader = function () {
				var icon = $('<div></div>',{'class':icon});
				var hFilename = $('<div></div>', {class:'grid-col-header-filename', 'data-fieldname': 'name', text:'Thư mục/File'});
				var hSize = $('<div></div>', {class:'grid-col-header-size', 'data-fieldname': 'size', text:'Dung lượng'});
				var hMineType = $('<div></div>', {class:'grid-col-header-minetype', 'data-fieldname': 'type', text:'Loại'});
				var hDate = $('<div></div>', {class:'grid-col-header-date', 'data-fieldname': 'date', text:'Thời gian cập nhật'});
				var hidden = (viewMode == 'grid' ? 'none':'inline');
				var li = $('<li></li>',{'class':'grid-col-header'}).append(icon,hFilename,hSize,hMineType,hDate);
				$(li).css({'display':hidden});
				return li;
			}

			var changeViewMode = function (mode) {
				viewMode = mode;
				var hidden = (viewMode == 'grid' ? 'hidden':'visible');
				if (mode == 'list') {
					$(oContainer).addClass('list-view');
				}
				else {
					$(oContainer).removeClass('list-view');
				}

				$(oContainer).find('.grid-col-header').css({'display':(viewMode == 'grid' ? 'none':'inline')});
				$(oContainer).find('.size-column').css({'visibility':hidden});
				$(oContainer).find('.minetype-column').css({'visibility':hidden});
				$(oContainer).find('.date-column').css({'visibility':hidden});
			}

			var binColHeaderEvent = function () {
				var colArray = $(oContainer).find("[class^='grid-col-header-']");
				for (var i = 0; i < $(colArray).length; i++) {
					var col = colArray[i];
					$(col).bind('click', function (e){colHeaderClick(this,e)});
				}
			}

			var colHeaderClick = function (node, event) {
				var colArray = $(oContainer).find("[class^='grid-col-header-']");
				for (var i = 0; i < $(colArray).length; i++) {
					var col = colArray[i];
					if (col !== node) $(col).removeClass('sort-as').removeClass('sort-ds');
				}

				var sortby = $(node).attr('data-fieldname');
				var direction = null;

				if ($(node).hasClass('sort-as')) {
					$(node).removeClass('sort-as');
					$(node).addClass('sort-ds');
					direction = 'desc';
				}
				else {
					$(node).addClass('sort-as');
					direction = 'asc';
				}

				sortList(sortby, direction);

			}

			var bindNodeEvents = function (node) {
				var type = $(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="type"]').val();
				$(node)
					.bind("click", function (e){						
						nodeClick(this,e);
						$(node).trigger('item:selected');
						return false;
					})
					.bind("dblclick", function (e){nodeDblClick(this,e);return false;})
			}

			var nodeClick = function (node, event) {
				var message = '';
				if (event.ctrlKey) {
					if (!isHighLight(node))
						highlightNode(node);
					else
						clearHighLightNode(node);
				}
				else if (event.shiftKey) {
					var firstItem = $(oContainer).find('LI.selected');
					var aryNode = $(oContainer).find('> UL > LI');
					var start = aryNode.index(firstItem);
					var finish = aryNode.index(node);
					aryNode.slice(Math.min(start, finish), Math.max(start, finish) + 1).each( function (i,o){highlightNode(o);});
				}
				else {
					clearAllHighLightNode(node);
					highlightNode(node);
				}

				o.manager.refreshStatusBar();
			}


			var nodeDblClick = function (node) {

				var nodeObj = {id:$(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="id"]').val(),
				fileurl: $(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="fileurl"]').val(),
                                name: $(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="name"]').val(),
							parentID: $(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="parentID"]').val(),
							minetype: $(node).find('> DIV[class^="file-name"] > INPUT[type="hidden"][class^="type"]').val()};

				o.manager.gridNodeDblClick(nodeObj);
			}

			var highlightNode = function (node) {
				$(node).addClass('selected');
			}

			var isHighLight = function (node) {
				return $(node).hasClass('selected');
			}

			var clearAllHighLightNode = function () {
				$(oContainer).find('> UL > LI').removeClass('selected');
			}

			var clearHighLightNode = function (node) {
				$(node).removeClass('selected');
			}

			var highLightAllNode = function () {
				clearAllHighLightNode();
				$(oContainer).find('> UL > LI').addClass('selected');
			}

			var getAllHighLightNode = function () {
				return $(oContainer).find('> UL > LI.selected');
			}

			var maskedMove = function (node) {
				$(node).removeClass('selected');
				$(node).addClass('masked');
			}

			var unMaskedMove = function () {
				$(node).removeClass('masked');
			}

			var unMaskedMoveAll = function () {
				$(oContainer).find('> UL > LI').removeClass('masked');
			}

			var initGrid = function () {
				$(oContainer).attr('unselectable','on')
				     .css({'-moz-user-select':'-moz-none',
				           '-moz-user-select':'none',
				           '-o-user-select':'none',
				           '-khtml-user-select':'none',
				           '-webkit-user-select':'none',
				           '-ms-user-select':'none',
				           'user-select':'none'
				     }).bind('selectstart', function(){ return false;
				     }).bind('click', function(e){clearAllHighLightNode(); return false;});

				var ul = $('<ul></ul>',{'class':'vsgrid'});
				$(ul).append(showListViewHeader());

				var parentDirID = o.manager.getTreeCurrentNode();

				if (o.data.DIRECTORIES.length > 0) {
					for (var d in o.data.DIRECTORIES) {
						if (o.data.DIRECTORIES[d].parentID == parentDirID) {
							var li = createNode ({item: o.data.DIRECTORIES[d]});
							$(ul).append(li);
						}
					}
				}

				if (o.data.FILES.length > 0) {
					for (var f in o.data.FILES) {
						if (o.data.FILES[f].parentID == parentDirID) {
							var aryImageType = ['jpg', 'png', 'gif', 'bmp'];
							if ($.inArray(o.data.FILES[f].minetype, aryImageType) > -1) {
								preloadImages(o.data.FILES[f].fileurl);
							}
							var li = createNode ({item: o.data.FILES[f]});
							$(ul).append(li);
						}
					}
				}

				$(oContainer).find ('UL').remove();
				$(oContainer).append(ul);
				binColHeaderEvent();
				o.manager.refreshNavigator();
			}

			var destroyNode = function (node) {
				$(node).remove();
			}

			var preloadImages = function(src) {
				$("<img />").attr("src", src);
			}

			/******************
			 * SORT LIST - START *
			 ******************/
			var sortList = function (sortby, direction) {
				var liArray = $('ul.vsgrid').find('li.vscell');
				var container = $('ul.vsgrid');

				liArray.sort(function(a,b){
					var an = $(a).attr('data-' + sortby);
					var bn = $(b).attr('data-' + sortby);

					if (sortby == 'name') {
						an = o.manager.removeVietnameseSign(an);
						bn = o.manager.removeVietnameseSign(bn);
					}else if (sortby == 'size') {
						an = parseInt(an);
						bn = parseInt(bn);
					}

					if (direction == 'asc' && an > bn) return 1;
					if (direction == 'asc' && an < bn) return -1;
					if (direction == 'desc' && an > bn) return -1;
					if (direction == 'desc' && an < bn) return 1;
				});

				$(liArray).detach().appendTo(container);
			}

			/******************
			 * SORT LIST - END *
			 ******************/

			/******************
			 * RENAME - START *
			 ******************/
			var renameInit = function (node) {
				var editor = $('<input />',{'class':'rename', type: 'text', value:$(node).text()});
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
				//$(editor).select();
			}

			var renameCancel = function (node) {
				var nodeID = $(node).parent().find('> INPUT[type="hidden"][class^="id"]').val();
				var nodeType = $(node).parent().find('> INPUT[type="hidden"][class^="type"]').val();
				var nodeName = $(node).parent().find('> INPUT[type="hidden"][class^="name"]').val();
				var nodeParent = $(node).parent().find('> INPUT[type="hidden"][class^="parentID"]').val();
				var itemIndex =  o.manager.searchItemByID(nodeID, nodeType == 'directory' ? nodeType:'file');

				$(node).find('>INPUT').remove();
				$(node).text(nodeName);
				$(node).select();
			}

			var renameComplete = function (node) {
				var editor = $(node).find('>INPUT');
				var id = $(node).attr('id');
				var newName = $(editor).val();
				var item = {
						id:id,
						name:$(node).parent().find('> INPUT[type="hidden"][class^="name"]').val(),
						type:$(node).parent().find('> INPUT[type="hidden"][class^="type"]').val(),
						parentID:$(node).parent().find('> INPUT[type="hidden"][class^="parentID"]').val(),
						newName:newName
						};

				o.manager.rename(item);

				$(node).attr('rel', newName);
				$(node).text(newName);
				$(node).find('>INPUT').remove();

			}

			/******************
			 * RENAME - END *
			 ******************/

			this.reloadGrid = function () {
				initGrid();
			}

			this.setData = function (data) {
				o.data = data;
			}

			this.createNode = function (node) {
				var node = createNode ({item: node});
				$(oContainer).find ('UL').append(node);
			}

			this.deletion = function (id, type) {
				destroyNode($(oContainer).find('LI#'+type+id));
			}

			this.rename = function (key) {
				var highlightedNodes = self.getHighLightItem();
				if ($(highlightedNodes).length == 0 || $(highlightedNodes).length > 1) return false;

				var nodeID = $(highlightedNodes).get(0).id;
				var nodeType = $(highlightedNodes).get(0).type;

				var selectedNode = $(oContainer).find('LI#' + nodeType + nodeID + '.vscell > DIV.file-name > A#' + nodeID);
				if (key == 113) {
					renameInit(selectedNode);
				}
				else if (key == 27) {
					renameCancel(selectedNode);
				}

				return true;
			}

			this.getHighLightItem = function () {
				var nodeSelected = $(oContainer).find('LI.vscell.selected');
				var items = [];

				if ($(nodeSelected).length > 0) {
					$(nodeSelected).each (function(i,obj) {
							var id = $(this).find('> DIV.file-name > INPUT[type="hidden"][class^="id"]').val();
							var type = $(this).find('> DIV.file-name > INPUT[type="hidden"][class^="type"]').val();
							var item = type == 'directory' ? o.data.DIRECTORIES[o.manager.searchItemByID(id, type)] : o.data.FILES[o.manager.searchItemByID(id, type)];
							item.type = type;
							items.push(item);
						});
				}

				return items;
			}

			this.setHighLightNode = function (id, type) {
				var node = $(oContainer).find('LI#'+type+id);
				highlightNode(node);
			}

			this.selectAllNode = function () {
				highLightAllNode();
			}

			this.maskedMoveItem = function (id, type) {
				var node = $(oContainer).find('LI#'+type+id);
				maskedMove(node);
			}

			this.unMaskedMoveItem = function (id, type) {
				var node = $(oContainer).find('LI#'+type+id);
				unMaskedMove(node);
			}

			this.clearAllMasked = function () {
				unMaskedMoveAll();
			}

			this.setViewMode = function (mode) {
				changeViewMode(mode);
			}

			this.initialize = function () {
				initGrid();
				return this;
			};

			return this.initialize();
		}
	});
})(jQuery);