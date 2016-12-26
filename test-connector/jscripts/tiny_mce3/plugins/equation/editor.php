<?php
// If you change the default engine, then you must also set up a <your site>/gif.latex? redirect to point to rawequation.php the .htaccess that you'll need to define in the root directory of your website.
define('DEFAULT_LANGUAGE','vi-vn');     // you can use any language file that is specified in the /lang directory
require 'lang/language.php';
if(isset($_GET['target'])) $target=$_GET['target']; else $target='';
if(isset($_GET['phpBB'])) $type='phpBB';
else if(isset($_GET['html'])) $type='html';
else $type='latex';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="copyright" content="Copyright CodeCogs 2007-2008
 Written by Will Bateman.

 GNU General Public License Agreement
 Copyright (C) 2004-2008 CodeCogs, Zyba Ltd, Broadwood, Holford, TA5 1DU, England.
 This program is free software; you can redistribute it and/or modify it under
 the terms of the GNU General Public License as published by Free Software Foundation,
 either version 3 of the License, or (at your option) any later version.
 You must retain a copy of this licence in all copies.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 PARTICULAR PURPOSE. See the GNU General Public License for more details.

 See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>."/>
<title>LaTeX Equation Editor for the Internet</title>
<meta name="robots" content="index, nofollow"/>
<meta name="description" content="A web-based LaTeX equation editor that generates graphical equations (gif, png, swf, pdf). It also provides the HTML code for directly embedding the equations into any website, forum or blog. Images may also be used directly within your offline documentation. Open source and XHTML compliant."/>
<meta name="keywords" content="LaTeX, equation editor, open source, equations, mimetex, pdf, gif, png, swf, instantly rendered, preview, free"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<link rel="stylesheet" href="css/equation.css" type="text/css"/>
<script src="js/eq_fck.js" type="text/javascript"></script>
<script src="js/editor.js" type="text/javascript"></script>
<script src="js/clipboard.js" type="text/javascript"></script>
<script type="text/javascript">AC_FL_RunContent = 0;</script>
<script src="js/eq_flash.js" type="text/javascript"></script>
<script type="text/javascript">
// Send the equation to the opening window.
var cctarget = '<?php echo $target;?>';
var cctype = '<?php echo $type;?>';
</script>
</head>
<body onload="init(); LoadSelected();">
<div id="hover"></div>
<div class="center">
<div class="top">

<?php
if(isset($_GET['lang']))
{
  $lang=$_GET['lang'];
	if(!is_file('lang/'.$lang.'.php')) $lang=DEFAULT_LANGUAGE;
} else $lang=DEFAULT_LANGUAGE;

require('lang/'.$lang.'.php');
?>
&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://en.wikipedia.org/wiki/Help:Formula" target="_blank"><img src="http://www.codecogs.com/images/icons/i.gif" alt="help" align="bottom" width="13" height="13" border="0"/></a>
</div>
<div class="top">
<img id="undobutton" src="http://www.codecogs.com/images/buttons/undo-x.gif" width="20" height="13" alt="undo" title="undo" style="vertical-align:bottom" onclick="undo('latex_formula');"/>
<img id="redobutton" src="http://www.codecogs.com/images/buttons/redo-x.gif" width="20" height="13" alt="redo" title="redo" style="vertical-align:bottom; margin-right:20px" onclick="redo('latex_formula');" />
<select name="fontsize" id="fontsize" title="<?php echo $lang['size_title']; ?>" onchange="textchanged();">
  <option value="\tiny">(8pt) <?php echo $lang['tiny']; ?></option>
  <option value="\small">(10pt) <?php echo $lang['small']; ?></option>
  <option value="" selected="selected">(12pt) <?php echo $lang['normal']; ?></option>
  <option value="\large">(14pt) <?php echo $lang['large']; ?></option>
  <option value="\huge">(20pt) <?php echo $lang['huge']; ?></option>
</select>

<select title="<?php echo $lang['color_title']; ?>" onchange="insertText(this.options[this.selectedIndex].value, this.options[this.selectedIndex].value.length-1); this.selectedIndex=0">
  <option selected="selected" value="" style="color:#8080ff"><?php echo $lang['color']; ?>...</option>
  <option value="{\color{red} }" style="color:red"><?php echo $lang['red']; ?></option>
  <option value="{\color{green} }" style="color:green"><?php echo $lang['green']; ?></option>
  <option value="{\color{blue} }" style="color:blue"><?php echo $lang['blue']; ?></option>
</select>
<select name="history" id="history" title="<?php echo $lang['history_title']; ?>" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff"><?php echo $lang['history']; ?>...</option>
</select>
<select name="favorites" id="favorites" title="<?php echo $lang['favorites_title']; ?>" onchange="insertText(this.options[this.selectedIndex].value);">
  <option selected="selected" value="" style="color:#8080ff"><?php echo $lang['favorites']; ?>...</option>
<?php
  foreach($_COOKIE as $a=>$b)
	{
	  if(substr($a,0,3)=='eq_')
		{
      $a = str_replace(array('&plus;','&space;'),array('+',' '),urldecode($a));
      $b = str_replace('&plus;','+',urldecode($b));
		  echo('<option value="'.htmlentities($b).'">'.htmlentities(substr($a,3)).'</option>');
		}
	}
