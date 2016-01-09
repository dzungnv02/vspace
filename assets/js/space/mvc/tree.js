$.extend(
    $.fn, {
        vsViewTree: function(o) {
            if (o == null) o = {};
            if (o.treeContainer == undefined) o.treeContainer = $('DIV#treeview-container');
            if (o.eventHandlers == undefined) o.eventHandlers = null;

            var self = this;
            var data = [];
            var selectedNode = null;

            var init = function() {
                //createRootNode();
            };

            var createNode = function(item, opts) {
                if (opts == undefined) opts = {
                    isRoot: false,
                    hasChild: false,
                    defaultStatus: 0, //0: collapsed; 1:expanded;
                };

                var nodeId = opts.isRoot ? rootDirId : item.id;
                var nodeParentId = opts.isRoot ? rootDirId : item.parentID;
                var nodeName = opts.isRoot ? rootDirName : item.name;
                var nodeClass = opts.isRoot == true ? 'home' : (opts.hasChild == true ? 'directory-hc' : 'directory');
                var defaulState = (opts.isRoot == false && opts.defaultStatus == 0) ? 'collapsed' : 'expanded';
                var container = opts.isRoot == true ? o.treeContainer : $('UL.vstree[data-parentID="' + item.parentID + '"]').find('> LI[data-id="' + item.parentID + '"]');

                var ul = $('<ul></ul>', {
                    'class': 'vstree',
                    'data-parentID': nodeId
                });

                var li = $('<li></li>', {
                    'class': nodeClass,
                    'data-type': 'folder',
                    'data-id': nodeId,
                    'data-name': nodeName
                }).addClass(defaulState);

                var a = $('<a></a>', {
                    href: '#',
                    'data-id': nodeId,
                    text: nodeName
                });

                binEvents(a);

                if (opts.isRoot == false && item.parentID != rootDirId) $(ul).hide();
                $(li).append(a);
                $(ul).append(li);
                $(container).append(ul);
            };

            var binEvents = function(node) {
                if (o.eventHandlers == null) return false;
                $(node).bind('click', function(e) {
                    if (e.button == 0) {
                        o.eventHandlers.open(node, function(node) {
                            self.nodeClick(node);
                        });
                    }
                    return false;
                });
            };

            var highlightNode = function(node) {
                var itemId = $(node).attr('data-id');
                $(o.treeContainer).find('.currentDir').removeClass('currentDir');
                $(node).addClass('currentDir');
                selectedNode = itemId;
                return node;
            }

            var expandNode = function(node) {
                var cls = 'expanded';
                $(node).parent().children('UL:hidden').slideDown({
                    duration: 100,
                    easing: null
                });
                $(node).parent().removeClass('collapsed').addClass(cls);
            };

            var collapseNode = function(node) {
                var cls = 'expanded';
                $(node).parent().children('UL').slideUp({
                    duration: 100,
                    easing: null
                });
                $(node).parent().removeClass(cls).addClass('collapsed');
            };
	
            var collapseOtherNode = function(node) {
                //var parentId = $(node).parent().attr('');
                //var otherNode = $(o.treeContainer).find('UL.vstree LI.expanded');
                //$(o.treeContainer).find('UL.vstree LI.expanded').removeClass('expanded').addClass('collapsed');
            };

            this.nodeClick = function(node, forceOpen) {
                if (forceOpen == undefined) forceOpen = false;
                collapseOtherNode(node);
                highlightNode($(node));
                if ($(node).attr('data-id') != '-1') {		
                    if ($(node).parent().hasClass('collapsed') || forceOpen == true) {
                        expandNode(node);
                    } else {
                        collapseNode(node);
                    }
                }
            };

            this.renderTreeBranch = function(items, currentParentId) {
                if (currentParentId == undefined) currentParentId = rootDirId;

                var folders = items.folder;
                if (folders.length > 0) {
                    for (var i = 0; i < folders.length; i++) {
                        if (folders[i].parentID != currentParentId || folders[i].id == currentParentId) continue;

                        var oldNode = $(o.treeContainer).find('UL.vstree[data-parentID="' + folders[i].parentID + '"] LI[data-id="' + folders[i].id + '"]');
                        if ($(oldNode).length > 0) {
                            $(oldNode).parent().empty();
                        }

                        var opts = {
                            isRoot: (folders[i].id == rootDirId),
                            hasChild: 0,
                            defaultStatus: 0
                        };
                        createNode(folders[i], opts);
                    };
                }
            };

            this.createRootNode = function() {
                var opts = {
                    isRoot: true,
                    hasChild: 0,
                    defaultStatus: 1
                };

                var item = {
                    id: rootDirId,
                    name: rootDirName,
                    parentID: 0,
                    mdate: null
                };
                createNode(item, opts);
            };

            this.findNodeById = function(id) {
                return $(o.treeContainer).find('A[data-id="' + id + '"]')
            };

            this.getSelectedNode = function() {
                return selectedNode == null ? -1 : selectedNode;
            };

            this.setOptions = function(opt, value) {
                eval('o.' + opt + '= value;');
            };

            this.getOptions = function(opt) {
                if (opt == null) return o;
                else return eval('o.' + opt);
            };

            this.addData = function(data) {

            };

            this.deleteData = function(data) {

            };

            this.initialize = function() {
                init();
                return this;
            };

            return this.initialize();
        }
    });