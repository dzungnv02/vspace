<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Filemanager Class
 * 
 * @author dzungnv02
 *
 */
class Filemanager extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function oldin() {
		/*
		$user_info = $this->session->userdata('userInfo');

        if ($user_info) {
            parse_str($user_info['user'],$user);
   
            $data['user']=array_merge($user_info,$user);
            $this->load->view('main', $data);
        }
        else {
        	redirect ( '/frontend/home' );
        }
		*/
        // = $this->input->get('mode', TRUE);
        $data['user'] = array();		
		$this->load->view('main', $data);
    }

    public function addon () {
        $data['user'] = array();
        $this->load->view('main-addon', $data);
    }

    public function index () {
        $data['user'] = array();
        $this->load->view('main_19', $data);
    }

}

/* End of file filemanager.php */
/* Location: ./application/modules/filemanager/controllers/filemanager.php */