$.extend(
    $.fn, {
        vsViewLayout: function(o) {
            if (o == null) o = {};
            if (o.maincontainer == undefined)
                o.maincontainer = $('DIV#file-container.vsgrid');
            if (o.titlebar == undefined)
                o.titlebar = $('DIV#navbar');
            if (o.toolbar == undefined)
                o.toolbar = $('DIV#tool-bar');
            if (o.statusbar == undefined)
                o.statusbar = $('DIV#status-bar');
            if (o.navigationbar == undefined)
                o.navigationbar = $('DIV#navigation-bar');
            if (o.tree == undefined)
                o.tree = $('DIV#treeview-container');
            if (o.grid == undefined)
                o.grid = $('DIV#file-container');

            var btnListView = $('.show-list-view');
            var btnGridView = $('.show-grid-view');

            var dropZone = $('DIV#drop-zone');

            var aryButtons = $(o.toolbar).find('BUTTON');

            var aryBreadcrumb = [];

            var maxWidth = 0;

            var self = this;

            var init = function() {
                layoutRender();

                $('html').bind('contextmenu', function(e){
                    return false;
                })

                $(aryButtons).each(function(index) {
                    var button = this;
                    var func = $(button).attr('data-act');
                    if ($(button).attr('id') == 'btnTinyMCE' && mode == 'plugin') {
                        $(button).show();
                    }

                    $(button).bind('click', function(e) {
                        if ($(button).attr('id') == 'btnLogout') {
                            objController.signinButtonClick();
                        } else if ($(button).attr('id') == 'btnTinyMCE' && mode == 'plugin') {                            
                            objConnector.preview();
                        } else {
                            eval('objController.' + func + '();');
                        }
                    });
                });

                $(btnListView).bind('click', function(e) {
                    objController.switchToListView();
                });

                $(btnGridView).bind('click', function(e) {
                    objController.switchToGridView();
                });

                documentEventsBinding();

                $(o.tree).parent().resizable({
                    maxWidth: maxWidth,
                    minWidth: 220,
                    handles: "e",
                    resize: function(event, ui) {
                        layoutRender();
                    }
                });

                $(window).resize(function() {
                    layoutRender();
                    $(o.tree).parent().resizable({
                        maxWidth: maxWidth
                    });
                    //objLightBox.calculate();
                });
            };

            var documentEventsBinding = function() {
                $(document).bind('keydown', function(e) {
                    switch (e.which) {
                        case 13:
                            objController.preview();
                            break;
                        case 65:
                            //select all
                            if (e.ctrlKey) {
                                objGrid.selectAllNode();
                            }
                            break;
                        default:
                            break;
                    };
                });
            };

            var getDirTreeMaxWidth = function() {
                var scrWidth = $(document).width();
                return parseInt(scrWidth / 3);
            };

            var layoutRender = function() {
                var scrHeght = $(window).innerHeight();
                var dirTreeHeight = scrHeght - $(o.titlebar).height() - $(o.toolbar).height() - $(o.statusbar).height() - 5;
                var tree = $(o.tree);
                var grid = $(o.grid);
                tree.parent().height(dirTreeHeight);
                grid.parent().height(dirTreeHeight);
                grid.parent().width('calc(100% - ' + (tree.parent().width() + 8) + 'px)');
                maxWidth = getDirTreeMaxWidth();
                $(o.tree).height(dirTreeHeight - 5);
            };

            var renameInit = function(node) {
                var id = $(node).attr('data-id');
                var input = $('<input />', {
                    type: 'text',
                    name: 'newname',
                    id: 'txtNewName',
                    width: '100%',
                    value: $(node).attr('data-name')
                });

                $(input).bind('focusout', function(e) {
                    renameCancel(node);
                }).bind('keydown', function(e) {
                    var keycode = (e.keyCode ? e.keyCode : e.which);
                    if (keycode == '27') {
                        renameCancel(node);
                    } else if (keycode == '13') {
                        renameComplete(node);
                    }
                    e.stopPropagation();
                });

                $(input).insertBefore($(node).find('A[data-id="' + id + '"]'));
                $(node).find('A[data-id="' + id + '"]').hide();
                $(input).focus();
                $(input).select();
            };

            var renameCancel = function(node) {
                var id = $(node).attr('data-id');
                $(node).find('A[data-id="' + id + '"]').show();
                $(node).find('INPUT').remove();
            }

            var renameComplete = function(node) {
                var input = $(node).find('INPUT');
                var id = $(node).attr('data-id');
                var newName = $(input).val();

                objSpaceModel.rename(id, newName, function() {
                    $(node).find('INPUT').parent().append($('<a></a>', {
                        'data-id': $(node).attr('data-id'),
                        id: $(node).attr('data-id'),
                        text: newName
                    }));
                    $(node).find('INPUT').remove();

                    objController.refresh($(node).attr('data-parent'));
                });
            };

            /******************
             * CHANGE VIEW MODE - START *
             ******************/
            var sortList = function(sortby, direction) {
                var liArray = $('ul.vsgrid').find('li.vscell');
                var container = $('ul.vsgrid');

                liArray.sort(function(a, b) {
                    var an = $(a).attr('data-' + sortby);
                    var bn = $(b).attr('data-' + sortby);

                    if (sortby == 'name') {
                        an = objUltis.removeVietnameseSign(an);
                        bn = objUltis.removeVietnameseSign(bn);
                    } else if (sortby == 'size') {
                        an = parseInt(an);
                        bn = parseInt(bn);
                    }

                    if (direction == 'asc' && an > bn) return 1;
                    if (direction == 'asc' && an < bn) return -1;
                    if (direction == 'desc' && an > bn) return -1;
                    if (direction == 'desc' && an < bn) return 1;
                });

                $(liArray).detach().appendTo(container);
            };

            this.showListViewHeader = function() {
                var icon = $('<div></div>', {
                    'class': icon
                });
                var hFilename = $('<div></div>', {
                    class: 'grid-col-header-filename',
                    'data-fieldname': 'name',
                    text: 'Thư mục/File'
                });
                var hSize = $('<div></div>', {
                    class: 'grid-col-header-size',
                    'data-fieldname': 'size',
                    text: 'Dung lượng'
                });
                var hMineType = $('<div></div>', {
                    class: 'grid-col-header-minetype',
                    'data-fieldname': 'type',
                    text: 'Loại'
                });
                var hDate = $('<div></div>', {
                    class: 'grid-col-header-date',
                    'data-fieldname': 'date',
                    text: 'Thời gian cập nhật'
                });
                var hidden = (viewMode == 'grid' ? 'none' : 'inline');
                var li = $('<li></li>', {
                    'class': 'grid-col-header'
                }).append(icon, hFilename, hSize, hMineType, hDate);
                $(li).css({
                    'display': hidden
                });
                return li;
            };

            this.changeViewMode = function(mode) {
                viewMode = mode;
                var hidden = (viewMode == 'grid' ? 'hidden' : 'visible');
                if (mode == 'list') {
                    $(o.maincontainer).addClass('list-view');
                } else {
                    $(o.maincontainer).removeClass('list-view');
                }

                $(o.maincontainer).find('.grid-col-header').css({
                    'display': (viewMode == 'grid' ? 'none' : 'inline')
                });
                $(o.maincontainer).find('.size-column').css({
                    'visibility': hidden
                });
                $(o.maincontainer).find('.minetype-column').css({
                    'visibility': hidden
                });
                $(o.maincontainer).find('.date-column').css({
                    'visibility': hidden
                });
            };

            this.binColHeaderEvent = function() {
                var colArray = $(o.maincontainer).find("[class^='grid-col-header-']");
                for (var i = 0; i < $(colArray).length; i++) {
                    var col = colArray[i];
                    $(col).bind('click', function(e) {
                        colHeaderClick(this, e)
                    });
                }
            };

            var colHeaderClick = function(node, event) {
                var colArray = $(o.maincontainer).find("[class^='grid-col-header-']");
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
                } else {
                    $(node).addClass('sort-as');
                    direction = 'asc';
                }

                sortList(sortby, direction);

            };

            /******************
             * CHANGE VIEW MODE - END *
             ******************/

            this.rename = function(node) {
                renameInit(node);
            }

            this.showCreateFolderDlg = function(callback) {
                alertify.okBtn('Tạo').cancelBtn('Hủy').prompt('Nhập tên thư mục', function (val, ev) {
                    ev.preventDefault();
                    var newFolderName = val.trim();
                    var destination = objTree.getSelectedNode();
                    objSpaceModel.createFolder(newFolderName, destination);
                })
            };

            this.showDeleteConfirm = function(aryId) {
                var message = 'Bạn có chắc chắn muốn xóa [cusmsg] không?';
                var rpStr = '';
                if (aryId.length == 1) {
                    var node = objGrid.findNodeById(aryId[0]).attr('data-id') == undefined ? $(objTree.findNodeById(aryId[0])).parent() : objGrid.findNodeById(aryId[0]);
                    var type = $(node).attr('data-type') == 'directory' ? 'thư mục' : 'file';
                    rpStr = type + ' <strong>' + $(node).attr('data-name') + '</strong>';
                } else {
                    rpStr = '<strong>' + aryId.length + '</strong>' + ' file/thư mục đã chọn'
                }

                alertify.okBtn('Xóa').cancelBtn('Không').confirm(message.replace('[cusmsg]', rpStr), function () {
                    objSpaceModel.delete(aryId, function() {
                        var node = objGrid.findNodeById(aryId[0]).attr('data-id') == undefined ? $(objTree.findNodeById(aryId[0])).parent() : objGrid.findNodeById(aryId[0]);
                        objController.refresh($(node).attr('data-parent'));
                        objUltis.notification('File '+rpStr+' đã xóa');
                    })
                })
            };

            this.bindActContextMenu = function(node) {
                node.each(function() {
                    var element = $(this);
                    var func = element.data('act');
                    var active = element.attr('data-active');
                    if (active == undefined || active == 1) {
                        element.unbind('click').bind('click', function(e) {
                            eval('objController.' + func + '();');
                        })
                    }
                })
            }

            this.showContextMenuFile = function(node, position) {
                var html = '<ul class="context-menu" style="top:'+position.y+'px;left:'+position.x+'px">'
                    +'<li data-act="share">Chia sẻ</li>'
                    +'<li data-act="download">Tải xuống</li>'
                    +'<li data-act="copy">Sao chép</li>'
                    +'<li data-act="move">Cắt</li>'
                    +'<li data-act="rename">Đổi tên</li>'
                    +'<li data-act="delete">Xóa</li>'
                +'</ul>';
                node.append(html);
                self.bindActContextMenu($('.context-menu > li'));
            };

            this.showContextMenu = function(container, node, position) {
                
                var html = '<ul class="context-menu" style="top:'+position.y+'px;left:'+position.x+'px">'
                    +'<li data-act="upload">Tải lên</li>'
                    +'<li data-act="createDir">Tạo thư mục mới</li>'
                    +'<li data-act="paste" data-active="'+hasCopy+'">Dán</li>'
                    +'<li data-act="share">Chia sẻ</li>'
                +'</ul>';
                container.append(html);
                self.bindActContextMenu($('.context-menu > li'));
            };

            this.showToolbar = function(node) {
                var button = $('.file-action-group');
                button.children('button[data-act="paste"]').attr('data-active', hasCopy);
                button.children('span:first-child').html(node.name);
                if (node.type == 'directory') button.children('button[data-act="download"]').hide()
                else {
                    button.children('button[data-act="download"]').show();
                    button.children('span:last-child').html(objUltis.formatFileSize(node.size))
                }
                button.css('display','inline');
                self.bindActContextMenu(button.children());
            };

            this.setBreadcrumb = function() {
                var currId = objTree.getSelectedNode();
                var node = objTree.findNodeById(currId);
                var aryTreeBrand = objTree.findTreeBrand(node);
                var container = $('ul.breadcrumb');
                $(container).empty();

                for (var i = aryTreeBrand.length - 1; i >= 0; i--) {
                    var item = null;
                    if (i == aryTreeBrand.length - 1) {
                        item = $('<li></li>').append($('<i></i>', {
                            'class': 'ace-icon fa fa-folder home-icon'
                        }), $('<a></a>', {
                            href: '',
                            text: $(aryTreeBrand[i]).text()
                        }));
                    } else {
                        item = $('<li></li>').append($('<a></a>', {
                            href: '',
                            text: $(aryTreeBrand[i]).text()
                        }));
                    }

                    var data = jQuery.hasData($(aryTreeBrand[i])[0]) && jQuery._data($(aryTreeBrand[i])[0]);
                    $(item).find('A').bind('click', data.events.click[0].handler);

                    $(container).append(item);
                }
            };

            this.setStatusBar = function() {
                var quotaUnit = (appprofile.SPACE.used/appprofile.SPACE.total) * 100;
                $('.data-used').html(objUltis.formatFileSize(appprofile.SPACE.used)+' / '+objUltis.formatFileSize(appprofile.SPACE.total)+' đã sử dụng');
                $('.quota-bar').css('width', quotaUnit+'%');
            };

            this.changeLoginButtonStatus = function() {
                var userMenu = $(o.toolbar).find('.user');
                if (appprofile != null) {
                    userMenu.show();
                    userMenu.find('span').html(appprofile.username+' <b class="caret"></b>');
                } else userMenu.hide();
            };

            this.setLoading = function() {
                $('body').removeClass('loaded')
            };

            this.loaded = function() {
                $('body').addClass('loaded')
            };

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