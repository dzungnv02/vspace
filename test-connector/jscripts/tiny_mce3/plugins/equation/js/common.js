function vEquation() {}
var veq = new vEquation;
//-------------------------------------------------------------------------
// open
function Equation_open() {
	veq.oEditor.contentWindow.focus();
	var wArgs = {};
	var elm = veq.selectedElement;
	if (elm != null) { // if element
		if (elm.nodeName.toLowerCase() == 'img') { // selected object is image
			var oImageElement   = elm;
			veq.getImgParam(oImageElement, wArgs); // set image parameters				)
		}
	}

	//-------------------------------------------------------------------------
	// open dialog
	if (veq.isMSIE) { // IE
		var rArgs = showModalDialog(veq.baseURL, wArgs, 'dialogHeight:500px; dialogWidth:580px; scrollbars: no; menubar: no; toolbar: no; resizable: no; status: no;');
		if (rArgs) { // returning from (IE) and calling callback function
			Equation_callback('','',rArgs);
		}
	} else if (veq.isGecko || veq.isWebKit) { // Gecko
		var wnd = window.open(veq.baseURL + '?editor=' + veq.editor + '&callback=Equation_callback', 'equation', 'status=no, modal=yes, width=625, height=530');
		wnd.dialogArguments = wArgs;
	}
}

// Equation callback
function Equation_callback(editor, sender, iArgs) {
	if (iArgs) { // IE
		var rArgs = iArgs;
	} else { // Gecko
		var rArgs = sender.returnValue;
	}

	veq.oEditor.contentWindow.focus();
	var elm = veq.selectedElement;
	if (elm != null) {
		if (elm.nodeName.toLowerCase() == 'img') { // is current cell a image ?
			var oImageElement = elm;
		}
	}

	if (rArgs) {
			if (!oImageElement) { // new image// no image - create new image
				veq.oEditor.contentWindow.document.execCommand('insertimage', false, rArgs);
				oImageElement = veq.getElementByAttributeValue(veq.oEditor.contentWindow.document, 'img', 'src', rArgs);
			} else {
				// set image attributes
				veq.setAttrib(oImageElement, 'src', rArgs, true);
				veq.setAttrib(oImageElement, 'data-mce-src', rArgs, true);
			}
			oImageElement.setAttribute('align', 'absmiddle');
	}
	return;
}

// set image attributes
vEquation.prototype.getImgParam = function (oImageElement, wArgs) {
	var tsrc = oImageElement.src;
	wArgs.src = tsrc;

	if (!wArgs.rsrc) { // if not random picture
		wArgs.width 	= oImageElement.style.width  ? parseInt(oImageElement.style.width)  : oImageElement.width;
		wArgs.height 	= oImageElement.style.height ? parseInt(oImageElement.style.height) : oImageElement.height;
	}
	wArgs.className 	= oImageElement.className;
	return wArgs;
}
//-------------------------------------------------------------------------
// get selected element (focus element)
vEquation.prototype.getSelectedElement = function () {
	if (veq.isMSIE) {
		var sel = veq.oEditor.contentWindow.document.selection;
		var rng = sel.createRange();
		if (sel.type != 'Control') {
			return rng.parentElement();
		} else {
			return rng(0);
		}
	} else if (veq.isGecko) {
		var elm = null;
		var sel = veq.oEditor.contentWindow.getSelection();
		if (sel && sel.rangeCount > 0) {
			var rng = sel.getRangeAt(0);
			elm = rng.startContainer;
			if (elm.nodeType != 1) {
				elm = elm.parentNode;
			}
		}
		return elm;
	}
}
//-------------------------------------------------------------------------
// get element by attribute value
vEquation.prototype.getElementByAttributeValue = function (node, element_name, attrib, value) {
	var elements = veq.getElementsByAttributeValue(node, element_name, attrib, value);
	if (elements.length == 0) {
		return null;
	}
	return elements[0];
};
//-------------------------------------------------------------------------
// get elements by attribute value
vEquation.prototype.getElementsByAttributeValue = function (node, element_name, attrib, value) {
	var elements = new Array();
	if (node && node.nodeName.toLowerCase() == element_name) {
		if (node.getAttribute(attrib) && node.getAttribute(attrib).indexOf(value) != -1) {
			elements[elements.length] = node;
		}
	}

	if (node.hasChildNodes) {
		for (var x=0, n=node.childNodes.length; x<n; x++) {
			var childElements = veq.getElementsByAttributeValue(node.childNodes[x], element_name, attrib, value);
			for (var i=0, m=childElements.length; i<m; i++) {
				elements[elements.length] = childElements[i];
			}
		}
	}
	return elements;
};
//-------------------------------------------------------------------------
// set attributes
vEquation.prototype.setAttrib = function (element, name, value, fixval) {
	if (!fixval && value != null) {
		var re = new RegExp('[^0-9%]', 'g');
		value = value.replace(re, '');
	}
	if (value != null && value != '') {
		element.setAttribute(name, value);
	} else {
		element.removeAttribute(name);
	}
}
//-------------------------------------------------------------------------
// insert node at selection
vEquation.prototype.insertNodeAtSelection = function (win, insertNode) { // Gecko
	var sel   = win.getSelection(); // get current selection
  	var range = sel.getRangeAt(0); // get the first range of the selection -(there's almost always only one range)
	sel.removeAllRanges(); // deselect everything
	range.deleteContents(); // remove content of current selection from document
  	var container = range.startContainer; // get location of current selection
  	var pos = range.startOffset;
	range   = document.createRange(); // make a new range for the new selection

	if (container.nodeType == 3 && insertNode.nodeType == 3) {
		container.insertData(pos, insertNode.nodeValue); // if we insert text in a textnode, do optimized insertion
		range.setEnd(container, pos+insertNode.length); // put cursor after inserted text
		range.setStart(container, pos+insertNode.length);
	} else {
		var afterNode;
		if (container.nodeType == 3 ) { // text node
			  // when inserting into a textnode, we create 2 new textnodes and put the insertNode in between
			var textNode   = container;
			container      = textNode.parentNode;
			var text       = textNode.nodeValue;
			var textBefore = text.substr(0,pos); // text before the split
			var textAfter  = text.substr(pos); // text after the split
			var beforeNode = document.createTextNode(textBefore);
			var afterNode  = document.createTextNode(textAfter);

			container.insertBefore(afterNode, textNode); // insert the 3 new nodes before the old one
			container.insertBefore(insertNode, afterNode);
			container.insertBefore(beforeNode, insertNode);
			container.removeChild(textNode); // remove the old node

		} else {
			afterNode = container.childNodes[pos]; // else simply insert the node
			container.insertBefore(insertNode, afterNode);
		}

		range.setEnd(afterNode, 0);
		range.setStart(afterNode, 0);
	}
	  	sel.addRange(range);
	  	win.getSelection().removeAllRanges(); // remove all ranges
}