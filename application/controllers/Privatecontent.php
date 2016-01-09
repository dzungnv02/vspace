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

	public function __construct() {
		parent::__construct ();
		$user = $this->session->userdata ( 'userInfo' );
		$this->vservices->setApiUrl ( $this->config->item ( 'api_url' ) );
		$this->vservices->setConnection ( $this->curl );
		$this->vservices->setUserId ( $user ['us_id'] );
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
		$aryParams = array('id' => $parentID, 'sid' => $userinfo['session']);
		$result = $this->vservices->actionExecute('dir', $aryParams);			
		echo $this->XML2JSON($result);
	}

	public function getUserInfo () {

	}

	public function createDir () {
		$newFolderName = $this->input->post('foldername', TRUE);
		$destination = $this->input->post('destination', TRUE);
		$userinfo = $this->session->userdata('userinfo');
		$aryParams = array('parent_id' => $destination, 'name' => $newFolderName, 'sid' => $userinfo['session']);		
		$result = $this->vservices->actionExecute('mkdir', $aryParams, 'space');
		echo $this->XML2JSON($result);
	}

	public function delete () {
		$id = $this->input->post('id', TRUE);
		$force = $this->input->post('option', TRUE);
		$userinfo = $this->session->userdata('userinfo');
		$aryParams = array('id' => $id, 'option' => $force, 'sid' => $userinfo['session']);
		$result = $this->vservices->actionExecute('delete', $aryParams, 'space');		
		echo $this->XML2JSON($result);
	}

	public function rename () {
		$id = $this->input->post('id', TRUE);
		$newName = $this->input->post('name', TRUE);
		$userinfo = $this->session->userdata('userinfo');
		$aryParams = array('id' => $id, 'name' => $newName, 'sid' => $userinfo['session']);
		$result = $this->vservices->actionExecute('rename', $aryParams, 'space');		
		echo $this->XML2JSON($result);
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
			$sid = session_id();
			//$aryParams = array('src' => 'space', 'token' => md5(_DUMMY_USER_NAME.self::TOKENPW),'username' => _DUMMY_USER_NAME, 'password' => _DUMMY_USER_PASSWORD, 'sid' => $sid);
			$aryParams = array('src' => 'space', 'token' => md5($username.self::TOKENPW),'username' => $username, 'password' => $password, 'sid' => $sid);
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
		$aryData = array(
			'USER' => $this->session->userdata('userinfo'),
			'ERROR' => $aryErr
		);
		echo json_encode($aryData);
	}

	public function logout() {
		$userinfo = $this->session->userdata('userinfo');	
		$aryParams = array('sid' => $userinfo['session']);
		$result = $this->vservices->actionExecute('logout', $aryParams, 'user');
		$this->session->unset_userdata('userinfo');
		parse_str ($result, $aryLogout);
		echo json_encode($aryLogout);		
	}

	public function noop () {
		$result = $this->vservices->actionExecute('noop', null, 'user');
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
		/*else {
			$aryParams = array('src' => 'space', 'us_id' => $userinfo['id']);
			$result = $this->vservices->actionExecute('getinfo', $aryParams, 'user');
			parse_str ($result, $aryResult);
			error_log(var_export($aryParams, TRUE) . '   -   ' . var_export($aryResult, TRUE), 3, dirname(dirname(dirname(__FILE__))).'/userinfo.log');
			if (isset($aryResult['errCode'])) {
				$result = json_encode(array('ERROR' => $aryErr));
				return FALSE;
			}else return TRUE;
		}*/
	}

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

        return json_encode($result);
    }

    /*
	public function createDir() {
		$parentDir = $this->input->post ( 'fparentid', TRUE );
		$name = $this->input->post ( 'fname', TRUE );

		$xmlData = $this->vservices->actionExecute ( 'mkdir', array (
				'name' => $name,
				'parent_id' => $parentDir == 0 ? - 1 : $parentDir
		) );

		$this->xml->parse ( $xmlData );

		$aryError = array (
				'err' => $this->xml->status->_param ['err'],
				'errCode' => ( int ) $this->xml->status->_param ['errCode']
		);
		$aryData = array (
				'id' => $this->xml->status->_param ['id'],
				'name' => $this->xml->status->_param ['name'],
				'parentID' => $parentDir,
				'ERROR' => $aryError
		);
		echo json_encode ( $aryData );
	}

	public function delete() {
		$delobj = $this->input->post ( 'delobj', TRUE );
		$xmlData = $this->vservices->actionExecute ( 'deletemulti', array (
				'delobj' => $delobj
		) );
		$this->xml->parse ( $xmlData );
		$aryFolders = array ();

		if (isset ( $this->xml->tree->folder )) {
			if (is_array ( $this->xml->tree->folder )) {
				foreach ( $this->xml->tree->folder as $key => $folder ) {
					$aryFolders ['DIRECTORIES'] [] = $folder->_param ['id'];
				}
			} else {
				$aryFolders ['DIRECTORIES'] [] = $this->xml->tree->folder->_param ['id'];
			}
		}

		if (isset ( $this->xml->tree->file )) {
			if (is_array ( $this->xml->tree->file )) {
				foreach ( $this->xml->tree->file as $key => $file ) {
					$aryFolders ['FILES'] [] = $file->_param ['id'];
				}
			} else {
				$aryFolders ['FILES'] [] = $this->xml->tree->file->_param ['id'];
			}
		}

		$aryError = array (
				'err' => $this->xml->tree->_param ['err'],
				'errCode' => ( int ) $this->xml->tree->_param ['errCode']
		);
		$aryData = array (
				'DIRECTORIES' => isset ( $aryFolders ['DIRECTORIES'] ) ? $aryFolders ['DIRECTORIES'] : array (),
				'FILES' => isset ( $aryFolders ['FILES'] ) ? $aryFolders ['FILES'] : array (),
				'ERROR' => $aryError
		);
		echo json_encode ( $aryData );
	}

	public function rename() {
		$item = $this->input->post ( 'data', TRUE );
		$objItem = json_decode($item);

		$xmlData = $this->vservices->actionExecute ('rename', array ('id' => $objItem->id, 'name' => $objItem->name, 'type' => $objItem->type, 'parentid' => $objItem->parentID == 0 ? -1:$objItem->parentID, 'newName' => $objItem->newName));
		$this->xml->parse ( $xmlData );
		$err = $this->xml->tree->_param ['err'];
		$errCode = ( int ) $this->xml->tree->_param ['errCode'];
		$aryItem = array('id' => (int) $this->xml->tree->item->_param['id'],'name' => $this->xml->tree->item->_param['name'],'parentID' => $this->xml->tree->item->_param['parentId'] == -1 ? 0 : $this->xml->tree->item->_param['parentId']);

 		$aryData ['DIRECTORIES'] = $objItem->type == 'directory' ? $aryItem :array();
 		$aryData ['FILES'] = $objItem->type == 'file' ? $aryItem :array();
		$aryData ['ERROR'] = array ('err' => $err, 'errCode' => $errCode);

		echo json_encode ( $aryData );
	}

	public function copy() {
		$destination = $this->input->post ( 'destination', TRUE );
		$data = $this->input->post ( 'data', TRUE );
		$act = $this->input->post ( 'act', TRUE );
		$option = $this->input->post ( 'option', TRUE );

		$xmlData = $this->vservices->actionExecute ( 'copy', array (
				'act' => $act,
				'option' => $option,
				'data' => $data,
				'destination' => $destination == 0 ? - 1 : $destination
		) );

		$this->xml->parse ( $xmlData );

		$deletedFiles = array();
		$deletedDirs = array();
		$aryNewDirs = isset ( $this->xml->data->folderdata ) ? json_decode ( $this->xml->data->folderdata->_value ) : array ();
		$aryNewFiles = isset ( $this->xml->data->filedata ) ? json_decode ( $this->xml->data->filedata->_value ) : array ();

		if ($act == 'move') {
			$deletedFiles = isset ( $this->xml->data->deletedFiles ) ? json_decode ( $this->xml->data->deletedFiles->_value ) : array ();
			$deletedDirs = isset ( $this->xml->data->deletedDirs ) ? json_decode ( $this->xml->data->deletedDirs->_value ) : array ();
		}

		$aryData = array (
				'DIRECTORIES' => $aryNewDirs,
				'FILES' => $aryNewFiles,
				'deletedFiles' => $deletedFiles,
				'deletedDirs' => $deletedDirs
		);

		$aryData ['ERROR'] = array (
				'err' => $this->xml->data->_param ['err'],
				'errCode' => ( int ) $this->xml->data->_param ['errCode']
		);
		echo json_encode ( $aryData );
	}

	public function getSpaceInfo () {
		$this->load->model('frontend/User_model', 'user');
		$userInfo = $this->session->userdata ( 'userInfo' );
		$aryParams = array();
        parse_str($userInfo['user'], $aryParams);
		$aryUser = $this->user->get_user_by_id($aryParams['id']);
		$aryData = array('USER' => $aryUser);
		$aryData ['ERROR'] = array (
				'err' => '',
				'errCode' => 0
		);
		echo json_encode ( $aryData );
	}*/
}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */