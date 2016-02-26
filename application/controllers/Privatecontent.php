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
		$loginResult = '';
		$logged = $this->_checkLogin($loginResult);

		error_log( date('Y.m.d H:i:s') .'---- ROUTER METHOD: '. $this->router->method. "\n", 3, dirname(BASEPATH) .'/logs/controller.log');
		
		if (!$logged && !in_array($this->router->method, array('login','logout'))) {
			if (!$this->_getSession()) {
				echo $loginResult;
				exit();
			}
		}
	}

	public function onload () {
		error_log( date('Y.m.d H:i:s') .'---- CONTROLLER ACTION: '. __FUNCTION__ . "\n\n\n", 3, dirname(BASEPATH) .'/logs/controller.log');
		$_SESSION['userinfo']['SPACE'] = $this->_getSpaceInfo();
		$aryData = array ('USER' => $_SESSION['userinfo'], 'ERROR' => array('onload' => 'TRUE','err' => '', 'errCode' => '0', 'session' => session_id()));
		echo json_encode($aryData);
	}
	
	public function getContent () {
		error_log( date('Y.m.d H:i:s') .'---- CONTROLLER ACTION: '. __FUNCTION__ . "\n\n\n", 3, dirname(BASEPATH) .'/logs/controller.log');
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
		error_log( date('Y.m.d H:i:s') .'---- CONTROLLER ACTION: '. __FUNCTION__ . "\n\n\n", 3, dirname(BASEPATH) .'/logs/controller.log');
		$username = $this->input->post('username', TRUE);
		$password = $this->input->post('password', TRUE);

		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- SESSION ID: '. var_export(session_id(), TRUE) . "\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
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
		$aryUserData['SPACE'] = $this->_getSpaceInfo();
		$_SESSION['userinfo'] = $aryUserData;
		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- SESSION PARAMS: '. var_export($_SESSION, TRUE) . "\n\n\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
		$aryData = array(
			'USER' => $aryUserData	,	
			'ERROR' => $aryErr
		);

		echo json_encode($aryData);
	}

	public function logout() {
		error_log( date('Y.m.d H:i:s') .'---- CONTROLLER ACTION: '. __FUNCTION__ . "\n\n\n", 3, dirname(BASEPATH) .'/logs/controller.log');
		$result = $this->vservices->actionExecute('logout', array('sid' => session_id()), 'user');
		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- OLD SESSION ID: '. var_export(session_id(), TRUE) . "\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- OLD SESSION PARAMS: '."\n". var_export($_SESSION, TRUE) . "\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
		session_unset();		
		//session_destroy();
		//session_start();
		session_regenerate_id(true);
		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- NEW SESSION ID: '. var_export(session_id(), TRUE) . "\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
		error_log( date('Y.m.d H:i:s') .'------'. __FUNCTION__ .'---- NEW SESSION PARAMS: '. var_export($_SESSION, TRUE) . "\n", 3, dirname(BASEPATH) .'/logs/loginout.log');
		
		$aryErr = array('err' => '', 'errCode' => '0');
		parse_str ($result, $aryLogout);
		$aryData = array('data' => $aryLogout, 'ERROR' => $aryErr, 'session' => session_id());
		echo json_encode($aryData);
	}

	public function noop () {
		$aryParams = array('sid' => session_id());
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
    	$currUserInfo = '';
    	$sid = session_id();
		$currUserInfo = $this->vservices->actionExecute('getcurrentuser', array('sid' => $sid), 'user');		
		$aryUserData = array('id' => 0);			
		if ($currUserInfo != '')  parse_str ($currUserInfo, $aryUserData);
		if ((int)$aryUserData['id'] != 0) {
			$aryUserData['session'] = $sid;
			$aryUserData['uhandler'] = base64_encode($this->config->item('api_url'));
			$_SESSION['userinfo'] = $aryUserData;
			$logged = TRUE;
		}

		return $logged;					
    }

    private function _getSpaceInfo () {
    	$spaceInfo = $this->vservices->actionExecute('info', array('sid' => session_id()), 'space');
		$arySpaceInfo = array();
		if ($spaceInfo != '') {
			$pattern = '/total="([0-9]+)" used="([0-9]+)" create="([0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2} [0-9]{2}\:[0-9]{2}\:[0-9]{2})" expire="(?:([0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2} [0-9]{2}\:[0-9]{2}\:[0-9]{2})|())"/';
			$aryTmp = array();
			preg_match($pattern, $spaceInfo, $aryTmp);
			if (count($aryTmp) > 0) {
				$arySpaceInfo['total'] = $aryTmp[1];
				$arySpaceInfo['used'] = $aryTmp[2];
				$arySpaceInfo['create'] = $aryTmp[3] !='' ? date('d/m/Y H:i:s', strtotime($aryTmp[3])) : '';
				$arySpaceInfo['expire'] = $aryTmp[4] !='' ? date('d/m/Y H:i:s', strtotime($aryTmp[4])) : '';
				return $arySpaceInfo;
			}
		}
		return $arySpaceInfo;
    }
}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */