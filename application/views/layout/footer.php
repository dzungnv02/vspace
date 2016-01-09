<?php
$this->load->view('layout/contextmenu');
$this->load->view('layout/modalform');
$base_url = base_url();
?>

<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<!-- <script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script> -->
<script src="<?php echo $base_url;?>assets/js/jquery/jquery-ui-1.10.4.min.js"></script>
<script src="<?php echo $base_url;?>assets/js/bootstrap/bootstrap.min.js"></script>
<script src="<?php echo $base_url;?>assets/js/bootstrap/bootbox.min.js"></script>
<script src="<?php echo base_url();?>assets/js/jquery/jquery.slides.js" ></script>
<script src="<?php echo base_url();?>assets/js/bootstrap/ace.min.js" ></script>
<script src="<?php echo base_url();?>assets/js/bootstrap/ace-elements.min.js" ></script>

<!-- jQuery File Upload Dependencies -->
<script src="<?php echo $base_url;?>assets/js/jquery/jquery.ui.widget.js"></script>
<script src="<?php echo $base_url;?>assets/js/jquery/jquery.iframe-transport.js"></script>
<script src="<?php echo $base_url;?>assets/js/jquery/jquery.fileupload.js"></script>
<!--<script src="<?php echo $base_url;?>assets/js/jquery/jquery.ba-postmessage.js"></script>-->
<!-- Our main JS file -->
<!--<script src="<?php echo $base_url;?>assets/js/space/dragSelect.js"></script>-->
<script src="<?php echo $base_url;?>assets/js/space/tree.js"></script>
<script src="<?php echo $base_url;?>assets/js/space/grid.js"></script>
<script src="<?php echo $base_url;?>assets/js/space/manager.js"></script>
<script src='<?php echo $base_url;?>assets/js/space/postmessage.js'></script>

<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/html5lightbox.js"></script>
<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/html5gallery.js"></script>

<script type="text/javascript">
var invisibledButtons = <?php echo isset($invisibledButtons) ? $invisibledButtons : 'null'; ?>;
if (jQuery) {
	var manager = $().violetFileManager({
		host: '<?php echo $base_url; ?>',
		tree: 'treeview-container',
		grid: 'file-container',
		maincontainer: 'main-content',
		titlebar: 'navbar',
		toolsbar: 'tools-bar',
		statusbar: 'status-bar',
		datasource: 'ajax',
		navigationbar: 'navigation-bar',
		invisibledButtons: invisibledButtons
	});
}
</script>
<span id="video_preview" style="display: none" ></span>
<span id="file_preview" ></span>
</body>
</html>
