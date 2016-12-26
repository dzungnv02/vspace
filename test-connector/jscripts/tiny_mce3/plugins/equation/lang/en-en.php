<?php
/*
 Copyright CodeCogs 2007-2008
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
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*************************
This language file defines the key wording within the equation editor. It is organised in two parts. 
The first is a selection of $lang[...] defintions that define many of the labels, words and phrases on the website. 

When changing these, only update the text on the right. i.e. 
  $lang['help']='Help'; 
becomes
  $lang['help']='Hilfe';

The second section is pure HTML and allows customisation for the drop down list of options displayed along the top of the page. Again only change the text on right within each option section, i.e

  <option value="\S">(&sect;) section</option>
may become
  <option value="\S">(&sect;) abschnitt</option>

N.B. Where you see '//' this is a comment to help you understand what that particular language definition refers to - please don't change this text. 

Please send all updates to me at will@zyba.com. Suitable language files will be added to the next release.
**************************/

$lang=array();

$lang['english']='English';
$lang['usa']='America';
$lang['french']='French';
$lang['german']='German';
$lang['italian']='Italian';
$lang['spanish']='Spanish';

$lang['help']='Help';

$lang['size_title']='Equation Font Size';
$lang['tiny']='Tiny';  // this refers to a font size of tiny
$lang['small']='Small'; 
$lang['normal']='Normal'; 
$lang['large']='Large'; 
$lang['huge']='Huge'; 

$lang['color']='Colours';   // Displayed like "Colors...", allowing users to display equations in new colors
$lang['color_title']='Equation Colour';
$lang['red']='red';
$lang['green']='green';
$lang['blue']='blue';

$lang['history']='History';  // Displayed like 'History...', shows recent equations a user has typed
$lang['history_title']='A history of recently entered equations';

$lang['favorites']='Favorites';  // Displayed like 'Favorites...', shows a used saved (favorite) equations
$lang['favorites_title']='A dynamic list for you to create of your favorite equations';
$lang['favorites_add']='add current equation to favorites';  // adds an equation to the favorite list
$lang['favorites_delete']='delete currently selected equation from favorites';  // removes an equation from the favorite list


$lang['inline']='Inline';          // place equations inline within text in the parent document
$lang['inline_title']='Place equations inline with other text (by default equations are placed on a new line)';

$lang['compressed']='Compressed';  // create equations with restricted vertical height
$lang['compressed_title']='Create equations that are vertically compressed, suitable for being inline with other text';

$lang['clear']='Clear';
$lang['clear_title']='Clear the editor window';

$lang['render']='Render Equation';
$lang['render_title']='Click to see your equation rendered below';

$lang['copy']='Copy to Document';
$lang['copy_clipboard']='Copy to Clipboard';
$lang['click_here']='click here';

$lang['intro']='Type your LaTeX equation in the box above and click Render Expression to see it displayed here.';

$lang['updated']='Last updated on';  // .. 27/6/2008
$lang['refresh']='(Refresh your browser if you\'ve used an older edition)';
$lang['dev']='Written by Will Bateman with assistance from Steve Mayer.';

// This message appears at the bottom of the screen when the editor is first loaded.
$lang['install']='To Install this editor on your website,';

// Credits
$lang['credits']='Written by <a href="http://www.codecogs.com" target="_blank">Will Bateman</a> and <a href="http://www.mayer.dial.pipex.com/tex.htm" target="_blank">Steve Mayer</a>.';

?>
<select title="Spaces" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Spaces...</option>
  <option value="\,">thin</option>
  <option value="\:">medium</option>
  <option value="\;">thick</option>
  <option value="\!">negative</option>
</select>
<select title="Styles" onchange="insertText(this.options[this.selectedIndex].value, 1000); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Style...</option>
  <optgroup label="Equation Only">
  <option value="\mathbb{}" title="\mathbb{}">Blackboard</option>
  <option value="\mathbf{}" title="\mathbf{}">Bold</option>
  <option value="\boldsymbol{}" title="\boldsymbol{}">Bold Greek</option>
  <option value="\mathit{}" title="\mathit{}">Italic</option>
  
  <option value="\mathrm{}" title="\mathrm{}">Roman</option>
  <option value="\mathfrak{}" title="\mathfrak{}">Fraktur</option>
  </optgroup>
  <optgroup label="Text Only">
  <option value="\texttt{}" title="\texttt{}">Typewriter</option>
  <option value="\textup{}" title="\textup{}">Upright</option>
  <option value="\textbf{}" title="\textbf{}">Bold</option>
  <option value="\textit{}" title="\textit{}">Italic</option>
  <option value="\textrm{}" title="\textrm{}">Roman</option>
  <option value="\textsl{}" title="\textsl{}">Slanted</option>
  <option value="\textsc{}" title="\textsc{}">SMALL CAPS</option>
  <option value="\emph{}"   title="\emph{}">Emphasis</option>
  </optgroup>
</select>
<select title="Functions" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Functions&hellip;</option>
  <option value="\arg">arg</option>
  <option value="\deg">degree</option>
  <option value="\det">det</option>
  <option value="\dim">dim</option>
  <option value="\gcd">gcd</option>
  <option value="\hom">hom</option>
  <option value="\ker">ker</option>
  <option value="\partial">partial</option>
  <option value="\Pr">Pr</option>
  <option value="\sup">sup</option>  
  <optgroup label="Logs">
  <option value="\exp">exp</option>
  <option value="\lg">lg</option>
  <option value="\ln">ln</option>
  <option value="\log">log</option>
  <option value="\log_{e}">log e</option>
  <option value="\log_{10}">log 10</option>
  </optgroup>
  <optgroup label="Limits">
  <option value="\lim">limit</option>
  <option value="\liminf">liminf</option>
  <option value="\limsup">limsup</option>
  <option value="\max">maximum</option>
  <option value="\min">minimum</option>
  <option value="\infty">infinite</option> 			
  </optgroup>  
  <optgroup label="Trig">
  <option value="\sin">sin</option>
  <option value="\cos">cos</option>
  <option value="\tan">tan</option>
  <option value="\sin^{-1}">sin-1</option>
  <option value="\cos^{-1}">cos-1</option>
  <option value="\tan^{-1}">tan-1</option> 
  <option value="\csc">csc</option>
  <option value="\sec">sec</option>
  <option value="\cot">cot</option>
  <option value="\sinh">sinh</option>
  <option value="\cosh">cosh</option>
  <option value="\tanh">tanh</option>
  <option value="\coth">coth</option>
  <option value="\sinh^{-1}">sinh-1</option>
  <option value="\cosh^{-1}">cosh-1</option>
  <option value="\tanh^{-1}">tanh-1</option> 
  </optgroup>
  <optgroup label="Complex">
  <option value="\Re">Real</option>
  <option value="\Im">Imaginary</option>
  <option value="\imath">i</option>
  <option value="\jmath">j</option>
  </optgroup>
</select>
<select title="Foreign Characters" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Foreign...</option>
  <option value="\oe">&oelig;</option>
  <option value="\OE">&OElig;</option>
  <option value="\ae">&aelig;</option>
  <option value="\AE">&AElig;</option>
  <option value="\aa">&aring;</option>
  <option value="\AA">&Aring;</option>
  <option value="\ss">&szlig;</option>
  <option value="\S">(&sect;) section</option>
  <option value="\P">(&para;) paragraph</option>
  <option value="\o">o</option>
  <option value="\O">O</option>
  <option value="\l">l</option>
  <option value="\L">L</option>
  <option value="\dag">dagger</option>
  <option value="\ddag">double dagger</option>
  <option value="\copyright">&copy;</option>
  <option value="\pounds">&pound;</option>
</select>
<select title="Symbols" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Symbols...</option>
	<option value="\pm" title="\pm">(&plusmn;) plus or minus</option>
  <option value="\mp" title="\mp">minus or plus</option>
  <option value="\times">(&times;) times</option>
  <option value="\div" title="\div">(&divide;) divided by</option>
  <option value="\ast" title="\ast">(&lowast;) asterisk</option>
  <option value="\star">(*) star</option>
  <option value="\circ" title="\circ">circle</option>
  <option value="^{\circ}" title="^{\circ}">degree symbol</option>
  <option value="\bullet">(&bull;) bullet</option>
  <option value="\cdot">(&middot;) center dot</option>
  <option value="\uplus">u plus</option>
  <option value="\sqcap">square cap</option>
  <option value="\sqcup">square cup</option>
  <option value="\vee">(&or;) vee</option>
  <option value="\wedge">(&and;) wedge</option>
  <option value="\diamond">(&loz;) diamond</option>
  <option value="\bigtriangleup">big triangle up</option>
  <option value="\bigtriangledown">big triangle down</option>
  <option value="\triangleleft">triangle left</option>
  <option value="\triangleright">triangle right</option>
  <option value="\lhd">large triangle left</option>
  <option value="\rhd">large triangle right</option>
  <option value="\oplus">(&oplus;) circle plus</option>
  <option value="\ominus">circle minus</option>
  <option value="\otimes">(&otimes;) circle times</option>
  <option value="\oslash">circle slash</option>
  <option value="\odot">circle dot</option>
  <option value="\bigcirc">big circle</option>  
  <option value="\dagger">(&dagger;) dagger</option>
  <option value="\ddagger">(&Dagger;) double dagger</option>
  <option value="\amalg">coproduct</option>
</select>