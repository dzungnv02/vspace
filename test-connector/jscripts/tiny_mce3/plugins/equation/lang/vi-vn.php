<?php
$lang=array();

$lang['english']='English';
$lang['usa']='America';
$lang['french']='French';
$lang['german']='German';
$lang['italian']='Italian';
$lang['spanish']='Spanish';
$lang['vietnamese']='Tiếng Việt';

$lang['help']='Trợ giúp';

$lang['size_title']='Cỡ chữ cho công thức';
$lang['tiny']='Rất nhỏ';  // this refers to a font size of tiny
$lang['small']='Nhỏ';
$lang['normal']='Bình thường';
$lang['large']='Lớn';
$lang['huge']='Rất lớn';

$lang['color']='Màu sắc';   // Displayed like "Colors...", allowing users to display equations in new colors
$lang['color_title']='Màu sắc cho công thức';
$lang['red']='đỏ';
$lang['green']='xanh lục';
$lang['blue']='xanh lam';

$lang['history']='Công thức gần đây';  // Displayed like 'History...', shows recent equations a user has typed
$lang['history_title']='Danh sách các công thức được soạn thảo gần đây';

$lang['favorites']='Công thức thường dùng';  // Displayed like 'Favorites...', shows a used saved (favorite) equations
$lang['favorites_title']='Danh sách các công thức thường sử dụng';
$lang['favorites_add']='đưa công thức hiện tại vào dach sách thường dùng';  // adds an equation to the favorite list
$lang['favorites_delete']='Xóa công thức đang được chọn khỏi danh sách thường dùng';  // removes an equation from the favorite list


$lang['inline']='Tại chỗ';          // place equations inline within text in the parent document
$lang['inline_title']='Đặt công thức tại chỗ (trong cùng dòng với văn bản)';

$lang['compressed']='Nén';  // create equations with restricted vertical height
$lang['compressed_title']='Đặt công thức với chiều cao bằng chiều cao của 1 dòng chữ';

$lang['clear']='Xóa';
$lang['clear_title']='Xóa cửa sổ soạn thảo';

$lang['render']='Xem trước công thức';
$lang['render_title']='Nhấn vào đây để xem trước hình của công thức';

$lang['copy']='Chép vào văn bản';
$lang['copy_clipboard']='Chép vào Clipboard';
$lang['click_here']='click chuột vào đây';

$lang['intro']='Gõ công thức LaTeX vào hộp trên và click vào nút "Xem trước" để xem hình của công thức';

$lang['updated']='Cập nhật lần cuối: ';  // .. 27/6/2008
$lang['refresh']='(Refresh your browser if you\'ve used an older edition)';
$lang['dev']='Written by Will Bateman with assistance from Steve Mayer.';

// This message appears at the bottom of the screen when the editor is first loaded.
$lang['install']='Để cài đặt bộ gõ này trên trang Web của bạn,';

// Credits
$lang['credits']='Written by <a href="http://www.codecogs.com" target="_blank">Will Bateman</a> and <a href="http://www.mayer.dial.pipex.com/tex.htm" target="_blank">Steve Mayer</a>.<br>TinyMCE plugin (c) by <a href="http://violet.vn" target="_blank">http://violet.vn</a>';

?>
<select title="Spaces" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Khoảng cách...</option>
  <option value="\,">thin</option>
  <option value="\:">medium</option>
  <option value="\;">thick</option>
  <option value="\!">negative</option>
</select>
<select title="Styles" onchange="insertText(this.options[this.selectedIndex].value, 1000); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Kiểu...</option>
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
  <option selected="selected" value="" style="color:#8080ff">Các hàm&hellip;</option>
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
<!--
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
-->
<select title="Symbols" onchange="insertText(this.options[this.selectedIndex].value); this.selectedIndex=0;">
  <option selected="selected" value="" style="color:#8080ff">Ký hiệu...</option>
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