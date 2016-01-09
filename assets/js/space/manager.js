if (jQuery)
    (function($) {
        $.extend(
            $.fn, {
                violetFileManager: function(o) {
                    if (o == null) o = {};
                    if (o.tree == undefined)
                        o.tree = null;
                    if (o.grid == undefined)
                        o.grid = null;

                    if (o.maincontainer == undefined)
                        o.maincontainer = null;
                    if (o.titlebar == undefined)
                        o.titlebar = null;
                    if (o.toolsbar == undefined)
                        o.toolsbar = null;
                    if (o.statusbar == undefined)
                        o.statusbar = null;
                    if (o.navigationbar == undefined)
                        o.navigationbar = null;

                    if (o.oTree == undefined)
                        o.oTree = null;
                    if (o.oGrid == undefined)
                        o.oGrid = null;
                    if (o.host == undefined)
                        o.host = 'http://localhost/';
                    if (o.hostmodule == undefined)
                        o.hostmodule = 'privatecontent/';
                    if (o.script == undefined)
                        o.script = 'getcontent';
                    if (o.data == undefined)
                        o.data = null;
                    if (o.datasource == undefined)
                        o.datasource = 'ajax';

                    if (o.filehosting == undefined)
                        o.filehosting = 'http://sbgapi.violet.vn/uploads/space';
                    if (o.filedomain == undefined)
                        o.filedomain = 'http://sbgapi.violet.vn';
                    if (o.invisibledButtons == undefined)
                        o.invisibledButtons = null;

                    if (o.viewMode == undefined) o.viewMode = 'grid'; //'list'

                    o.host += 'ajax/';

                    var isDev = false;
                    //var contextmenu = null;
                    var oContainer = this;
                    var tree = [];
                    var totalItem = 0;
                    //var countItem = 0;
                    var maxWidth = 0;
                    var treeCurrentNode = null;
                    var self = this;
                    var oClipBoard = {
                        items: null,
                        act: null,
                        duplicateItems: null
                    };

                    var pasteOption = {
                        none: 0,
                        overwrite: 'ow',
                        rename: 'rem'
                    };

                    var aryPath = [];

                    if (o.homeNode == undefined)
                        o.homeNode = null;

                    /**
                     * Toolbar defined
                     */
                    var btnNewFolder = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnNewFolder');
                    var btnRename = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnRename');

                    var btnDel = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnDel');
                    var btnCopy = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnCopy');
                    var btnCut = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnCut');
                    var btnPaste = $('#' + o.toolsbar + ' > DIV.btn-group.basic > #btnPaste');
                    var btnShare = $('#' + o.toolsbar + ' > DIV.btn-group.social > #btnShare');
                    var btnPreview = $('#' + o.toolsbar + ' > DIV.btn-group.social > #btnPreview');
                    var btnDownload = $('#' + o.toolsbar + ' > DIV.btn-group.creation > #btnDownload');
                    var btnUpload = $('#' + o.toolsbar + ' > DIV.btn-group.creation > #btnUpload');
                    var btnRefresh = $('#' + o.toolsbar + ' > DIV.btn-group.control > #btnRefresh');

                    var btnTinyMCEInsert = $('#' + o.toolsbar + ' > DIV.btn-group.addon > #btnTinyMCEInsert');

                    var btnListView = $('.show-list-view');
                    var btnGridView = $('.show-grid-view');

                    //var btnGetFileURL = $('#' + o.toolsbar + ' > DIV.btn-group.control > #btnGetFileURL');

                    /*var toolbarButtons = [btnNewFolder, btnDel,
                        btnCopy, btnCut, btnPaste, btnShare,
                        btnPreview, btnDownload, btnUpload,
                        btnRefresh];*/

                    var statusbar = $('DIV#' + o.statusbar);

                    var sendCommand = function(p) {
                        if (p.postdata == undefined)
                            p.postdata = null;
                        if (p.script == undefined)
                            p.script = o.script;
                        if (p.callbackSuccess == undefined)
                            p.callbackSuccess = null;
                        if (p.callbackDone == undefined)
                            p.callbackDone = null;
                        if (p.callbackFail == undefined)
                            p.callbackFail = null;
                        if (p.callbackAlways == undefined)
                            p.callbackAlways = null;
                        if (p.parseData == undefined)
                            p.parseData = null;
                        if (p.self == undefined)
                            p.self = this;

                        if (p.script != null && (o.datasource == 'ajax' || isDev)) {

                            $.ajaxSetup({
                                url: o.host + o.hostmodule + p.script,
                                global: false,
                                type: "POST",
                                success: function(data, textStatus, XMLHttpRequest) {
                                    var parseData = null;

                                    if (data) {
                                        parseData = $.parseJSON(data);
                                        p.parseData = parseData;
                                    } else {
                                        parseData = {
                                            ERROR: {
                                                errCode: -1,
                                                err: ''
                                            }
                                        };
                                    }
                                    p.parseData = parseData;

                                    if (p.callbackSuccess != null) {
                                        if (parseInt(parseData.ERROR.errCode) === 0) p.callbackSuccess(parseData);
                                    }
                                },
                                complete: function(XMLHttpRequest, textStatus) {
                                    if (p.callbackDone != null) p.callbackDone();
                                    else {
                                        console.log(textStatus);
                                    }
                                },
                                error: function(err) {
                                    console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                                }

                            });
                            $.ajax({
                                data: p.postdata
                            })


                            //$.ajax ();

                            /*$.post(o.host + o.hostmodule
                                            + p.script,
                                            p.postdata,
                                            function (data) {
                                                var parseData = null;

                                                if (data) {
                                                    parseData = $.parseJSON(data);
                                                    p.parseData = parseData;
                                                }
                                                else {
                                                    parseData = {ERROR:{errCode:-1,err:''}};
                                                }
                                                p.parseData = parseData;

                                                if (p.callbackSuccess != null) {
                                                    if (parseInt(parseData.ERROR.errCode) === 0) p.callbackSuccess(parseData);                                                                
                                                }
                                            })
                                    .done(function () {
                                                if (p.callbackDone != null)
                                                    p.callbackDone(p.parseData);
                                            })
                                    .fail(function () {
                                        if (p.callbackFail != null)
                                            p.callbackFail(this);
                                    })
                                    .always(
                                            function () {
                                                if (p.callbackAlways != null)
                                                    p.callbackAlways(this);
                                            });*/
                        } else if (o.datasource == 'json') {
                            if (p.callbackSuccess != null)
                                p.callbackSuccess(o.data);
                            if (p.callbackDone != null)
                                p.callbackDone(this);
                        }

                    };

                    var getDirTreeMaxWidth = function() {
                        //var scrWidth = $(o.maincontainer).width();
                        var scrWidth = $(document).width();
                        return parseInt(scrWidth / 3);
                    };

                    var layoutRender = function() {
                        var scrHeght = $(window).innerHeight();
                        var dirTreeHeight = scrHeght - $('#' + o.titlebar).height() - $('#' + o.toolsbar).height() - $('#' + o.statusbar).height() - 5;
                        var tree = $('#' + o.tree);
                        var grid = $('#' + o.grid);
                        tree.parent().height(dirTreeHeight);
                        grid.parent().height(dirTreeHeight);
                        grid.parent().width('calc(100% - ' + (tree.parent().width() + 8) + 'px)');
                        maxWidth = getDirTreeMaxWidth();

                        $(o.tree).height(dirTreeHeight - 5);

                        if (o.invisibledButtons != null) {
                            for (var i = 0; i < o.invisibledButtons.length; i++) {
                                $('#' + o.invisibledButtons[i]).hide();
                            }
                        }
                    };

                    var createFileManager = function(parseData) {
                        o.data = parseData;
                        if (o.data.length == 0) {
                            o.data.DIRECTORIES = {};
                            o.data.FILES = {};
                        }

                        totalItem = o.data.DIRECTORIES.length;
                        o.oTree = $('#' + o.tree).violetTree({
                            data: o.data.DIRECTORIES,
                            manager: oContainer
                        });
                        o.oGrid = $('#' + o.grid).violetGrid({
                            data: o.data,
                            manager: oContainer
                        });

                        self.setHomeNode();
                        self.refreshStatusBar();
                        setGridNodeEvent();
                    };

                    var getAllDirChild = function(parentID, aryChild) {
                        parentID = parentID == null ? 0 : parentID;
                        var dirList = searchItemsByParent(parentID,
                            'directory');
                        var index = aryChild.length;
                        aryChild[index] = parentID;
                        if (dirList.length > 0) {
                            for (var i = 0; i < dirList.length; i++) {
                                getAllDirChild(dirList[i].id,
                                    aryChild);
                            }
                        }
                    };

                    var buildTreeFromParent = function(dirID, node) {
                        if (o.data.DIRECTORIES == undefined) {
                            return false;
                        }
                        var aryChildIDs = [];
                        var dir = o.data.DIRECTORIES[searchItemByID(
                            dirID, 'directory')];
                        var aryChildDirs = searchItemsByParent(dirID,
                            'directory');
                        var aryChildFiles = searchItemsByParent(dirID,
                            'file');

                        node.id = dir.id;
                        node.name = dir.name;
                        node.type = 'directory';

                        $(aryChildDirs).each(function(index) {
                            var id = this.id;
                            var name = this.name;
                            var type = 'directory';
                            aryChildIDs[index] = {
                                id: id,
                                name: name,
                                type: type,
                                childs: null
                            };
                        });

                        if ($(aryChildFiles).length > 0) {
                            if (node.files == undefined)
                                node.files = [];
                            $(aryChildFiles).each(function(index) {
                                var id = this.id;
                                var name = this.name;
                                var type = 'file';
                                node.files[index] = {
                                    id: id,
                                    name: name,
                                    type: type
                                };
                            });
                        }

                        if ($(aryChildDirs).length > 0) {
                            if (node.childs == undefined)
                                node.childs = [];
                            $(aryChildIDs)
                                .each(
                                    function(index) {
                                        node.childs[index] = {};
                                        buildTreeFromParent(
                                            aryChildIDs[index].id,
                                            node.childs[index]);
                                    });
                        }
                    };

                    var doneInit = function() {
                        bindEventToToolbars();
                        documentEventsBinding();
                    };

                    var failInit = function(er) {
                        bootbox.alert(er.err);
                    };

                    var init = function() {
                        layoutRender();
                        $('#' + o.tree).parent().resizable({
                            maxWidth: maxWidth,
                            minWidth: 220,
                            handles: "e",
                            resize: function(event, ui) {
                                layoutRender();
                            }
                        });
                        $(window).resize(function() {
                            layoutRender();
                            $('#' + o.tree).parent().resizable({
                                maxWidth: maxWidth
                            });
                        });
                        $(document).on({
                            ajaxStart: function() {
                                $("body").addClass("loading");
                            },
                            ajaxStop: function() {
                                $("body").removeClass("loading");
                            }
                        });

                        sendCommand({
                            postdata: null,
                            callbackSuccess: createFileManager,
                            callbackDone: doneInit,
                            callbackFail: failInit
                        });
                    };

                    var searchItemByID = function(id, type) {
                        var data = {};
                        switch (type) {
                            case 'directory':
                                data = o.data.DIRECTORIES;
                                break;
                            case 'file':
                                data = o.data.FILES;
                                break;
                            default:
                                break;
                        }

                        // for (var i = 0; i < data.length; i++) {
                        for (var i in data) {
                            if (data[i].id == id) {
                                return i;
                            }
                        }
                    };

                    var searchItemsByParent = function(parentID, type) {
                        var data = {};
                        var aryItem = [];
                        var index = aryItem.length;

                        switch (type) {
                            case 'directory':
                                data = o.data.DIRECTORIES;
                                break;
                            case 'file':
                                data = o.data.FILES;
                                break;
                            default:
                                break;
                        }

                        for (i in data) {
                            if (data[i].parentID == parentID) {
                                aryItem[index] = data[i];
                                index++;
                            }
                        }

                        return aryItem;
                    };
                    /***********************************************
                     * TINYMCE EDITOR INTERACTIVE - START *
                     **********************************************/
                    var setGridNodeEvent = function() {
                        var gridNodes = $('DIV#file-container UL.vsgrid LI.vscell');

                        $.map(gridNodes, function(el, i) {
                            $(el).on('item:selected', function() {
                                $.map(gridNodes, function(e, idx) {
                                    $(e).removeClass('editorSelected')
                                });
                                $(el).addClass('editorSelected');
                                addonPreview(el);
                            });
                        });
                    }

                    var addonGetItem = function() {
                        var items = o.oGrid.getHighLightItem();
                        if ($(items).length == 0 || $(items).length > 1) return false;

                        //if (items[0].type == 'directory') return false;                                   

                        return item;
                    }

                    var addonPreviewElement = null;

                    var addonPreview = function(node) {
                        $('DIV#directory-view-container DIV#file-preview-container').show();
                        var previewContainer = $('DIV#file-preview-container DIV#previewZone');
                        var previewInfoContainer = $('DIV#file-preview-container DIV#previewInfo');

                        var itemId = $(node).find('DIV.file-name INPUT.id').val();
                        var itemType = $(node).find('DIV.file-name INPUT.type').val();
                        var itemName = $(node).find('DIV.file-name INPUT.name').val();
                        var previewElement = null;

                        $(previewInfoContainer).hide();
                        $(previewInfoContainer).empty();

                        if (itemType == 'directory') {
                            previewElement = $('<div></div>', {
                                style: 'color:white'
                            }).append('<span style="font-weight:bold">Thư mục: </span><span>' + itemName + '</span>');
                            
                        } else if (itemType == 'file') {
                            $(previewContainer).show();
                            $(previewContainer).css('background','');
                            var item = o.data.FILES[searchItemByID(itemId, 'file')];
                            var type = addonDetectMineType(item);

                            switch (type.type) {
                                case 'img':
                                    previewElement = $('<img />', {
                                        src: item.fileurl
                                    });

                                    var theImage = new Image();
                                    theImage.src = previewElement.attr("src");
                                    var height = theImage.height;
                                    var width = theImage.width;
                                    var info1 = $('<span></span>', {
                                        text: item.name
                                    });
                                    var info2 = $('<br />');
                                    var info3 = $('<span></span>', {
                                        text: width + 'px X ' + height + 'px'
                                    });
                                    $(previewInfoContainer).attr('title', item.name + ' - ' + width + 'px X ' + height + 'px')
                                    $(previewInfoContainer).append(info1, info2, info3);
                                    $(previewInfoContainer).show();
                                    break;
                                case 'html5audio':
                                    var source = $('<source />', {
                                        src: item.fileurl,
                                        type: type.apptype
                                    });
                                    previewElement = $('<audio></audio>', {
                                        id: 'addonAudioPreview',
                                        controls: true,
                                        autoplay: true,
                                        width: '100%',
                                        height: '20px'
                                    }).append(source);
                                    
                                    break;
                                case 'html5video':                                    
                                    previewElement = $('<video></video>', {
                                        id: 'addonVideoPreview',
                                        controls: true,
                                        autoplay: true
                                    });

                                    var source = $('<source />', {
                                        src: item.fileurl,
                                        type: type.apptype
                                    });
                                    $(previewElement).append(source);
                                    $(previewElement).append('Your browser does not support the video tag.');

                                    var info1 = $('<span></span>', {
                                        text: item.name
                                    });
                                    var info2 = $('<br />');
                                    var info3 = $('<span></span>', {
                                        text: self.formatFileSize(item.size, 2)
                                    });
                                    $(previewInfoContainer).attr('title', item.name + ' - ' + self.formatFileSize(item.size, 2))
                                    $(previewInfoContainer).append(info1, info2, info3);
                                    $(previewInfoContainer).show();
                                    break;
                                case 'flashvideo':
                                    var info1 = $('<span></span>', {
                                        text: item.name
                                    });
                                    var info2 = $('<br />');
                                    var info3 = $('<span></span>', {
                                        text: self.formatFileSize(item.size, 2)
                                    });
                                    $(previewInfoContainer).attr('title', item.name + ' - ' + self.formatFileSize(item.size, 2))
                                    $(previewInfoContainer).append(info1, info2, info3);
                                    $(previewInfoContainer).show();

                                    var htmlFlashvars = 'hidecontrols=0&hideplaybutton=1&videofile=' + encodeURI(item.fileurl) + '&hdfile=&ishd=0&autoplay=1&errorcss=.html5box-error+%7Btext-align%3Acenter%3B+color%3A%23ff0000%3B+font-size%3A14px%3B+font-family%3AArial%2C+sans-serif%3B%7D&id=0';
                                    var previewElement = $('<embed></embed>', {
                                                                                'width':'100%', 
                                                                                'height':'100%',
                                                                                'scale':'showall',
                                                                                'flashvars': htmlFlashvars, 
                                                                                'wmode': 'transparent', 
                                                                                'type':'application/x-shockwave-flash', 
                                                                                'allowscriptaccess':'always', 
                                                                                'allowfullscreen':'true', 
                                                                                'quality':'hight', 
                                                                                'pluginspage':'http://www.adobe.com/go/getflashplayer', 
                                                                                'src':'http://vspace.need.vn/assets/js/jquery/html5boxplayer.swf'
                                                                            });

                                    $(previewContainer).css('background','transparent url("http://www.bigc.vn/assets/images/loading.gif") no-repeat scroll center center');
                                    break;
                                default:
                                    $('DIV#directory-view-container DIV#file-preview-container').hide();
                                    return;
                                    break;
                            }
                        }

                        $(previewContainer).empty();
                        $(previewContainer).append(previewElement);
                        addonPreviewElement = previewElement;
                    }

                    var addonDetectMineType = function (item) {
                        var aryImages = ['jpg','jpeg','png','gif','tiff','dvg','bmp'];
                        var aryHTML5Video = ['mp4', 'm4v', 'webm', 'ogg'];
                        var aryFlashVideos = ['flv', 'avi', 'mpg'];
                        var aryAudios = ['mp3', 'ogg', 'wav'];
                        
                        var objType = {
                            type: null,
                            apptype: null
                        }

                        if (item.minetype == undefined) return {type: 'dir', apptype:'vspace/dir'};
                        if ($.inArray(item.minetype, aryImages) > -1) return {type: 'img', apptype:'application/' + item.minetype};
                        if ($.inArray(item.minetype, aryHTML5Video) > -1) {
                            return {type: 'html5video', apptype: $.inArray(item.minetype, ['mp4', 'm4v']) > -1 ? 'video/mp4' : (item.minetype == 'ogg' ? 'video/ogg' : 'video/webm')}                            
                        }
                        if ($.inArray(item.minetype, aryFlashVideos) > -1) {
                            return {type: 'flashvideo', apptype:'application/' + item.minetype};
                        }
                        if ($.inArray(item.minetype, aryAudios) > -1) {
                            return {type: 'html5audio', apptype: item.minetype == 'mp3' ? 'audio/mpeg' : (item.minetype == 'ogg' ? 'audio/ogg' : 'audio/wav')};
                        }

                        return {type: 'file', apptype:'application/' + item.minetype};
                    }

                    var addonOpenInsertDialog = function (item) {
                        var item = o.data.FILES[searchItemByID(item.id, 'file')];                     
                        var type = addonDetectMineType(item);
                        var width = 320;
                        var height = 240;
                        var dlgHtml = '';
                        if (type.type == 'img') { 
                            var theImage = new Image();                           
                            theImage.src = item.fileurl;
                            height = theImage.height;
                            width = theImage.width;
                        }
                        else if (type.type == 'html5video') {
                            $(addonPreviewElement).get(0).pause();
                        }
                        else if (type.type == 'html5audio') {
                            $(addonPreviewElement).get(0).pause();
                            width = '200';
                            height = '20';                            
                        }

                        var html = '<form id="addonDialog" class="form-horizontal" role="form">' 
                                + '<div class="col-sm-12">' 

                                + ' <div class="form-group">' 
                                + '     <label for="" class="col-sm-2 control-label no-padding-right">URL</label>' 
                                + '     <div class="col-sm-10">' 
                                + '         <input type="text" id="addonFileUrl" name="" class="form-control" value="'+item.fileurl+'">' 
                                + '     </div>' 
                                + ' </div>'

                                + ' <div class="form-group">' 
                                + '     <label for="" class="col-sm-2 control-label no-padding-right">Mô tả</label>' 
                                + '     <div class="col-sm-10">' 
                                + '         <input type="text" id="addonFileDescription" name="" class="form-control">' 
                                + '     </div>' 
                                + ' </div>'

                                + ' <div class="space-4"></div>';

                            if (type.type != 'html5audio' && type.type != 'file') {
                                html += ' <div class="form-group">' 
                                + '     <label for="" class="col-sm-2 control-label no-padding-right">Kích thước</label>' 
                                + '     <div class="col-sm-10">' 
                                + '         <div class="row">' 
                                + '             <div class=" col-sm-5">' 
                                + '                 <input type="text" id="addonFileWidth" name="" class="form-control" value="'+width+'" onchange="changeWidth(this)">' 
                                + '             </div>' 
                                + '             <div class="col-sm-1" style="padding-top: 8px">X</div>' 
                                + '             <div class=" col-sm-6">' 
                                + '                 <input type="text" id="addonFileHeight" name="" class="form-control" value="'+height+'" onchange="changeHeight(this)">'
                                + '             </div>' 
                                + '         </div>' 
                                + '     </div>' 
                                + ' </div>'

                                + ' <div class="form-group">' 
                                + '     <label for="" class="col-sm-2 control-label no-padding-right">Căn lề</label>' 
                                + '         <div class="col-sm-10 btn-group" data-toggle="buttons">' 
                                + '             <label class="btn"><input id="addonAlignLeft" name="addonAlign" type="radio" value="left" checked><i class="icon-only ace-icon fa fa-align-left"></i></label>' 
                                + '             <label class="btn"><input id="addonAlignCenter" name="addonAlign" type="radio" value="center"><i class="icon-only ace-icon fa fa-align-center"></i></label>' 
                                + '             <label class="btn"><input id="addonAlignRight" name="addonAlign" type="radio" value="right"><i class="icon-only ace-icon fa fa-align-right"></i></label>' 
                                + '         </div>' 
                                + ' </div>';
                            }

                            html +=  '</div>' 
                                + '</form>' 
                                + '<div class="clearfix"></div>'
                                +'<script>'
                                + '   var originWidth = ' + width +';'
                                + '   var originHeight = ' + height +';'
                                + '   var changeWidth = function (el) {'
                                + '        var hEl = $("#addonFileHeight");'
                                + '        if ($(el).val() > 0) {'
                                + '            tp = (parseInt($(el).val()) / parseInt(originWidth)) * originHeight;'
                                + '            $(hEl).val(tp.toFixed(0));'
                                + '        }'
                                + '    };'                                
                                + '    var changeHeight = function (el) {'
                                + '        var wEl = $("#addonFileWidth");'
                                + '        if ($(el).val() > 0) {'
                                + '            tp = (parseInt($(el).val()) / parseInt(originHeight)) * originWidth;'
                                + '            $(wEl).val(tp.toFixed(0));'
                                + '        }'
                                + '    };'
                                + '</script>';


                        var dialogOptions = {
                            title: 'Chèn ảnh/video/file vào văn bản',
                            message: html,
                            buttons: {
                                'Chèn': {
                                    label: "Chèn",
                                    callback: function() {
                                        var objInsert = {url: $('#addonFileUrl').val(),
                                                        width: $( "#addonFileWidth" ).length ? $('#addonFileWidth').val() : width,
                                                        height: $( "#addonFileHeight" ).length ? $('#addonFileHeight').val() : height,
                                                        description: $('#addonFileDescription').val(),
                                                        align: $( "input:radio[name=addonAlign]" ).length ? $( "input:radio[name=addonAlign]:checked" ).val() : 'left',
                                                        type: type.type,
                                                        apptype: type.apptype
                                                    };
                                        addonInsertToEditor(addonRenderInsertContent(objInsert));
                                        //addonRenderInsertContent(objInsert);
                                    }
                                },
                                cancel: {
                                    label: "Hủy bỏ"
                                }
                            }
                        };

                        return bootbox.dialog(dialogOptions);
                    }

                    var addonRenderInsertContent = function (obj) {
                        var content = '';
                        var fileContent = '<a href="{url}" title="" class="{align}" alt="{description}">{description}</a>';
                        var imageContent = '<img src="{url}" title="" class="{align}" width="{width}" height="{height}" data-mce-src="{url}" alt="{description}">';
                        var html5videoContent = '<video class="{align}" controls="controls" width="{width}" height="{height}"><source src="{url}" type="{apptype}" /></video>';
                        var html5audioContent = '<audio class="{align}" controls="controls" width="{width}" height="{height}"><source src="{url}" type="{apptype}" /></audio>';
                        var flashvars = 'hidecontrols=0&hideplaybutton=1&videofile={url}&hdfile=&ishd=0&autoplay=1&errorcss=.html5box-error+%7Btext-align%3Acenter%3B+color%3A%23ff0000%3B+font-size%3A14px%3B+font-family%3AArial%2C+sans-serif%3B%7D&id=0';
                        var flashvideoContent = '<embed class="{align}" style="width: {width}; height: {height};" scale="showall" flashvars=' + flashvars + ' wmode="transparent" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" quality="hight" pluginspage="http://www.adobe.com/go/getflashplayer" src="http://vspace.need.vn/assets/js/jquery/html5boxplayer.swf">';
                        switch (obj.type) {
                                case 'img':
                                    content = imageContent;
                                    break;
                                case 'html5video':
                                    if (obj.height == 0) obj.height = 240;
                                    if (obj.width == 0) obj.width = 320;
                                    obj.url = encodeURI(obj.url);
                                    obj.apptype = obj.apptype;
                                    content = html5videoContent;
                                    break;
                                case 'flashvideo':
                                    if (obj.height == 0) obj.height = 240;
                                    if (obj.width == 0) obj.width = 320;
                                    obj.url = encodeURI(obj.url);
                                    obj.apptype = obj.apptype;
                                    content = flashvideoContent;
                                break;
                                case 'html5audio':
                                    if (obj.height == 0) obj.height = 20;
                                    if (obj.width == 0) obj.width = 150;
                                    obj.url = encodeURI(obj.url);
                                    obj.apptype = obj.apptype;
                                    content = html5audioContent;
                                break;
                                case 'file':
                                default:
                                    if (obj.description == '') obj.description = obj.url;
                                    content = fileContent;
                                break;
                        }

                        $.each (obj, function (key, val){
                            var regx = new RegExp('{' + key + '}', 'g');
                            content = content.replace(regx, val);
                        });

                        return content;
                    }

                    var addonInsertToEditor = function(content) {
						var messageSrc = document.referrer;
                        var objMsg = {command: 'mceInsertContent', data: content};
                        var msg = JSON.stringify(objMsg);
                        XD.postMessage(msg, messageSrc);
                    };
                    /***********************************************
                     * TINYMCE EDITOR INTERACTIVE - FINISH *
                     **********************************************/

                    /***********************************************
                     * TOOLBAR EVENTS - START *
                     **********************************************/


                    var btnTinyMCEInsertClick = function() {
                        var node = o.oGrid.getHighLightItem();
                        if ($(node).length != 1) return false; 
                        addonOpenInsertDialog($(node).get(0));
                    };

                    var btnListViewClick = function() {
                        o.oGrid.setViewMode('list');
                    };

                    var btnGridViewClick = function() {
                        o.oGrid.setViewMode('grid');
                    };

                    var btnGetFileURLClick = function() {
                        var items = o.oGrid.getHighLightItem();
                        if ($(items).length == 0 || $(items).length > 1) return false;
                        if (items[0].type == 'directory') return false;
                        var fileurl = items[0].fileurl;

                        var dlgOptions = {
                            title: 'Link của file <b>' + items[0].name + '</b>',
                            message: '<input type="text" value="' + fileurl + '" style="width:100%" onfocus="this.select()">',
                            buttons: {
                                success: {
                                    label: "OK",
                                    className: "btn btn-primary"
                                },
                            }
                        };
                        return bootbox.dialog(dlgOptions);
                    };

                    var btnRefreshClick = function(obj) {
                        $(o).find('i').addClass('fa fa-spin');
                        sendCommand({
                            postdata: null,
                            callbackSuccess: function(parseData) {
                                o.data = parseData;
                                self.updateData({
                                    updateAll: true
                                });
                                o.oTree.refeshTree();
                            },
                            callbackDone: function() {
                                $(o).find('i').removeClass(
                                    'fa fa-spin');
                            },
                            callbackFail: failInit
                        });
                    };

                    var btnNewFolderClick = function() {
                        createFolderStart();
                    };

                    var btnRenameClick = function() {
                        var gridSelectedItems = o.oGrid
                            .getHighLightItem();
                        if ($(gridSelectedItems).length == 1) {
                            o.oGrid.rename(113);
                        } else {
                            o.oTree.rename(113);
                        }
                    }

                    var btnUploadClick = function() {
                        uploadStart();
                        uploadInit();
                    };

                    var btnDownloadClick = function() {
                        var items = o.oGrid.getHighLightItem();

                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type == 'directory') {
                                items[i] = self.getAllDirChilds(items[i]);
                            }
                        }

                        if (items.length > 0) {
                            var url = o.host + "download/getFile/";
                            self.redirectPost(url, {
                                data: JSON.stringify(items)
                            });
                        }
                    };

                    var btnDelClick = function() {
                        var items = o.oGrid.getHighLightItem();

                        if ($(items).length == 0) {
                            var dirID = $(o.oTree.getSelectedNode()).attr('id');
                            if (dirID == 0) return false;
                            var item = o.data.DIRECTORIES[searchItemByID(dirID, 'directory')];
                            item.type = 'directory';
                            items = [item];
                        }
                        self.deleteItem(items);
                    };

                    var btnCopyClick = function() {
                        copy('copy');
                    };

                    var btnPasteClick = function() {
                        paste();
                    };

                    var btnCutClick = function() {
                        copy('move');
                    };

                    var bindEventToToolbars = function() {
                        $(btnRefresh).click(function(e) {
                            btnRefreshClick(this)
                        });

                        $(btnShare).click(function(e) {
                            console.log('Share click!');
                            btnGetFileURLClick();
                        });

                        $(btnNewFolder).click(function(e) {
                            btnNewFolderClick()
                        });

                        $(btnRename).click(function(e) {
                            btnRenameClick()
                        });

                        $(btnUpload).click(function(e) {
                            btnUploadClick()
                        });

                        $(btnDel).click(function(e) {
                            btnDelClick()
                        });
                        $(btnCopy).click(function(e) {
                            btnCopyClick()
                        });
                        $(btnCut).click(function(e) {
                            btnCutClick()
                        });
                        $(btnPaste).click(function(e) {
                            btnPasteClick()
                        });
                        $(btnPreview).click(function(e) {
                            btnPreviewClick()
                        });
                        $(btnDownload).click(function(e) {
                            btnDownloadClick()
                        });

                        $(btnListView).click(function() {
                            btnListViewClick();
                        });

                        $(btnGridView).click(function() {
                            btnGridViewClick();
                        });

                        $(btnTinyMCEInsert).click(function() {
                            btnTinyMCEInsertClick();
                        });

                        /*
                         * btnShare btnPreview btnDownload btnUpload
                         */
                    };
                    /***********************************************
                     * TOOLBAR EVENTS - END *
                     **********************************************/

                    /***********************************************
                     * DOCUMENT EVENTS BINDING - START *
                     **********************************************/
                    var documentEventsBinding = function() {
                        $(document)
                            .bind(
                                'keydown',
                                function(e) {
                                    switch (e.which) {
                                        case 113:
                                        case 27:
                                            var gridSelectedItems = o.oGrid.getHighLightItem();
                                            if ($(gridSelectedItems).length > 0) {
                                                o.oGrid.rename(e.which);
                                            } else {
                                                o.oTree.rename(e.which);
                                            }
                                            break;
                                        case 46:
                                            // delete
                                            btnDelClick();
                                            break;
                                        case 65:
                                            //select all
                                            if (e.ctrlKey) {
                                                o.oGrid.selectAllNode();
                                            }
                                            break;
                                        case 67:
                                            //copy
                                            if (e.ctrlKey) {
                                                copy('copy');
                                            }
                                            break;
                                        case 86:
                                            //paste
                                            if (e.ctrlKey) {
                                                paste();
                                            }
                                            break;
                                        case 88:
                                            //cut
                                            if (e.ctrlKey) {
                                                copy('move');
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                })

                        $('#' + o.grid).bind('click', function() {
                            var items = o.oGrid.getHighLightItem();
                            if (items.length == 0 || items.length > 1) {
                                $('DIV#directory-view-container DIV#file-preview-container').hide({
                                    duration: 0,
                                    easing: false,
                                    always: function() {
                                        var videoEl = $('DIV#directory-view-container DIV#file-preview-container DIV#previewZone VIDEO');
                                        if ($(videoEl).length > 0) $(videoEl).get(0).pause();
                                    }
                                });
                            }
                        });


                    };
                    /***********************************************
                     * DOCUMENT EVENTS BINDING - END *
                     **********************************************/

                    /***********************************************
                     * CREATE FOLDER - START *
                     **********************************************/
                    var createFolderStart = function() {
                        var promptOptions = {
                            title: "Tạo thư mục mới",
                            buttons: {
                                confirm: {
                                    label: "Lưu"
                                },
                                cancel: {
                                    label: "Hủy"
                                }
                            },
                            callback: function(result) {

                                var folderName = result === null ? null : result.trim();
                                var errMessage = '';

                                if (folderName === null) return true;

                                if (folderName === '') {
                                    errMessage = 'Hãy nhập tên thư mục cần tạo!';
                                }

                                if (errMessage !== '') {
                                    $(this.message).parent().find('.error-message').remove();
                                    var error = $('<div></div>', {
                                        'class': 'error-message',
                                        text: errMessage
                                    }).insertBefore(this.message);
                                    $(this.message).find('input').focus();
                                    return false;

                                }

                                createFolder(treeCurrentNode, folderName);
                            }
                        };

                        return bootbox.prompt(promptOptions);
                    };

                    var uploadStart = function() {
                        var userid = o.data.userinfo.us_id;
                        var promptOptions = {
                            title: "Tải lên",
                            message: "<form id='upload' method='post'  action='" + api_url + "space/upload' enctype='multipart/form-data'><div id='drop'>Kéo thả tệp vào đây <a> Chọn tệp </a><input type='hidden' name='response' value='1'/><input type='hidden' name='dir' value='" + self.getTreeCurrentNode() + "'/><input type='hidden' name='userid' value='" + userid + "'/><input type='file' name='upload_file' multiple /></div><ul></ul></form>",
                            buttons: {
                                success: {
                                    label: "Xong",
                                    className: "btn btn-primary",
                                    callback: function(result) {

                                    }
                                },
                            },
                            onEscape: function() {
                                uploadDone(self.getTreeCurrentNode());
                            }
                        };


                        return bootbox.dialog(promptOptions);
                    };

                    var uploadDone = function(result) {

                    };

                    var btnPreviewClick = function() {
                        var items = o.oGrid.getHighLightItem();
                        if ($(items).length == 0) {
                            var dirID = $(o.oTree.getSelectedNode())
                                .attr('id');
                            var item = o.data.DIRECTORIES[searchItemByID(
                                dirID, 'directory')];
                            item.type = 'directory';
                            items = [item];
                        }
                        previewFile(items[0]);
                    };

                    var previewFile = function(node) {
                        var content = "";

                        $ext = node.fileurl.split('.').pop();
                        $ext = $ext.toLowerCase();
                        if ($.inArray($ext, ["jpg", "jpeg", "png", "gif", "tiff", "dvg", "bmp"]) >= 0) {

                            content = "<img style='width:100%' src='" + node.fileurl + "' /><br />" + node.name;
                            bootbox.alert({
                                message: content,
                                className: 'preview'
                            });
                            return false;
                        }

                        if ($.inArray($ext, ["flv", "mp4", "avi", "m4v"]) >= 0) {
                            $.ajax({
                                url: o.host + "preview/getVideoPreview",
                                type: "POST",
                                data: {
                                    fileurl: node.fileurl,
                                    name: node.name
                                },
                                success: function(data,
                                    textStatus, jqXHR) {
                                    bootbox.alert(data);
                                },
                                error: function(jqXHR,
                                    textStatus,
                                    errorThrown) {}
                            });
                            return false;
                        }

                        if ($.inArray($ext, ["ogg"]) >= 0) {
                            content = '<audio controls>\
                        <source src="' + node.fileurl + '" type="audio/ogg">\
                      Your browser does not support the audio element.\
                      </audio> <br />' + node.name;
                            bootbox.alert(content);
                            return false;
                        }
                        if ($.inArray($ext, ["mp3"]) >= 0) {
                            content = '<audio controls>\
                        <source src="' + node.fileurl + '" type="audio/mpeg">\
                      Your browser does not support the audio element.\
                      </audio> <br />' + node.name;
                            bootbox.alert(content);
                            return false;
                        }

                        if ($.inArray($ext, ["ppt", "xls", "doc", "pdf", "docx", "pptx", "xlsx"]) >= 0) {

                            $.ajax({
                                url: o.host + "preview/getFilePreview/" + node.id,
                                type: "POST",
                                data: {},
                                success: function(data,
                                    textStatus, jqXHR) {
                                    bootbox.alert(data);
                                },
                                error: function(jqXHR, textStatus,
                                    errorThrown) {

                                }
                            });
                            return false;
                        }
                        if ($.inArray($ext, ["xvl"]) >= 0) {
                            var url = o.host.replace("ajax/", "");
                            var redirect = url + 'frontend/lecture/';
                            self.redirectPost(redirect, {
                                fileid: node.id
                            });
                            return false;
                        }

                        $(".bootbox").addClass("preview");
                        var content = "Không hỗ trợ xem trước loại tệp này, vui lòng tải xuống và xem trên máy";
                        bootbox.alert(content);
                    };

                    var uploadInit = function() {
                        var ul = $('#upload ul');

                        $('#drop a').click(function() {
                            $(this).parent().find('input').click();
                        });

                        $('#upload').fileupload({
                            dropZone: $('#drop'),
                            add: function(e, data) {

                                var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"' + ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');
                                tpl.find('p').text(data.files[0].name).append('<i>' + formatFileSize(data.files[0].size, 2) + '</i>');
                                data.context = tpl.appendTo(ul);
                                tpl.find('input').knob();
                                tpl.find('span').click(
                                    function() {
                                        if (tpl.hasClass('working')) {
                                            jqXHR.abort();
                                        }
                                        tpl.fadeOut(function() {
                                            tpl.remove();
                                        });
                                    });
                                var jqXHR = data.submit();
                            },
                            progress: function(e, data) {

                                // Calculate the
                                // completion
                                // percentage of the
                                // upload
                                var progress = parseInt(data.loaded / data.total * 100, 10);

                                // Update the hidden
                                // input field and
                                // trigger a change
                                // so that the
                                // jQuery knob
                                // plugin knows to
                                // update the dial
                                data.context.find('input').val(progress).change();
                                if (progress == 100) {
                                    data.context.removeClass('working');
                                }
                            },
                            fail: function(e, data) {
                                // Something has
                                // gone wrong!
                                data.context.addClass('error');
                            },
                            done: function(e, data) {
                                var newFileData = data.result;
                                newFileData = $.parseJSON(data.result);
                                if (newFileData.ERROR.errCode == 0) {
                                    for (var i = 0; i < $(newFileData.FILES).length; i++) {
                                        var file = newFileData.FILES[i];
                                        var node = {
                                            thumbnail: file.thumbnail == '' ? null : o.filedomain + "/" + file.thumbnail,
                                            id: file.id,
                                            name: file.name,
                                            fileurl: file.fileurl,
                                            parentID: file.parentID,
                                            minetype: file.minetype,
                                            size: file.size
                                        };
                                        o.oGrid.createNode(node);
                                        o.data.FILES.push(node);
                                    }

                                    for (var i = 0; i < $(newFileData.DIRECTORIES).length; i++) {
                                        var file = newFileData.DIRECTORIES[i];
                                        var node = {
                                            id: file.id,
                                            name: file.name,
                                            parentID: file.parentID,
                                            minetype: file.minetype
                                        };
                                        o.oTree.createNode(node);
                                        o.oGrid.createNode(node);
                                        o.data.DIRECTORIES.push(node);
                                    }

                                    self.refreshStatusBar();
                                }
                            }

                        });

                        $(document).on('drop dragover',
                            function(e) {
                                e.preventDefault();
                            });

                        function formatFileSize(bytes, decimal) {
                            if (typeof bytes !== 'number') {
                                return '';
                            }

                            if (bytes >= 1000000000) {
                                return (bytes / 1000000000).toFixed(decimal) + ' GB';
                            }

                            if (bytes >= 1000000) {
                                return (bytes / 1000000).toFixed(decimal) + ' MB';
                            }

                            return (bytes / 1000).toFixed(decimal) + ' KB';
                        }

                    };

                    var createFolder = function(parent, name) {
                        var postdata = {
                            fname: name,
                            fparentid: parent
                        };
                        var script = 'createdir';
                        /* isDev = true; */
                        sendCommand({
                            postdata: postdata,
                            script: script,
                            callbackSuccess: function(parseData) {
                                createFolderFinish(parseData);
                            },
                            callbackFail: function() {}
                        });
                    };

                    var createFolderFinish = function(parseData) {
                        /* isDev = false; */
                        if (parseData.ERROR.errCode == 0) {
                            var node = {
                                id: parseData.id,
                                name: parseData.name,
                                parentID: parseData.parentID,
                                defaultStatus: 1
                            };
                            o.oTree.createNode(node);
                            o.data.DIRECTORIES.push(node);
                            if (o.oGrid)
                                o.oGrid.reloadGrid();
                        }
                    };
                    /***********************************************
                     * CREATE FOLDER - END *
                     **********************************************/
                    /***********************************************
                     * RENAME - START *
                     **********************************************/
                    var rename = function(item) {
                        /*
                         * item = {id,name,type,parentID,newName}
                         */
                        var postdata = {
                            data: JSON.stringify(item)
                        };
                        sendCommand({
                            postdata: postdata,
                            script: 'rename',
                            callbackSuccess: function(parseData) {
                                var newItem = null;
                                if (item.type == 'directory') {
                                    newItem = parseData.DIRECTORIES;
                                    o.data.DIRECTORIES[searchItemByID(item.id, 'directory')].name = newItem.name;
                                } else if (item.type == 'file') {
                                    newItem = parseData.FILES;
                                    o.data.FILES[searchItemByID(item.id, 'file')].name = newItem.name;
                                }

                                self.updateData({
                                    updateAll: true
                                });

                                o.oTree.refeshTree();
                                self.setTreeCurrentNode(item.parentID);
                                o.oGrid.setHighLightNode(item.id, item.type);
                            },
                            callbackFail: function(errors) {
                                alert(errors.err);
                            }
                        });
                    };
                    /***********************************************
                     * RENAME - END *
                     **********************************************/
                    /***********************************************
                     * COPY & PASTE & MOVE - START * =***********
                     **********************************************/
                    var copy = function(act) {
                        // detect selected items
                        // push to clipboard
                        var items = o.oGrid.getHighLightItem();

                        if ($(items).length == 0) {
                            var node = o.oTree.getSelectedNode();
                            var itemID = $(node).attr('id');

                            if (itemID == 0)
                                return false;

                            items[0] = o.data.DIRECTORIES[searchItemByID(
                                itemID, 'directory')];
                            items[0].type = 'directory';
                        }

                        if ($(items).length > 0) {
                            oClipBoard.items = items;
                            oClipBoard.act = act;

                            o.oGrid.clearAllMasked();
                            for (var i = 0; i < $(items).length; i++) {
                                var item = items[i];
                                o.oGrid.maskedMoveItem(item.id, item.type);
                            }
                        }
                        return true;
                    };

                    var paste = function() {
                        if ((oClipBoard.act != 'copy' && oClipBoard.act != 'move') || oClipBoard.items == null)
                            return;

                        var items = [];
                        var aryDuplicate = [];
                        var messageText = '';
                        var destination = self.getTreeCurrentNode();
                        var destinationChildDirs = searchItemsByParent(destination, 'directory');
                        var destinationChildFiles = searchItemsByParent(destination, 'file');

                        items = oClipBoard.items;

                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type == 'directory') {
                                if (destination.parentID == items[i].id) {
                                    return;
                                }

                                for (var d = 0; d < destinationChildDirs.length; d++) {
                                    if (destinationChildDirs[d].name == items[i].name) {
                                        aryDuplicate.push(destinationChildDirs[d]);
                                    }
                                }
                            }

                            if (items[i].type == 'file') {
                                for (var f = 0; f < destinationChildFiles.length; f++) {
                                    if (destinationChildFiles[f].name == items[i].name) {
                                        aryDuplicate.push(destinationChildFiles[f]);
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type == 'directory') {
                                items[i].childDirs = self.buildDirectoriesTree(items[i]);
                                items[i].childFiles = searchItemsByParent(items[i].id, 'file');
                            }
                        }

                        if (aryDuplicate.length > 0) {
                            oClipBoard.duplicateItems = aryDuplicate;
                            if (aryDuplicate.length > 1) {
                                messageText = 'Các thư mục (files) ';
                                messageText += '<ul>';
                                for (var m = 0; m < aryDuplicate.length; m++) {
                                    messageText += '<li><strong>' + aryDuplicate[m].name + '</strong></li>';
                                }
                                messageText += '</ul>';
                            } else {
                                var type = aryDuplicate[0].type;
                                messageText = type == 'directory' ? 'Thư mục <strong>' + aryDuplicate[0].name + '</strong>' : 'File <strong>' + aryDuplicate[0].name + '</strong>';
                            }
                            messageText += ' đã tồn tại!';

                            var dialogOptions = {
                                title: oClipBoard.act == 'copy' ? 'Sao chép file/thư mục' : 'Di chuyển file/thư mục',
                                message: messageText,
                                buttons: {
                                    'overwrite': {
                                        label: "Ghi đè",
                                        callback: function() {
                                            pasteComplete(items, destination, pasteOption.overwrite);
                                        }
                                    },
                                    'rename': {
                                        label: "Đổi tên",
                                        callback: function() {
                                            pasteComplete(items, destination, pasteOption.rename);
                                        }
                                    },
                                    cancel: {
                                        label: "Hủy bỏ"
                                    }
                                }
                            }
                            bootbox.dialog(dialogOptions);
                        } else {
                            pasteComplete(items, destination, pasteOption.none);
                        }
                    };

                    var pasteComplete = function(items, destination, opt) {
                        if (items.length == 0 || destination == null) return false;
                        var postdata = {
                            act: oClipBoard.act,
                            destination: destination,
                            option: opt,
                            data: JSON.stringify(items)
                        };

                        var script = 'copy';
                        sendCommand({
                            postdata: postdata,
                            script: script,
                            callbackSuccess: function(parseData) {
                                $(parseData.DIRECTORIES).each(
                                    function(index) {
                                        o.data.DIRECTORIES[$(o.data.DIRECTORIES).length] = this;
                                        o.oGrid.maskedMoveItem(this.id, this.type);
                                    });

                                $(parseData.FILES).each(
                                    function(index) {
                                        o.data.FILES[$(o.data.FILES).length] = this;
                                        o.oGrid.maskedMoveItem(this.id, this.type);
                                    });

                                o.data.DIRECTORIES.sort(function(a, b) {
                                    return a.parentID - b.parentID;
                                });

                                if (opt == pasteOption.overwrite) {
                                    for (var i = 0; i < $(oClipBoard.duplicateItems).length; i++) {
                                        var item = oClipBoard.duplicateItems[i];
                                        if (item.type == 'directory') {
                                            o.data.DIRECTORIES.splice(searchItemByID(item.id, 'directory'), 1);
                                        } else {
                                            o.data.FILES.splice(searchItemByID(item.id, 'file'), 1);
                                        }
                                    }
                                }

                                if (oClipBoard.act == 'move') {
                                    if (parseData.deletedFiles.length > 0) {
                                        for (var i = 0; i < parseData.deletedFiles.length; i++) {
                                            o.oGrid.deletion(parseData.deletedFiles[i], 'file');
                                            o.data.FILES.splice(searchItemByID(parseData.deletedFiles[i], 'file'), 1);
                                        }
                                    }

                                    if (parseData.deletedDirs.length > 0) {
                                        for (var i = 0; i < parseData.deletedDirs.length; i++) {
                                            o.oTree.deletion(parseData.deletedDirs[i]);
                                            o.oGrid.deletion(parseData.deletedDirs[i], 'directory');
                                            o.data.DIRECTORIES.splice(searchItemByID(parseData.deletedDirs[i], 'directory'), 1);
                                        }
                                    }
                                }

                                o.oTree.setData(o.data.DIRECTORIES);
                                o.oGrid.setData(o.data);
                                o.oTree.createCopyNode(parseData.DIRECTORIES);
                                o.oGrid.reloadGrid();
                                $(parseData.DIRECTORIES).each(function(index) {
                                    o.oGrid.setHighLightNode(this.id, 'directory')
                                });
                                $(parseData.FILES).each(function(index) {
                                    o.oGrid.setHighLightNode(this.id, 'file')
                                });
                            }
                        });

                        oClipBoard.act == '';
                        oClipBoard.items = null;
                    };

                    /***********************************************
                     * COPY & PASTE & MOVE - END *
                     **********************************************/
                    this.rename = function(item) {
                        rename(item);
                    };

                    this.buildDirectoriesTree = function(objDir) {
                        var parentID = objDir.id;
                        var aryDirs = [];
                        var branch = [];
                        var childDirs = [];
                        var childFiles = [];

                        for (var i = 0; i < o.data.DIRECTORIES.length; i++) {
                            aryDirs[i] = o.data.DIRECTORIES[i];
                        }

                        for (var i = 0; i < aryDirs.length; i++) {
                            if (aryDirs[i].parentID == parentID) {
                                childDirs = self.buildDirectoriesTree(aryDirs[i]);
                                aryDirs[i].childDirs = childDirs;
                                aryDirs[i].childFiles = searchItemsByParent(aryDirs[i].id, 'file');
                                branch.push(aryDirs[i]);
                            }
                        }

                        return branch;
                    };

                    this.searchParents = function(objDir) {
                        var parentID = objDir == undefined ? 0 : objDir.parentID;
                        var aryDirs = [];

                        aryDirs[0] = o.homeNode;
                        for (var i = 1; i <= o.data.DIRECTORIES.length; i++) {
                            aryDirs[i] = o.data.DIRECTORIES[i - 1];
                        }

                        for (var i = 0; i < aryDirs.length; i++) {
                            if (aryDirs[i].id == parentID) {
                                self.searchParents(aryDirs[i]);
                                if ($.inArray(aryDirs[i], aryPath) == -1) aryPath.push(aryDirs[i]);
                            }
                        }
                    };

                    this.deleteItem = function(item) {

                        var confirmText = 'Bạn có muốn xóa ';

                        if ($.isArray(item) && item.length > 1) {
                            confirmText += 'các thư mục (và files) đã chọn?';
                        } else if (item.length == 1) {
                            if (item[0].id == 0)
                                return false;
                            confirmText += (item[0].type == 'directory') ? 'thư mục' : 'file';
                            confirmText += ' <span style="font-weight:bold">' + item[0].name + "</span> không?";
                        }

                        confirmText += '<br /><div style="color:red">(hành động này sẽ xóa tất cả thư mục con và các file trong các thư mục đã chọn)</div>';

                        var parentID = item[0].parentID;

                        for (var i = 0; i < item.length; i++) {
                            if (item[i].type == 'directory') {
                                item[i] = self.getAllDirChilds(item[i]);
                            }
                        }

                        var confirmOptions = {
                            message: confirmText,
                            buttons: {
                                confirm: {
                                    label: "Xóa"
                                },
                                cancel: {
                                    label: "Không xóa"
                                }
                            },
                            callback: function(result) {
                                if (result) {
                                    var delobj = JSON.stringify(item);
                                    var postdata = {
                                        delobj: delobj
                                    };
                                    var script = 'delete';
                                    sendCommand({
                                        postdata: postdata,
                                        script: script,
                                        callbackSuccess: function(parsedData) {
                                            if ($(parsedData.DIRECTORIES).length > 0) {
                                                $(parsedData.DIRECTORIES).each(
                                                    function(index) {
                                                        o.oTree.deletion(this);
                                                        o.oGrid.deletion(this, 'directory');
                                                    });
                                            }

                                            if ($(parsedData.FILES).length > 0) {
                                                $(parsedData.FILES).each(
                                                    function(index) {
                                                        var file = o.data.FILES[searchItemByID(this, 'file')];
                                                        o.oGrid.deletion(this, file.minetype);
                                                    });
                                            }
                                        },
                                        callbackDone: function(parsedData) {
                                            if ($(parsedData.DIRECTORIES).length > 0) {
                                                $(parsedData.DIRECTORIES).each(
                                                    function(index) {
                                                        o.data.DIRECTORIES.splice(searchItemByID(this, 'directory'), 1);
                                                    });
                                            }

                                            if ($(parsedData.FILES).length > 0) {
                                                $(parsedData.FILES).each(
                                                    function(index) {
                                                        o.data.FILES.splice(searchItemByID(this, 'file'), 1);
                                                    });
                                            }

                                            o.oTree.setData(o.data.DIRECTORIES);
                                            o.oGrid.setData(o.data);
                                            self.setTreeCurrentNode(parentID);
                                            o.oGrid.reloadGrid();
                                            self.refreshStatusBar();
                                        },
                                        callbackFail: function() {}
                                    });
                                }
                            }
                        };

                        bootbox.confirm(confirmOptions);
                    };

                    this.getAllDirChilds = function(oDirItem) {
                        var aryChildDirTmp = [];
                        var aryChildDirID = [];
                        var aryChildFiles = searchItemsByParent(
                            oDirItem.id, 'file');
                        var aryChildDirs = [];

                        getAllDirChild(oDirItem.id, aryChildDirTmp);
                        for (var d = 1; d < aryChildDirTmp.length; d++) {
                            aryChildDirID[d - 1] = aryChildDirTmp[d];
                        }

                        for (var j = 0; j < aryChildDirID.length; j++) {
                            if (o.data.DIRECTORIES[searchItemByID(
                                    aryChildDirID[j], 'directory')] != undefined)
                                aryChildDirs[aryChildDirs.length] = o.data.DIRECTORIES[searchItemByID(
                                    aryChildDirID[j],
                                    'directory')];

                            var aryTmp = searchItemsByParent(
                                aryChildDirID[j], 'file');
                            if (aryTmp.length > 0)
                                for (var f in aryTmp) {
                                    aryChildFiles[aryChildFiles.length] = aryTmp[f];
                                }
                        }

                        oDirItem.childDirs = aryChildDirs;
                        oDirItem.childFiles = aryChildFiles;
                        return oDirItem;
                    };

                    this.setTreeCurrentNode = function(treeNode) {
                        // fire when click a node on Tree
                        // then fire action of Grid
                        treeCurrentNode = treeNode;
                        if (o.oGrid) {
                            o.oGrid.reloadGrid();
                            setGridNodeEvent();
                        }
                    };


                    this.getTreeCurrentNode = function() {
                        return treeCurrentNode;
                    };

                    this.gridNodeDblClick = function(node) {
                        if (node.minetype == 'directory') {
                            var treeNode = $('#' + o.tree)
                                .find(
                                    'UL.vstree[rel^="node' + node.parentID + '"] > LI[rel^="folder"] > A#' + node.id);
                            o.oTree.activeNode(treeNode);
                        } else {
                            //execute or preview file                            
                            //off preview for tinyMCE addon
                            //previewFile(node);
                            
                            addonOpenInsertDialog(node);
                        }
                    };

                    this.updateData = function(p) {
                        if (p.item == undefined)
                            p.item = null;
                        if (p.updateAll == undefined)
                            p.updateAll = false;
                        if (p.from == undefined)
                            p.from = null;
                        if (p.type == undefined)
                            p.type = null;
                        if (p.callback == undefined)
                            p.callback = null;

                        var obj = p.from == 'tree' ? o.oGrid : o.oTree;
                        if (!p.updateAll) {
                            var index = searchItemByID(p.item.id, p.type);
                            switch (p.type) {
                                case 'directory':
                                    o.data.DIRECTORIES[index].name = p.item.name;
                                    o.data.DIRECTORIES[index].parentID = p.item.parentID;
                                    break;
                                case 'file':
                                    o.data.FILES[index].name = p.item.name;
                                    o.data.FILES[index].parentID = p.item.parentID;
                                    o.data.FILES[index].minetype = p.item.minetype;
                                    o.data.FILES[index].fileurl = p.item.fileurl;
                                    break;
                                default:
                                    break;
                            }
                        }

                        o.oTree.setData(o.data.DIRECTORIES);
                        o.oGrid.setData(o.data);

                        if (p.callback != null) {
                            eval('obj.' + p.callback + '(p.item);')
                        }

                        // call sendCommand
                    };

                    this.searchItemsByParent = function(parentID, type) {
                        return searchItemsByParent(parentID, type);
                    };

                    this.searchItemByID = function(id, type) {
                        return searchItemByID(id, type);
                    };

                    this.refreshStatusBar = function() {
                        var totalSize = 0;
                        var message = '';
                        if (o.data.FILES.length > 0) {
                            for (var i = 0; i < o.data.FILES.length; i++) {
                                totalSize += parseInt(o.data.FILES[i].size);
                            }
                        }

                        message = '<span>Tổng dung lượng đã sử dụng: <strong>' + self.formatFileSize(totalSize, 2) + '</strong></span>';

                        var items = o.oGrid.getHighLightItem();
                        if (items.length == 0) {
                            var id = $(o.oTree.getSelectedNode()).attr('id');
                            var item = o.data.DIRECTORIES[self.searchItemByID(id, 'directory')];
                        }
                        if (items.length == 1) {
                            if ((typeof items[0].minetype !== 'undefined')) {
                                message += '<span>Tệp: <strong>' + items[0].name + '</strong></span>';
                                message += '<span> - Dung lượng: <strong>' + self
                                    .formatFileSize(items[0].size, 2) + '</strong></span>';
                            } else {
                                message += '<span>Thư mục: <strong>' + items[0].name + '</strong></span>';
                            }
                        } else if (items.length > 1) {
                            var selectedSize = 0;
                            for (var i = 0; i < items.length; i++) {
                                selectedSize += (typeof items[i].minetype !== 'undefined') ? parseInt(items[i].size) : 0;
                            }
                            message += '<span><strong>' + items.length + ' tệp (thư mục)</strong> được chọn</span>';
                            message += '<span> - Dung lượng: <strong>' + self
                                .formatFileSize(selectedSize, 2) + '</strong></span>';
                        }

                        $(statusbar).html(message);
                    };

                    this.refreshNavigator = function() {
                        var navigatorBar = $('DIV#' + o.navigationbar + ' > UL.breadcrumb');
                        $(navigatorBar).find('LI').remove();

                        var nodeID = self.getTreeCurrentNode();
                        nodeID = nodeID == undefined ? 0 : nodeID;
                        if (nodeID != 0) {
                            var node = o.data.DIRECTORIES[searchItemByID(nodeID, 'directory')];
                            self.searchParents(node);
                            aryPath.push(node);
                        } else {
                            if (o.homeNode == null) self.setHomeNode();
                            aryPath.push(o.homeNode);
                        }

                        for (var idx = 0; idx < aryPath.length; idx++) {
                            if (aryPath[idx] != undefined) {
                                var i = $('<i></i>', {
                                    'class': 'ace-icon fa fa-folder home-icon'
                                });
                                var a = $('<a></a>', {
                                    text: aryPath[idx].name,
                                    class: 'breadcrumb-link',
                                    'data-id': aryPath[idx].id
                                });
                                bindNavigationBarEvents(a);
                                var li = $('<li></li>');
                                if (aryPath[idx].id == 0)
                                    $(li).append(i, a);
                                else
                                    $(li).append(a);

                                $(navigatorBar).append(li);
                            }
                        }

                        aryPath.splice(0, aryPath.length);
                    };

                    var bindNavigationBarEvents = function(item) {
                        if (item == null) return false;
                        $(item).bind('click', function(e) {
                            breadcrumbClick(this);
                        });
                    }

                    var breadcrumbClick = function(item) {
                        var id = $(item).attr('data-id');
                        var node = o.data.DIRECTORIES[searchItemByID(id, 'directory')];
                        var parentID = id == 0 ? '-1' : node.parentID;
                        var treeNode = $('#' + o.tree).find('UL.vstree[rel^="node' + parentID + '"] > LI[rel^="folder"] > A#' + id);
                        o.oTree.activeNode(treeNode);
                    }

                    this.redirectPost = function(location, args) {
                        var form = '';
                        $.each(args, function(key, value) {

                            form += "<input type='hidden' name='" + key + "' value='" + value + "'>";
                        });
                        $(
                            '<form action="' + location + '" method="POST">' + form + '</form>').appendTo(
                            'body').submit();
                    };

                    this.formatFileSize = function(size, decimal) {
                        var i;
                        i = Math.floor(Math.log(size) / Math.log(1024));
                        if ((size === 0) || (parseInt(size) === 0)) {
                            return "0 kB";
                        } else if (isNaN(i) || (!isFinite(size)) || (size === Number.POSITIVE_INFINITY) || (size === Number.NEGATIVE_INFINITY) || (size == null) || (size < 0)) {
                            console.info("Throwing error");
                            throw Error("" + size + " did not compute to a valid number to be humanized.");
                        } else {
                            return (size / Math.pow(1024, i))
                                .toFixed(decimal) * 1 + " " + ["B", "KB", "MB", "GB",
                                    "TB", "PB", "EB", "ZB",
                                    "YB"
                                ][i];
                        }
                    };

                    this.removeVietnameseSign = function(str) {
                        str = str.toLowerCase();
                        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
                        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
                        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
                        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
                        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                        str = str.replace(/đ/g, "d");
                        str = str.replace(/^\-+|\-+$/g, "");
                        return str.toUpperCase();
                    }

                    this.setHomeNode = function() {
                        o.homeNode = {
                            id: 0,
                            name: o.oTree.getRootName(),
                            parentID: -1
                        };
                    };

                    this.getFileHosting = function() {
                        return o.filehosting;
                    };
                    this.getFileDomain = function() {
                        return o.filedomain;
                    };

                    this.initialize = function() {
                        init();
                        return this;
                    };

                    return this.initialize();
                }

            });
    })(jQuery);