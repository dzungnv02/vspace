<?php

if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
/**
 * PrivateContent Class
 *
 * @author dzungnv02
 *
 */


if ( ! defined('_DUMMY_USER_NAME')) define('_DUMMY_USER_NAME','dungnv02');
if ( ! defined('_DUMMY_USER_PASSWORD')) define('_DUMMY_USER_PASSWORD','472607');

class Privatecontent extends CI_Controller {

	const TOKENPW = 'violet';
	private $_sid = null;

	public function __construct() {
		parent::__construct ();
		$user = $this->session->userdata ( 'userinfo' );
		$this->vservices->setApiUrl ( $this->config->item ( 'api_url' ) );
		$this->vservices->setConnection ( $this->curl );
		$this->_sid = ($user && isset($user['session'])) ? $user['session'] : null;
	}
	
	public function getContent () {

		$loginResult = '';
		if (!$this->_checkLogin($loginResult)) {
			echo $loginResult;
			return;
		}

		$parentID = $this->input->post('id', TRUE);
		$src = $this->input->post('src', TRUE);		
		$userinfo = $this->session->userdata('userinfo');
		$aryParams = array('id' => $parentID, 'sid' => $this->_sid);
		$result = $this->vservices->actionExecute('dir', $aryParams);			
		echo $this->XML2JSON($result);
	}

	public function getUploadHandler () {
		$aryErr = array('err' => '', 'errCode' => '0');
		$aryData = array ('data' => array('session' => base64_encode($this->_sid), 
											'uhandler' => base64_encode($this->config->item('upload_handler')),
											),'ERROR' => $aryErr);
		echo json_encode($aryData);
	}

	public function createDir () {
		$newFolderName = $this->input->post('foldername', TRUE);
		$destination = $this->input->post('destination', TRUE);
		$aryParams = array('parent_id' => $destination, 'name' => $newFolderName, 'sid' => $this->_sid);		
		$result = $this->vservices->actionExecute('mkdir', $aryParams, 'space');
		echo $this->XML2JSON($result);
	}

	public function delete () {
		$id = $this->input->post('id', TRUE);
		//$force = $this->input->post('option', TRUE);
		$aryParams = array('id' => $id, 'option' => 'force', 'sid' => $this->_sid);
		$result = $this->vservices->actionExecute('delete', $aryParams, 'space');		
		echo $this->XML2JSON($result);
	}

	public function rename () {
		$id = $this->input->post('id', TRUE);
		$newName = $this->input->post('name', TRUE);
		$aryParams = array('id' => $id, 'name' => $newName, 'sid' => $this->_sid);
		$result = $this->vservices->actionExecute('rename', $aryParams, 'space');		
		echo $this->XML2JSON($result);
	}

	public function paste () {
		$items = $id = $this->input->post('items', TRUE);		
		$destination = $this->input->post('destination', TRUE);
		$act = $this->input->post('act', TRUE);
		$aryParams = array('id' => is_array($items) ? implode(',', $items) : $items, 'destination' => $destination, 'sid' => $this->_sid);
		$result = $this->vservices->actionExecute((!$act) ? 'copy' : $act, $aryParams, 'space');		
		echo $this->XML2JSON($result);		
	}

	public function upload () {
		$aryErr = array('err' => '', 'errCode' => '0');
		$dir = $this->input->post('dir', TRUE);	
		$aryData = array('ERROR' => $aryErr);
		if (isset($_FILES)) {
			$aryData['files'] = $_FILES;
			$aryData['dir'] = array($dir);
		}
		echo json_encode($aryData);
	}

	public function login($renew = false) {
		$userinfo = $this->session->userdata('userinfo');
		$aryErr = array('err' => '', 'errCode' => '0');

		$username = $this->input->post('username', TRUE);
		$password = $this->input->post('password', TRUE);

		if ($renew && $userinfo !== NULL) {
			$aryParams = array('sid' => $userinfo['session']);
			$result = $this->vservices->actionExecute('logout', $aryParams, 'user');
			$this->session->unset_userdata('userinfo');
			$userinfo = null;
		}
		
		if (!$userinfo) {
			$aryParams = array('src' => 'space', 'token' => md5($username.self::TOKENPW),'username' => $username, 'password' => $password/*, 'sid' => $sid*/);
			$userData = $this->vservices->actionExecute('login', $aryParams, 'user');
			$aryUserData = array();
			parse_str ($userData, $aryUserData);
			if (isset($aryUserData['errCode'])) {
				$aryErr['err'] = $aryUserData['errCode'];
				$aryErr['errCode'] = 'Login';
				echo json_encode(array('ERROR' => $aryErr));
				return;
			}
			$this->session->set_userdata(array('userinfo' => $aryUserData));
		}

		$this->_sid = $aryUserData['session'];
		$aryUserData['session'] = base64_encode($aryUserData['session']);
		$aryUserData['uhandler'] = base64_encode($this->config->item('upload_handler'));	

		$aryData = array(
			'USER' => $aryUserData	,	
			'ERROR' => $aryErr,
		);
		echo json_encode($aryData);
	}

	public function logout() {	
		$aryParams = array('sid' => $this->_sid);
		$result = $this->vservices->actionExecute('logout', $aryParams, 'user');
		$this->session->unset_userdata('userinfo');
		parse_str ($result, $aryLogout);
		echo json_encode($aryLogout);		
	}

	public function noop () {
		$aryParams = array('sid' => $this->_sid);
		$result = $this->vservices->actionExecute('noop', $aryParams, 'user');
		$aryError = array('err' => '', 'errCode' => 0);
		$result['ERROR'] = $aryError;
	}

	private function _checkLogin (&$result) {
		$userinfo = $this->session->userdata('userinfo');
		$aryErr = array('err' => 'Bạn chưa đăng nhập. Dịch vụ này yêu cầu bạn phải đăng nhập mới truy cập được.', 'errCode' => 'Login');
		if (!$userinfo) {			
			$result = json_encode(array('ERROR' => $aryErr));
			return FALSE;
		}
		else return TRUE;		
	}

	/**
	* function XML2JSON
	* @desc: parse XML result returned from API server
	*
	**/

    private function XML2JSON($xml) {
        function normalizeSimpleXML($obj, &$result) {
            $data = $obj;
            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            if (is_array($data)) {
                foreach ($data as $key => $value) {
                    $res = null;
                    normalizeSimpleXML($value, $res);
                    if (($key == '@attributes') && ($key)) {
                        $result = $res;
                    } else {
                        $result[$key] = $res;
                    }
                }
            } else {
                $result = $data;
            }
        }
        
        normalizeSimpleXML(simplexml_load_string($xml), $result);

        $aryErr = array('err' => '', 'errCode' => 0);
        if (isset($result['errCode'])) {
			$aryErr['errCode'] =  $result['errCode'];
			$aryErr['err'] =  $result['err'];
			unset($result['errCode']);
			unset($result['err']);
        }

        if (is_array($result) && !isset($result['ERROR'])) {
        	$result['ERROR'] = $aryErr;
        }
        else if (!$result) {
        	$result = array('ERROR' => $aryErr);
        }

        return json_encode($result);
    }
}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */