<?php

if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class User extends CI_Controller {
	const TOKENPW = 'violet';
	public function __construct() {
		parent::__construct ();
	}
	public function login($return_type = 'xml') {
		$user_info = $this->session->userdata ( 'userInfo' );
		if ($user_info) {
			$user = $user_info ['user'];
			$data ['content'] = $this->get_data ( $user );
			if ($return_type == "xml") {
				$this->load->view ( 'user', $data );
			}
		} else {
			redirect ( '/frontend/home' );
		}
	}
	private function get_data($user) {
		$this->load->model ( 'us_model' );
		$aryParams = array ();
		parse_str ( $user, $aryParams );
		$us = $this->us_model->search_by_id ( $aryParams ['id'] );
		return array (
				"userId" => $aryParams ['id'],
				"userLevel" => 1,
				"userPhone" => $aryParams ['phone'],
				"userMoney" => $us ['acc_balanced'],
				"appUserName" => $aryParams ['fullname'],
				"appAddress" => $aryParams ['school'],
				"licType" => "SBG",
				"licCustomer" => $aryParams ['username'],
				"licCreate" => $us ['created_time'],
				"licExpire" => $us ['expire_date'] 
		);
	}
}