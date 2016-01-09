<?php header ("Content-Type:text/xml"); ?>
<USER_INFO>
	<DATA userId="<?php echo $content['userId']; ?>" userLevel="<?php echo $content['userLevel']; ?>" userPhone="<?php echo $content['userPhone']; ?>" userMoney="<?php echo $content['userMoney']; ?>" appUserName="<?php echo $content['appUserName']; ?>" appAddress="<?php echo $content['appAddress']; ?>" licType="<?php echo $content['licType']; ?>" licCustomer="<?php echo $content['licCustomer'];  ?>" licCreate="<?php echo $content['licCreate']; ?>" licExpire="<?php echo $content['licExpire']; ?>">
	</DATA>
</USER_INFO>