<!-- 
Copyright (C) 2004-2007 CodeCogs, Zyba Ltd, Broadwood, Holford, TA5 1DU, England.
-->
<img src="panels/matrix_panel.gif" width="79" height="128" border="0" alt="Matrix Panel" usemap="#matrix_map" />
<map name="matrix_map" id="matrix_map">
<area shape="rect" alt="\begin{matrix} ... \end{matrix}"    title="\begin{matrix} ... \end{matrix}"        coords="0,0,25,24"   onclick="makeArrayMatrix('','','')" />
<area shape="rect" alt="\begin{pmatrix} ... \end{pmatrix}"  title="\begin{pmatrix} ... \end{pmatrix}"      coords="0,26,25,50"  onclick="makeArrayMatrix('p','','')" />
<area shape="rect" alt="\begin{vmatrix} ... \end{vmatrix}"  title="\begin{vmatrix} ... \end{vmatrix}"      coords="0,52,25,76"  onclick="makeArrayMatrix('v','','')" />
<area shape="rect" alt="\begin{Vmatrix} ... \end{Vmatrix}"  title="\begin{Vmatrix} ... \end{Vmatrix}"      coords="0,78,25,102" onclick="makeArrayMatrix('V','','')" />
<area shape="rect" alt="\left.\begin{matrix}... \end{matrix}\right|"    title="\left.\begin{matrix}... \end{matrix}\right|" coords="0,104,25,128" onclick="makeArrayMatrix('','\\left.','\\right|')" />

<area shape="rect" alt="\being{bmatrix} ... \end{bmatrix}"  title="\begin{bmatrix} ... \end{bmatrix}"      coords="27,0,52,24"   onclick="makeArrayMatrix('b','','')" />
<area shape="rect" alt="\bigl(\begin{smallmatrix} ... \end{smallmatrix}\bigr)" title="\bigl(\begin{smallmatrix} ... \end{smallmatrix}\bigr)" coords="27,26,52,50"  onclick="makeArrayMatrix('small','\\bigl(','\\bigr)')" />
<area shape="rect" alt="\begin{Bmatrix} ... \end{Bmatrix}"  title="\begin{Bmatrix} ... \end{Bmatrix}"  coords="27,52,52,76"  onclick="makeArrayMatrix('B','','')" />
<area shape="rect" alt="\begin{Bmatrix} ... \end{matrix}"   title="\left\{\begin{matrix} ... \end{matrix}\right."  coords="27,78,52,102" onclick="makeArrayMatrix('','\\left\\{','\\right.')" />
<area shape="rect" alt="\begin{matrix} ... \end{Bmatrix}"   title="\left.\begin{matrix} ... \end{Bmatrix}\right\}"  coords="27,104,52,128"  onclick="makeArrayMatrix('','\\left.','\\right\\}')" />

<area shape="rect" alt="\begin{cases} ... \end{cases}"   title="\begin{cases} ... \end{cases}"   coords="54,0,79,24"   onclick="makeEquationsMatrix('cases', true, true)" />
<area shape="rect" alt="\begin{align} ... \end{align}"   title="\begin{align} ... \end{align}"   coords="54,26,79,50"  onclick="makeEquationsMatrix('align', false)" />
</map>
