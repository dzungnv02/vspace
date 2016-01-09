
<div style="display:none;" class="html5gallery" data-skin="darkness" data-width="540" data-height="300">
        <?php
        for ($i=0;$i<$total;$i++)
        { 
        ?>
    <a href="<?php echo $this->config->item('api_url').$folder."/".$i;?>.png"><img src="<?php echo $this->config->item('api_url').$folder."/".$i;?>.png" title="Trang <?php echo ($i+1);?>" alt="Trang <?php echo ($i+1);?>"></a>
    <?php
    }?>
</div>
<script type="text/javascript">
 $(".html5gallery").html5gallery();  
 $( ".bootbox" ).addClass( "preview" ); 
</script>
