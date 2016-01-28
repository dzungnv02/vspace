<?php

if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
/**
 * PrivateContent Class
 *
 * @author dzungnv02
 *
 */

//if ( ! defined('_DUMMY_USER_NAME')) define('_DUMMY_USER_NAME','dungnv02');
//if ( ! defined('_DUMMY_USER_PASSWORD')) define('_DUMMY_USER_PASSWORD','472607');

class Privatecontent extends CI_Controller {

	const TOKENPW = 'violet';

	public function __construct() {
		parent::__construct ();
		$this->vservices->setApiUrl ( $this->config->item ( 'api_url' ) );
		$this->vservices->setConnection ( $this->curl );
		$logged = $this->_getSession();
		if (!$logged && !in_array($this->router->method, array('login','logout'))) {
			$loginResult = '';
			$this->_checkLogin($loginResult);
			echo $loginResult;
			exit();		
		}
	}

	public function onload () {
		$aryData = array ('USER' => $_SESSION['userinfo'], 'ERROR' => array('err' => '', 'errCode' => '0'));
		echo json_encode($aryData);
	}
	
	public function getContent () {
		$parentID = $this->input->post('id', TRUE);
		$src = $this->input->post('src', TRUE);
		$userinfo = $_SESSION['userinfo'];
		$aryParams = array('id' => $parentID, 'sid' => $userinfo['session']);
		$result = $this->vservices->actionExecute('dir', $aryParams);			
		echo $this->XML2JSON($result);
	}

	public function createDir () {
		$newFolderName = $this->input->post('foldername', TRUE);
		$destination = $this->input->post('destination', TRUE);
		$aryParams = array('parent_id' => $destination, 'name' => $newFolderName, 'sid' => session_id());		
		$result = $this->vservices->actionExecute('mkdir', $aryParams, 'space');
		echo $this->XML2JSON($result);
	}

	public function delete () {
		$id = $this->input->post('id', TRUE);
		$aryParams = array('id' => $id, 'option' => 'force', 'sid' => session_id());
		$result = $this->vservices->actionExecute('delete', $aryParams, 'space');		
		echo $this->XML2JSON($result);
	}

	public function rename () {
		$id = $this->input->post('id', TRUE);
		$newName = $this->input->post('name', TRUE);
		$aryParams = array('id' => $id, 'name' => $newName, 'sid' => session_id());
		$result = $this->vservices->actionExecute('rename', $aryParams, 'space');		
		echo $this->XML2JSON($result);
	}

	public function paste () {
		$items = $id = $this->input->post('items', TRUE);		
		$destination = $this->input->post('destination', TRUE);
		$act = $this->input->post('act', TRUE);
		$aryParams = array('id' => is_array($items) ? implode(',', $items) : $items, 'destination' => $destination, 'sid' => session_id());
		$result = $this->vservices->actionExecute((!$act) ? 'copy' : $act, $aryParams, 'space');		
		echo $this->XML2JSON($result);		
	}

	public function login() {
		$username = $this->input->post('username', TRUE);
		$password = $this->input->post('password', TRUE);

		$aryErr = array('err' => '', 'errCode' => '0');
		$aryParams = array('src' => 'space', 'token' => md5($username.self::TOKENPW),'username' => $username, 'password' => $password, 'sid' => session_id());
		$userData = $this->vservices->actionExecute('login', $aryParams, 'user');
		$aryUserData = array();
		parse_str ($userData, $aryUserData);

		if (isset($aryUserData['errCode'])) {
			$aryErr['err'] = $aryUserData['errCode'];
			$aryErr['errCode'] = 'Login';
			echo json_encode(array('ERROR' => $aryErr));
			return;
		}

		$aryUserData['uhandler'] = base64_encode($this->config->item('api_url'));
		$_SESSION['userinfo'] = $aryUserData;
		
		$aryData = array(
			'USER' => $aryUserData	,	
			'ERROR' => $aryErr
		);

		echo json_encode($aryData);
	}

	public function logout() {
		$result = $this->vservices->actionExecute('logout', array('sid' => session_id()), 'user');
		unset($_SESSION['userinfo']);
		session_destroy();
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
		$aryErr = array('err' => 'Bạn chưa đăng nhập. Dịch vụ này yêu cầu bạn phải đăng nhập mới truy cập được.', 'errCode' => 'Login');
		if (!isset($_SESSION['userinfo'])) {
			$result = json_encode(array('ERROR' => $aryErr));
			return FALSE;
		}
		else {			
			$result = NULL;
			return TRUE;
		}
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

    private function _getSession () {		
    	$logged = FALSE;
		$currUserInfo = $this->vservices->actionExecute('getcurrentuser', array('sid' => session_id()), 'user');
		$aryUserData = array();		
		parse_str ($currUserInfo, $aryUserData);
		if ((int)$aryUserData['id'] > 0) {
			$aryUserData['session'] = session_id();
			$aryUserData['uhandler'] = base64_encode($this->config->item('api_url'));
			$_SESSION['userinfo'] = $aryUserData;
			$logged = TRUE;
		}
		else if (isset ($_SESSION['userinfo '])){			
			unset($_SESSION['userinfo']);
			session_destroy();
		}
		return $logged;					
    }
}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */