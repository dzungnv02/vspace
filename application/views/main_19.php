<?php
$this->load->view('19/header');
$base_url = base_url();
?>
<div id="main-content" class="container-fluid">
    <div class="row">
        <div id="tool-bar" class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
            <div class="dropdown user">
                <span data-toggle="dropdown" class="dropdown-toggle"></span>
                <ul class="dropdown-menu">
                    <div class="data-used gray">530 MB of 2 GB used</div>
                    <div class="quota-bar-container">
                        <div class="quota-bar"></div>
                    </div>
                    <li><button data-act="logout" class="btn" title="Thoát"> Thoát</button></li>
                </ul>   
            </div>
            <div class="folder-action-group">
                <button id="btnUpload" data-act="upload" class="btn" title="Tải lên"><i class="fa fa-cloud-upload"></i></button>
                <button id="btnNewFolder" data-act="createDir" class="btn" title="Tạo thư mục mới"><i class="fa fa-folder"></i></button>
                <button id="btnRefresh" data-act="refresh" class="btn" title="Làm mới"><i class="fa fa-refresh"></i></button>
            </div>
            <ul class="breadcrumb"></ul>
            <!-- <button id="btnShare" data-act="share" class="btn" title="Chia sẻ"><i class="fa fa-share-alt"></i></button>
            <button id="btnPreview" data-act="preview" class="btn" title="Xem trước"><i class="fa fa-eye"></i></button> -->

            <!-- <button id="btnDownload" data-act="download" class="btn" title="Tải xuống"><i class="fa fa-cloud-download"></i> <span>Tải xuống</span></button> -->
            <!-- <button id="btnUpload" data-act="upload" class="btn" title="Tải lên"><i class="fa fa-cloud-upload"></i> <span>Tải lên</span></button> -->

            <!-- <button id="btnRefresh" data-act="refresh" class="btn" title="Làm mới"><i class="fa fa-refresh"></i> <span>Làm mới</span></button> -->
            <!-- <button id="btnTinyMCE" data-act="tinymcePreview" class="btn" title="Lấy link của file"><i class="fa fa-link"></i></button> -->

            
            <!-- <button id="btnLogout" data-act="logout" class="btn logout" title="Thoát"><i class="fa fa-power-off"></i> <span></span></button> -->
        </div>
    </div>

    <div class="row">
        <div id="directory-view-container">
            <div id="treeview-container"></div>
        </div>

        <div id="directory-content-view-container">
        	<div id="navigation-bar">
                <div class="file-action-group">
                    <span></span>
                    <button data-act="rename" class="btn" title="Sửa tên"><i class="fa fa-edit"></i> <span>Sửa tên</span></button>
                    <button data-act="delete" class="btn" title="Xóa"><i class="fa fa-eraser"></i> <span>Xóa</span></button>
                    <button data-act="copy" class="btn" title="Sao chép"><i class="fa fa-copy"></i> <span>Sao chép</span></button>
                    <button  data-act="move" class="btn" title="Cắt"><i class="fa fa-cut"></i> <span>Cắt</span></button>
                    <button data-act="paste" data-active="0" class="btn" title="Dán"><i class="fa fa-paste"></i> <span>Dán</span></button>
                    <button data-act="download" class="btn" title="Tải xuống"><i class="fa fa-cloud-download"></i> <span>Tải xuống</span></button>
                    <span></span>
                </div>
        	</div>
            <!-- add class 'list-view' -> show list-file type -->
            <div id="file-container" class="vsgrid">

            </div>
        </div>
    </div>

    <div class="row">
        <div id="status-bar" class="col-sm-12 col-md-12 col-lg-12 header-color-blue2">
            <ul class="change-file-view list-inline pull-right">
                <li><i class="ace-icon fa fa-th-large show-grid-view" title="Hiển thị thumbnail"></i></li>
                <li><i class="ace-icon fa fa-th-list show-list-view" title="Hiển thị danh sách"></i></li>
            </ul>
        </div>
        <video id="videoElement"></video>
    </div>
</div>
<!-- <div id="drop-zone"></div> -->
<div class="loading-modal"></div>
<div id="loader-wrapper">
    <div id="loader">
        <div class="coffee_cup">
    </div>
    <div class="loader-section section-left"></div>
    <div class="loader-section section-right"></div>
</div>
<?php
$this->load->view('19/footer');
?>
