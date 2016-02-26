function flashObject(url, id, width, height, version, bg, flashvars, params, att)
{
	var pr = '';
	var attpr = '';
	var fv = '';
	var nofv = 0;
	for(i in params)
	{
		pr += '<param name="'+i+'" value="'+params[i]+'" />';
		attpr += i+'="'+params[i]+'" ';
		if(i.match(/flashvars/ig))
		{
			nofv = 1;
		}
	}
	if(nofv==0)
	{
		fv = '<param name="flashvars" value="';
		for(i in flashvars)
		{
			fv += i+'='+escape(flashvars[i])+'&';
		}
		fv += '" />';
	}
	htmlcode = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="'+width+'" height="'+height+'">'
+'	<param name="movie" value="'+url+'" />'+pr+fv
+'	<embed src="'+url+'" width="'+width+'" height="'+height+'" '+attpr+'type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"></embed>'
+'</object>';
	document.getElementById(id).innerHTML=htmlcode;
}

/*<script type="text/javascript" src="http://www.webestools.com/page/js/flashobject.js"></script>
<div id="player_7532" style="display:inline-block;">
	<a href="http://get.adobe.com/flashplayer/">You need to install the Flash plugin</a> - <a href="http://www.webestools.com/">http://www.webestools.com/</a>
</div>
<script type="text/javascript">
	var flashvars_7532 = {};
	var params_7532 = {
		quality: "high",
		wmode: "transparent",
		bgcolor: "#ffffff",
		allowScriptAccess: "always",
		allowFullScreen: "true",
		flashvars: "fichier=http%3A%2F%2Fflash.webestools.com%2Fflv_player%2Fextract_elephant_dream.flv&auto_play=true&apercu=http%3A%2F%2Fflash.webestools.com%2Fflv_player%2Fextract_elephant_dream.png"
	};
	var attributes_7532 = {};
	flashObject("http://flash.webestools.com/flv_player/v1_27.swf", "player_7532", "720", "405", "8", false, flashvars_7532, params_7532, attributes_7532);
</script>*/