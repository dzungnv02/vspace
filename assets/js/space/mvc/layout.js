$.extend(
    $.fn, {
        vsViewLayout: function(o) {
            if (o == null) o = {};
            if (o.maincontainer == undefined)
                o.maincontainer = $('DIV#file-container.vsgrid');
            if (o.titlebar == undefined)
                o.titlebar = $('DIV#navbar');
            if (o.toolsbar == undefined)
                o.toolsbar = $('DIV#tools-bar');
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

            var aryButtons = $(o.toolsbar).find('BUTTON');

            var aryBreadcrumb = [];

            var maxWidth = 0;

            var self = this;

            var init = function() {
                layoutRender();
                $(aryButtons).each(function(index) {
                    var button = this;
                    var func = $(button).attr('data-act');

                    $(button).bind('click', function(e) {
                        if ($(button).attr('id') == 'btnLogout') {
                            objController.signinButtonClick();
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
                    objLightBox.calculate();
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
                var dirTreeHeight = scrHeght - $(o.titlebar).height() - $(o.toolsbar).height() - $(o.statusbar).height() - 5;
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

            var validateCreateFolder = function(foldername, customErr) {
                if (customErr == undefined) customErr = null;
                var errMsg = '';
                var objErr = $('FORM#createFolderForm DIV.help-block[for="foldername"]');
                $(objErr).text('').hide();
                $(objErr).parent().parent().removeClass('has-error');

                if (customErr == null) {
                    if (foldername == '') {
                        errMsg = 'Bạn hãy nhập tên thư mục!';
                    }
                } else {
                    errMsg = customErr.err;
                }

                if (errMsg != '') {
                    $(objErr).text(errMsg).show();
                    $(objErr).parent().parent().addClass('has-error');
                    $(objErr).parent().find('INPUT').focus();
                    return false;
                } else return true;
            };

            this.rename = function(node) {
                renameInit(node);
            }

            this.showCreateFolderDlg = function(callback) {
                var formHTML = '<form id="createFolderForm" action="#" name="createFolderForm" method="POST" class="form-horizontal">';
                formHTML += '    <div class="form-group">';
                formHTML += '		<div class="col-xs-9">';
                formHTML += '			<input type="text" class="form-control" name="foldername" placeholder="Nhập tên thư  mục" />';
                formHTML += '			<div class="help-block" style="display:none" for="foldername"></div>';
                formHTML += '		</div>';
                formHTML += '		<div class="col-xs-3">';
                formHTML += '			<button id="btnOK" type="button" class="btn btn-success btn-sm">OK</button>';
                formHTML += '		</div>';
                formHTML += '	</div>';
                formHTML += '</form>';

                var dlg = bootbox.dialog({
                        title: 'Tạo thư mục',
                        message: formHTML,
                        show: false
                    })
                    .on('shown.bs.modal', function() {
                        $(this).find('FORM#createFolderForm').find('INPUT').focus();
                    })
                    .on('hide.bs.modal', function(e) {})
                    .modal('show');

                $(dlg).find('DIV.modal-dialog').css('width', '350px');
                var btnOK = $(dlg).find('DIV.modal-dialog FORM#createFolderForm BUTTON#btnOK');
                var form = $(dlg).find('DIV.modal-dialog FORM#createFolderForm');

                $(btnOK).unbind('click').bind('click', function(e) {
                    $(form).submit();
                });

                $(form).on('submit', function(e) {
                    e.preventDefault();
                    var newFolderName = $(dlg).find('FORM#createFolderForm INPUT[name="foldername"]').val().trim();
                    var destination = objTree.getSelectedNode();
                    objSpaceModel.createFolder(newFolderName, destination, dlg, validateCreateFolder);
                });
            };

            this.showDeleteConfirm = function(aryId) {
                var message = 'Bạn có chắc chắn muốn xóa [cusmsg] không?';
                var rpStr = '';
                if (aryId.length == 1) {
                    var node = objGrid.findNodeById(aryId[0]).attr('data-id') == undefined ? $(objTree.findNodeById(aryId[0])).parent() : objGrid.findNodeById(aryId[0]);
                    var type = $(node).attr('data-type') == 'directory' ? 'thư mục' : 'file';
                    rpStr = type + ' <strong style="color:red">' + $(node).attr('data-name') + '</strong>';
                } else {
                    rpStr = '<strong>' + aryId.length + '</strong>' + ' file/thư mục đã chọn'
                }

                bootbox.confirm(message.replace('[cusmsg]', rpStr), function(result) {
                    if (result == true) objSpaceModel.delete(aryId, function() {
                        var node = objGrid.findNodeById(aryId[0]).attr('data-id') == undefined ? $(objTree.findNodeById(aryId[0])).parent() : objGrid.findNodeById(aryId[0]);
                        objController.refresh($(node).attr('data-parent'));
                    });
                });
            };

            this.setBreadcrumb = function() {
                var currId = objTree.getSelectedNode();
                var node = objTree.findNodeById(currId);
                var aryTreeBrand = objTree.findTreeBrand(node);
                var container = $(o.navigationbar).find('UL.breadcrumb');
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
                $(o.statusbar).empty();
                var selectedNode = objGrid.getSelectedNodes();
                var selectedSize = 0;
                var dateStr = '';

                var totalUsed = $('<span></span>', {
                    html: 'Tổng dung lượng đã sử dụng: <strong>' + objUltis.formatFileSize(appprofile.SPACE.used) + '/' + objUltis.formatFileSize(appprofile.SPACE.total) + '</strong> - ' + (appprofile.SPACE.expire != '' ? 'Sử dụng đến: ' + '<strong>' + appprofile.SPACE.expire + '</strong>' : '')
                });
                var statusItems = $('<span></span>');
                var statusSize = $('<span></span>');

                if (selectedNode.length > 0) {
                    for (var i = 0; i < selectedNode.length; i++) {
                        selectedSize += parseFloat($(selectedNode[i]).attr('data-size'));
                    }
                    var html = selectedNode.length == 1 ? ($(selectedNode).attr('data-type') == 'directory' ? 'Thư mục:' : 'File:') + ' <strong>' + $(selectedNode).attr('data-name') + '</strong>' : '<strong>' + selectedNode.length + ' file/thư mục được chọn';

                } else {
                    var html = '';
                }

                $(o.statusbar).append(totalUsed);
                if (html != '') {
                    $(statusItems).html(html);
                    $(statusSize).html(' - Dung lượng:<strong>' + objUltis.formatFileSize(selectedSize) + '</strong>');
                    $(o.statusbar).append(statusItems, statusSize);
                }
            };

            this.changeLoginButtonStatus = function() {
                var loginButton = $(o.toolsbar).find('BUTTON#btnLogout');
                if (appprofile != null) {
                    $(loginButton).find('I').html('&nbsp;Thoát');
                } else {
                    $(loginButton).find('I').html('&nbsp;Đăng nhập');
                }
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