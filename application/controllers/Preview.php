<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Preview extends CI_Controller 
{

	public function __construct() { 
		parent::__construct();
                $user = $this->session->userdata ( 'userInfo' );
		$this->vservices->setApiUrl($this->config->item('api_url'));
		$this->vservices->setConnection($this->curl);
		$this->vservices->setUserId($user['us_id']);
	}
	
	public function getFilePreview () {
            $fileId =  $this->uri->segment(4);
            $data = $this->vservices->getPreview($fileId); 
            $data=  json_decode($data,true);
            $data['fileId']=$fileId;
            if ($data['total']==0)
            {
                echo "Chế độ xem trước không khả dụng, vui lòng tải xuống để xem";
            }
            else
            {
            $this->load->view('preview/index', $data);
            }
	}
        public function getVideoPreview () {
            $data=$this->input->post();
            $fileName = $data['fileurl'];
            $fileNames = explode("/", $fileName);
            $name=$fileNames[(count($fileNames)-1)];
            $fileName = str_replace($name, "", $fileName).  str_replace("+","%20",urlencode($name));
            $data['fileurl']=$fileName; 
            $this->load->view('preview/video', $data);
            
	}

}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */