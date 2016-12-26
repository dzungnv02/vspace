<?php

function getLanguages($default='en-us')
{
  $user_languages =array();
	
	if ( isset( $_SERVER["HTTP_ACCEPT_LANGUAGE"] ) ) 
	{
		$languages = strtolower( $_SERVER["HTTP_ACCEPT_LANGUAGE"] );
		// $languages = ' fr-ch;q=0.3, da, en-us;q=0.8, en;q=0.5, fr;q=0.3';
		// need to remove spaces from strings to avoid error
		$languages = str_replace( ' ', '', $languages );
		$languages = explode( ",", $languages );
		//$languages = explode( ",", $test);// this is for testing purposes only
	
		foreach ( $languages as $language_list )
		{
		  $a=substr( $language_list, 0, strcspn( $language_list, ';' ) ); //full language
			if(strlen($a)==2)
  			$user_languages[]=$a.'-'.$a;
			else
  			$user_languages[]=$a;			 
    }
			//$user_languages[] = substr( $language_list, 0, 2 ); // cut out primary language
		
		return $user_languages;
	}
	else return array($default);
	
}
?>