<?php
$mapfile = './Seats plan.csv';
$delimiter = ',';
$fh = fopen($mapfile, 'r');
$aryHall = array();
$count = 'A';

while ( ($data = fgetcsv($fh) ) !== FALSE ) {
	$aryHall[$count] = $data;
	$count ++;
}

$json = json_encode($aryHall);
?>

<script>
	var json = '<?php echo $json !="" ? $json:"" ;?>';
	var seatplan = json != '' ? JSON.parse(json) : null;
	
	function buildSeatPlan (data) {
		var html = '<table>';
		if (data != null) {
			for (row in data) {
				html += '<tr>';
				for (seat in data[row]) {
					var seatno = data[row][seat] == "" ? '&nbsp;' : data[row][seat];
					html += '<td>' + data[row][seat] + '</td>';
				}
				html += '</tr>';
			}
		}
		html += '</table>';
		return html;
	}
	document.write(buildSeatPlan(seatplan));
</script>