?>
</select>&nbsp;<img src="images/add.gif" width="11" height="12" onclick="addfavorite('favorites');" alt="plus" title="<?php echo $lang['favorites_add']; ?>"/>&nbsp;<img src="images/sub.gif" width="11" height="12" onclick="deletefavorite('favorites')" alt="minus" title="<?php echo $lang['favorites_delete']; ?>"/>
</div>

<div id="toolbar_wrapper">
<div id="toolbar">
<div class="panel" id="panel1" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/operators_panel.tpl'; ?>
</div>

<div class="panel" id="panel2" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/brackets_panel.tpl'; ?>
</div>

<div class="panel2" id="panel3" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/greekletters_panel.tpl'; ?>
</div>

<div class="panel2" id="panel4" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/relations_panel.tpl'; ?>
</div>

<div class="panel2" id="panel5" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/arrows_panel.tpl'; ?>
</div>

<div class="panel2" id="panel6" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/accents_panel.tpl'; ?>
</div>

<div class="panel" id="panel7" onmouseover="this.style.overflow='visible'" onmouseout="this.style.overflow='hidden'">
<?php require 'panels/matrix_panel.tpl'; ?>
</div>

</div>
</div>


<div id="toolbar_space" class="bottom"></div>
<textarea name="latex_formula" id="latex_formula" cols="80" rows="8" onkeyup="textchanged(); autorenderEqn(10)" onkeydown="countclik(this);"></textarea>

<div style="padding:3px; display:none;">
<select id="format" name="format" onchange="formatchanged();" title="Select the output format for the rendered equation">
  <option value="gif">gif</option>
  <option value="png">png</option>
  <option value="pdf">pdf</option>
  <option value="swf">swf</option>
</select>
<select id="dpi" name="dpi" onchange="textchanged();" title="Select the output resolution">
  <option value="100">100 dpi</option>
  <option value="200">200 dpi</option>
  <option value="300">300 dpi</option>
</select>
<select id="bg" name="bg" onchange="textchanged();" title="Background color">
  <option value="transparent">transparent</option>
  <option value="white">white</option>
  <option value="black">black</option>
  <option value="red">red</option>
  <option value="green">green</option>
  <option value="blue">blue</option>
</select>
<input type="checkbox" id="inline" name="inline" title="<?php echo $lang['inline_title']; ?>" onchange="textchanged(); document.getElementById('compressed').checked=this.checked;" /> <label for="eqstyle"><?php echo $lang['inline']; ?></label>
<input type="checkbox" id="compressed" name="compressed" title="<?php echo $lang['compressed_title']; ?>" onchange="textchanged();"/> <label for="eqstyle2"><?php echo $lang['compressed']; ?></label>
</div>

<div>
  <input type="button" class="lightbluebutton" onclick="cleartext()" value="<?php echo $lang['clear']; ?>" title="<?php echo $lang['clear_title']; ?>"/>
  <input id="renderbutton" type="button" class="greybutton" onclick="renderEqn(null)" value="<?php echo $lang['render']; ?>" title="<?php echo $lang['render_title']; ?>" />
  <div style="display:none">
    <input id="copybutton" type="button" class="greybutton" onclick="updateOpener(cctarget,cctype);" value="<?php echo $lang['copy']; ?>" />
    <input id="clipboardbutton" type="button" class="greybutton" onclick="copy(document.getElementById('latex_formula').value);" value="<?php echo $lang['copy_clipboard']; ?>" />
  </div>
  <input id="insertbutton" type="button" class="greybutton" onclick="insertEquation();" value="OK" />
</div>

<div id="equationcomment"><strong><?php echo $lang['intro']; ?></strong></div>

<img id="equationview" name="equationview" />
<script type="text/javascript">
var el = document.getElementById('equationview');
el.onload = processEquationChange;
el.src = "http://www.codecogs.com/images/spacer.gif";
</script>
</div>

<div id="footer">
<div style="position:absolute; left:5px; bottom:15px">
  <p><strong><a href="http://www.codecogs.com/components/equationeditor/equation_install.php" target="_blank">ver 2.6</a></strong></p>
  <p><a href="http://www.codecogs.com" target="_blank"><img src="http://www.codecogs.com/images/poweredbycc.gif" width="102" height="34" vspace="5" border="0"/></a></p>
</div>
<p style="font-size:10px">CodeCogs &copy; 2007-2008. <?php echo $lang['credits']; ?></p>
</div>
<iframe id="download" name="download" height="0" frameborder="0" src=""></iframe>
<script>
  function insertEquation() {
    renderEqn();
    var src = document.getElementById('equationview').src;
    if (src=="") {
      alert('Bạn phải nhập vào công thức');
      return;
    }
    window.returnValue = src;
  	window.close();

  	var isMSIE  = (navigator.appName == 'Microsoft Internet Explorer');
		var isGecko = navigator.userAgent.indexOf('Gecko') != -1;

    if (isGecko) { // Gecko
			<?php
				if (!empty($_REQUEST['callback'])) {
					echo "opener." . @$_REQUEST['callback'] . "('" . @$_REQUEST['editor'] . "',this);\n";
				};
			?>
		}
  }

  function init() {
    var args = window.dialogArguments;
		if (args) {										// if dialog argument are available
			if (args.src) { 							// source is image and maybe also link
			  if (args.src.match(/latex\?/)) {

			    var latex = args.src.split(/latex\?/);
			    document.getElementById('latex_formula').value = unescape(latex[1]);
				  document.getElementById('equationview').src = args.src;
			  }
			}
		}
  }
</script>
</body>
</html>