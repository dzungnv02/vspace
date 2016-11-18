<?php

if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
/**
 * Mysocket Class
 *
 * @author dzungnv02
 *
 */

//if ( ! defined('_DUMMY_USER_NAME')) define('_DUMMY_USER_NAME','dungnv02');
//if ( ! defined('_DUMMY_USER_PASSWORD')) define('_DUMMY_USER_PASSWORD','472607');

class Mysocket extends CI_Controller {
	public function __construct() {
		parent::__construct ();
	}

	public function index() {		
		$package = "\x08\x00\x19\x2f\x00\x00\x00\x00\x70\x69\x6e\x67";
	    /* create the socket, the last '1' denotes ICMP */    
	    $socket = socket_create(AF_INET, SOCK_RAW, 1);	    
	    /* set socket receive timeout to 1 second */
	    socket_set_option($socket, SOL_SOCKET, SO_RCVTIMEO, array("sec" => 1, "usec" => 0));	    
	    /* connect to socket */
	    socket_connect($socket, $host, null);	    
	    /* record start time */
	    list($start_usec, $start_sec) = explode(" ", microtime());
	    $start_time = ((float) $start_usec + (float) $start_sec);	    
	    socket_send($socket, $package, strlen($package), 0);	    
	    if(@socket_read($socket, 255)) {
	        list($end_usec, $end_sec) = explode(" ", microtime());
	        $end_time = ((float) $end_usec + (float) $end_sec);
	    
	        $total_time = $end_time - $start_time;
	        
	        return $total_time;
	    } else {
	        return false;
	    }	    
	    socket_close($socket);

	}

	public function test() {
$array = array( "orange" , "apple" , "grape" , "banana" , "raspberry" );
$popped = array_pop( $array );
$shifted = array_shift( $array );
print_r( $array );
	}

	
}

function culc( $mode )
{
  $value  = 10;
  switch( $mode )
  {
    default : $value += 1;
    case "a" :   $value += 5;break;
    case "b" :   $value += 3;break;
    case "c" :   $value += 7;
    case "d" :   $value += 2;break;
  }
  return $value;
}