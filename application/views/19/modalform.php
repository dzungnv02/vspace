<!-- BEGIN:Share modal box -->
<div id="box-shareto" class="modal" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header header-color-blue2 white">
				Chia sẻ
			</div>
			<div class="modal-body overflow-visible">
				<form id="frm-share">
					<div class="row">
						<div class="col-xs-12">
							<div class="input-group">
								<div class="radio">
									<label>
										<input name="form-field-radio" class="ace" type="radio">
										<span class="lbl"> Chia sẻ qua email</span>
									</label>
								</div>
								<div class="radio">
									<label>
										<input name="form-field-radio" class="ace" type="radio">
										<span class="lbl"> Chia sẻ cho người dùng trong Violet</span>
									</label>
								</div>
								<div class="radio">
									<label>
										<input name="form-field-radio" class="ace" type="radio">
										<span class="lbl"> Chia sẻ trên internet</span>
									</label>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<div class="input-group">
								<div class="radio">
									<label for="f-sharelink">Link chia sẻ</label>
									<div>
										<input type="text" id="f-sharelink" class="form-control" style="width:525px">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<div class="input-group">
								<div class="radio">
									<label for="f-sharelist">Người được chia sẻ</label>
									<div>
										<textarea class="autosize-transition form-control" id="f-sharelist" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 68px;width:525px"></textarea>
									</div>
									<div>
										<label>
											<input name="form-field-radio" class="ace" type="checkbox">
											<span class="lbl"> Gửi bản sao email thông báo đến địa chỉ email của tôi</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<input type="hidden" id="txtSelectedObj">					
				</form>
			</div>
			<div class="modal-footer">
				<button class="btn btn-sm btn-primary" type="reset" form="frm-report-filter">
					<i class="icon-share-alt"></i>
					Thiết lập chia sẻ
				</button>
				<button class="btn btn-sm btn-warning" data-dismiss="modal">
					<i class="icon-remove"></i>
					Đóng
				</button>
			</div>
		</div>
	</div>
</div>
<!-- END:Share modal box -->

<!-- BEGIN:Copy modal box -->
<div id="box-copyto" class="modal" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header header-color-blue2 white">
			</div>
			<div class="modal-body overflow-visible">
				<form id="frm-copy">
					<div id="select-destination-tree-container">
						<div id="select-destination-header">Chọn thư mục đích</div>
						<div id="select-destination-tree">							
						</div>
					</div>
					<input type="hidden" id="txtSelectedObj">					
				</form>
			</div>
			<div class="modal-footer">
				<button class="btn btn-sm btn-primary" type="submit" form="frm-copy" data-dismiss="modal">
				</button>
				<button class="btn btn-sm btn-warning" data-dismiss="modal">
					<i class="icon-remove"></i>
					Đóng
				</button>
			</div>
		</div>
	</div>
</div>
<!-- END:Copy modal box -->

<!-- BEGIN:UPLOAD modal box -->
<div id="box-upload" class="modal" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="blue bigger">Tải file lên Violet Space</h4>
			</div>

			<div class="modal-body overflow-visible">
				<div class="row">
					<div class="col-xs-12 col-sm-12">
						<div id="fileuploader">Chọn file:</div>
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn btn-sm" data-dismiss="modal">
					<i class="icon-remove"></i>
					Đóng
				</button>

				<!-- <button class="btn btn-sm btn-primary">
					<i class="icon-cloud-upload"></i>
					Tải lên
				</button> -->
			</div>
		</div>
	</div>
</div>
<!-- END:UPLOAD modal box -->