<?php


Class Vservices {
	
	private $_apiUrl;
	private $_curlObj;
	private $_userId;
	private $_password;
	
	private $_httpUser;
	private $_httpPasswd;
	
	public function __construct() {
	}
	public function setApiUrl($url) {
		$this->_apiUrl = $url;
	}
	
	public function setConnection($curl) {
		$this->_curlObj = $curl;
	}
	
	public function setUserId ($userId) {
		$this->_userId = $userId;
	}
	
	public function setPassword ($password) {
		$this->_password = $password;
	}
	
	public function getPrivateTree () {
		$this->_curlObj->create($this->_apiUrl. 'space/dir/isgetall/1');
		$this->_curlObj->option(CURLOPT_BUFFERSIZE, 10);
		$this->_curlObj->options(array(CURLOPT_BUFFERSIZE => 10));
                $post =  $this->_userId ? array('userid' => $this->_userId) : array();
		$this->_curlObj->post($post);
		return $this->_curlObj->execute();
	}
    
    public function getPreview ($fileId) {
		$this->_curlObj->create($this->_apiUrl. 'space/preview/');
		$this->_curlObj->option(CURLOPT_BUFFERSIZE, 10);
		$this->_curlObj->options(array(CURLOPT_BUFFERSIZE => 10));
                $post =  $this->_userId ? array('fileId' => $fileId,'userId' => $this->_userId) : array();
		$this->_curlObj->post($post);
		return $this->_curlObj->execute();
	}
	
	/**
	 * $aryParams
	 * 
	 * @param unknown $action
	 * @param unknown $aryParams
	 */
	public function actionExecute ($action, $aryParams = array(), $module = 'space') {
		$url = $this->_apiUrl. $module .'/'.$action;
		
		$this->_curlObj->create($url);
		$this->_curlObj->option(CURLOPT_BUFFERSIZE, 10);
		$this->_curlObj->option(CURLOPT_HEADER, 0);
		$this->_curlObj->option(CURLOPT_FAILONERROR, FALSE);
		
		if ($this->_httpUser && $this->_httpPasswd) {
			$this->_curlObj->http_login($this->_httpUser, $this->_httpPasswd);
		}
		
		if ($this->_userId) $aryParams['userid'] = $this->_userId;
		if (count($aryParams) > 0) $this->_curlObj->post($aryParams);
		
		$result = $this->_curlObj->execute();

		$serverIP = gethostbyname (parse_url($this->_apiUrl, PHP_URL_HOST));
		/*$mapFunc = function($k, $v)
					{
						return "$k/$v";
					};
		
		$paramStr = array_map($mapFunc, array_keys($aryParams), array_values($aryParams));
		
		$logApiURL = $url . '/' . implode('/',$paramStr);
		$logMsg = "=========\n" . date('Y-m-d H:i:s') ."\n".'FILE: '. __FILE__ . ' -- LINE:'. __LINE__ . "\n" .'API Result: '."\n------\n". var_export($result, true). "\n------\n" . 'ACTION: '. var_export($logApiURL, true) . "\n" .'PARAMS: '. var_export($aryParams, true). "\n".'API SERVER IP: '.$serverIP. "\n========="."\n\n";
		error_log($logMsg, 3, dirname(dirname(dirname(__FILE__))).'/logs/api.log');*/
		
		return $result;
	}
	
	public function __destruct() {
		
	}
}