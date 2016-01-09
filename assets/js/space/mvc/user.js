var submitCount = false;
$.extend(
	$.fn, {
		vsUser: function(o) {
			if (o == null) o = {};
			var formHTML = $('#loginForm');
			var loginButton = $(formHTML).find('BUTTON#btnLogin');
			var loginDlg = null;
			var self = this;

			var init = function() {};

			this.validateLogin = function(username, password, customErr) {
				if (customErr == null) {
					var usernameMsg = '';
					var passwordMsg = '';
					if (username == '') {
						usernameMsg = 'Bạn hãy nhập Username!';
					}

					if (password == '') {
						passwordMsg = 'Bạn hãy nhập Password!';
					}

					if (usernameMsg != '') {
						$(formHTML).find('DIV.help-block[for="username"]').parent().parent().addClass('has-error');
						$(formHTML).find('DIV.help-block[for="username"]').parent().find('INPUT').focus();
						$(formHTML).find('DIV.help-block[for="username"]').text(usernameMsg);
						$(formHTML).find('DIV.help-block[for="username"]').show();
					} else {
						$(formHTML).find('DIV.help-block[for="username"]').parent().parent().removeClass('has-error');
						$(formHTML).find('DIV.help-block[for="username"]').text('');
						$(formHTML).find('DIV.help-block[for="username"]').hide();
					}

					if (passwordMsg != '') {
						$(formHTML).find('DIV.help-block[for="password"]').parent().parent().addClass('has-error');
						$(formHTML).find('DIV.help-block[for="password"]').parent().find('INPUT').focus();
						$(formHTML).find('DIV.help-block[for="password"]').text(passwordMsg);
						$(formHTML).find('DIV.help-block[for="password"]').show();
					} else {
						$(formHTML).find('DIV.help-block[for="password"]').parent().parent().removeClass('has-error');
						$(formHTML).find('DIV.help-block[for="password"]').text('');
						$(formHTML).find('DIV.help-block[for="password"]').hide();
					}

					if (usernameMsg !== '' || passwordMsg !== '') return false;
					else return true;
				} else {
					$(formHTML).find('DIV.help-block[for="' + customErr.el + '"]').parent().parent().addClass('has-error');
					$(formHTML).find('DIV.help-block[for="' + customErr.el + '"]').parent().find('INPUT').focus();
					$(formHTML).find('DIV.help-block[for="' + customErr.el + '"]').text(customErr.err);
					$(formHTML).find('DIV.help-block[for="' + customErr.el + '"]').show();
				}
			}

			this.showLogin = function() {
				loginDlg = bootbox.dialog({
						title: 'Login',
						message: formHTML,
						show: false
					})
					.on('shown.bs.modal', function() {
						$(formHTML).show();
						$(formHTML).find('INPUT')[0].focus();
						$(formHTML).find('INPUT')[0].select();
					})
					.on('hide.bs.modal', function(e) {
						$(formHTML).find('DIV.help-block[for="username"]').parent().parent().removeClass('has-error');
						$(formHTML).find('DIV.help-block[for="username"]').text('');
						$(formHTML).find('DIV.help-block[for="username"]').hide();
						$(formHTML).find('DIV.help-block[for="password"]').parent().parent().removeClass('has-error');
						$(formHTML).find('DIV.help-block[for="password"]').text('');
						$(formHTML).find('DIV.help-block[for="password"]').hide();
						$(formHTML).hide();
					}).modal('show');
					$(loginDlg).find('DIV.modal-dialog').css('width', '350px');


				$(loginButton).unbind('click').bind('click', function(event) {
					submitCount = false;
					$(formHTML).submit();
				});

				$(formHTML).on('submit', function (e) {
					var username = $(formHTML).find('INPUT[name="username"]').val().trim();
					var password = $(formHTML).find('INPUT[name="password"]').val().trim();					
					if (submitCount == false) objSpaceModel.login(username, password,loginDlg,self.validateLogin);					
					submitCount = true;					
					e.preventDefault();
				});
			}

			this.initialize = function() {
				init();
				return this;
			};

			return this.initialize();
		}
	});