$.extend(
	$.fn, {
		vsViewLayout: function(o) {
			if (o == null) o = {};
			if (o.maincontainer == undefined)
				o.maincontainer = null;
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

			var aryButtons = $(o.toolsbar).find('BUTTON');

			var maxWidth = 0;

			var self = this;

			var init = function() {
				layoutRender();

				$(aryButtons).each(function(index) {
					var button = this;
					var func = $(button).attr('data-act');
					$(button).bind('click', function(e) {
						eval('objController.' + func + '();');
					});
				});

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
	
			var validateCreateFolder = function(foldername, customErr) {
				if (customErr == undefined) customErr = null;
				var errMsg = '';
				var objErr= $('FORM#createFolderForm DIV.help-block[for="foldername"]');
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
				}
				else return true;
			};

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
					.on('shown.bs.modal', function() {})
					.on('hide.bs.modal', function(e) {})
					.modal('show');

				$(dlg).find('DIV.modal-dialog').css('width', '350px');
				var btnOK = $(dlg).find('DIV.modal-dialog FORM#createFolderForm BUTTON#btnOK');
				var form = $(dlg).find('DIV.modal-dialog FORM#createFolderForm');

				$(btnOK).unbind('click').bind('click', function(e) {
					$(form).submit();
				});

				$(form).on('submit', function (e) {
					var newFolderName = $(dlg).find('DIV.modal-dialog').find('FORM#createFolderForm INPUT[name="foldername"]').val().trim();
					var destination = objTree.getSelectedNode();
					objSpaceModel.createFolder(newFolderName, destination, dlg, validateCreateFolder);
					e.preventDefault();
					return false;
				});
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