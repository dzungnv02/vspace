<!-- The login modal. Don't display it initially -->
<form id="loginForm" action="/login" method="post" class="form-horizontal" style="display:none;">
    <div class="form-group">
        <label class="col-xs-3 control-label">Username</label>
        <div class="col-xs-9">
            <input type="text" class="form-control" name="username" placeholder="Username" />
            <div class="help-block" style="display:none" for="username"></div>
        </div>
    </div>

    <div class="form-group">
        <label class="col-xs-3 control-label">Password</label>
        <div class="col-xs-9">
            <input type="password" class="form-control" name="password" placeholder="Password"/>
            <div class="help-block" style="display:none" for="password"></div>
        </div>
    </div>

    <div class="form-group">
        <div class="col-xs-9 col-xs-offset-3">
            <button id="btnLogin" type="submit" class="btn btn-success">Login</button>
        </div>
    </div>
</form>