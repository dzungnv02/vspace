<?php
$this->load->view('layout/header');
$base_url = base_url();
?>
<div id="main-content" class="container-fluid">
    <div class="row">
        <div id="tools-bar" class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
            <div class="btn-group basic">
                <button id="btnNewFolder" class="btn btn-success" title="Tạo thư mục mới"><i class="fa fa-folder"></i></button>
                <button id="btnRename" class="btn btn-success" title="Đổi tên"><i class="fa fa-edit"></i></button>
                <button id="btnDel" class="btn btn-success" title="Xóa"><i class="fa fa-eraser"></i></button>
                <button id="btnCopy" class="btn btn-success" title="Sao chép"><i class="fa fa-copy"></i></button>
                <button id="btnCut" class="btn btn-success" title="Cắt"><i class="fa fa-cut"></i></button>
                <button id="btnPaste" class="btn btn-success" title="Dán"><i class="fa fa-paste"></i></button>
            </div>
            <div class="btn-group social">
                <button id="btnShare" class="btn btn-danger" title="Chia sẻ"><i class="fa fa-share-alt"></i></button>
                <button id="btnPreview" class="btn btn-danger" title="Xem trước"><i class="fa fa-eye"></i></button>
            </div>
            <div class="btn-group creation">
                <button id="btnDownload" class="btn btn-warning" title="Tải xuống"><i class="fa fa-cloud-download"></i></button>
                <button id="btnUpload" class="btn btn-info" title="Tải lên"><i class="fa fa-cloud-upload"></i></button>
            </div>
            <div class="btn-group control">
                <button id="btnRefresh" class="btn btn-info" title="Tải lại"><i class="fa fa-refresh"></i></button>
            </div>
            <div class="btn-group addon">
                <button id="btnTinyMCEInsert" class="btn btn-info" title="Chèn tệp"><i class="fa fa-paperclip"></i></button>
            </div>
        </div>
    </div>

    <div class="row">
        <div id="directory-view-container">
            <div id="treeview-container"></div>
            <div id="file-preview-container" style="display:none">               
                <div id="previewHeader">Preview</div>
                <div id="previewZone"></div>
                <div id="previewInfo"></div>
            </div>
        </div>

        <div id="directory-content-view-container">
        	<div id="navigation-bar">
        		<ul class="breadcrumb">
	    			<li><i class="ace-icon fa fa-folder home-icon"></i><a href="" title="">Home</a></li>
	    			<li><a href="" title="">Folder</a></li>
	    			<li><a href="" title="">File</a></li>
	    		</ul>
                <ul class="change-file-view list-inline pull-right">
                    <li><i class="ace-icon fa fa-th-large show-grid-view" title="Hiển thị thumbnail"></i></li>
                    <li><i class="ace-icon fa fa-th-list show-list-view" title="Hiển thị danh sách"></i></li>
                </ul>
        	</div>
            <!-- add class 'list-view' -> show list-file type -->
            <div id="file-container" class="vsgrid">

            </div>
        </div>
    </div>

    <div class="row">
        <div id="status-bar" class="col-sm-12 col-md-12 col-lg-12 header-color-blue2"></div>
    </div>
</div>
<div class="loading-modal"></div>
 
<?php
$this->load->view('layout/footer');
?>
