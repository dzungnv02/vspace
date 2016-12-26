var appUrl = 'http://space.donganh.edu.vn';
var dialog = null;
var editorId = null;

function openWindow() {
	dialog = bootbox.dialog({
		title: 'Violet Space',
		message: '<iframe id="frmWindow" src="' + appUrl + '/?mode=plugin" width="100%" height="100%"></iframe>',
		closeButton: true,
		show: false,
		backdrop: false,
		onEscape: function() {
			console.log('onEscape');
		},
	});

	$(dialog).find('.modal-dialog').css('width', '800px')
	$(dialog).find('.modal-dialog').find('.modal-body').css({
		'height': '500px',
		'padding': '0px'
	});
	$(dialog).find('.modal-dialog').find('.modal-header').css({
		'height': '35px',
		'padding': '3px'
	});
	$(dialog).find('.modal-dialog').find('.modal-header h4').css({
		'font-size': '16px',
		'padding-left': '10px',
		'padding-top': '3px'
	});
	$(dialog).find('.modal-dialog').find('.modal-header .close').css({
		'margin-right': '5px',
		'margin-top': '2px'
	});
	$(dialog).find('.modal-dialog').find('.bootbox-body').css('height', '100%');
	$(dialog).find('.modal-dialog').find('.bootbox-body').find('IFRAME').css('border', 'none');
	dialog.modal('show');
}

function insertContent(content) {
	if (typeof content == 'object') {
		var item = content.data;
		tinyMCE.execInstanceCommand(editorId, content.command,
			false, renderHTML(item));
		dialog.modal('hide');
	}
}

function renderHTML(item) {
	var html = '';
	if (typeof item == 'object') {
		var desc = item.description.trim() == '' ? item.name : item.description;
		switch (item.tag) {
			case 'img':
				html = '<' + item.tag + ' src="' + item.src + '" width="' + item.width + '" alt="' + desc + '" />';
				if (item.align == 'center' || item.align == 'right') {
					var imgContainer = $('<div></div').css('text-align', item.align);
					$(imgContainer).append(html);
					html = imgContainer.get(0).outerHTML;
				}
				break;
			case 'video':
				var videoObj = $('<video></video>', {
					'width': item.width,
					'height': item.height,
					'controls': true
				});
				$(videoObj).append($('<source />', {
					'src': item.src,
					'type': 'video/webm'
				}));
				html = videoObj.get(0).outerHTML;
				break;
			case 'audio':
				html = '';
				break;
			case 'flash':
				html = '';
				break;
			default:
				html = '<a href="' + item.src + '">' + item.src + '</a>';
				break
		}
	}
	return html;
}

window.addEventListener('message', function(event) {
	if (event.origin != appUrl) return false;
	insertContent(JSON.parse(event.data));
}, false);