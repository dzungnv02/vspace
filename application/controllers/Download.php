<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Download extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $user = $this->session->userdata('userInfo');
        $this->vservices->setApiUrl($this->config->item('api_url'));
        $this->vservices->setConnection($this->curl);
        $this->vservices->setUserId($user['us_id']);
    }

    public function getFile() {

        $user = $this->session->userdata('userInfo');
        $data = $this->input->post('data');
        $treeArray = json_decode($data, TRUE);

        foreach ($treeArray as $index=>$tree) 
        {
            $treeArray[$index]['name']=$this->convert_vi_to_en($treeArray[$index]['name']);
            $treeArray[$index]['fileurl']=$this->encodePath($treeArray[$index]['fileurl']);
            foreach ($tree['childFiles'] as $index2=>$file)
            {
                $treeArray[$index]['childFiles'][$index2]['name']=$this->convert_vi_to_en($treeArray[$index]['childFiles'][$index2]['name']);
                $treeArray[$index]['childFiles'][$index2]['fileurl']=$this->encodePath($treeArray[$index]['childFiles'][$index2]['fileurl']);
            }
            foreach ($tree['childDirs'] as $index2=>$file)
            {
                $treeArray[$index]['childDirs'][$index2]['name']=$this->convert_vi_to_en($treeArray[$index]['childDirs'][$index2]['name']);
                $treeArray[$index]['childDirs'][$index2]['fileurl']=$this->encodePath($treeArray[$index]['childDirs'][$index2]['fileurl']);
            }
            
        }
        
        if ((count($treeArray) == 1) && ($treeArray[0]['type'] == 'file')) {
           
            $file = $treeArray[0];
            $local_file = "downloads/" . $file['name'];
            $download_file = $file['name'];
            $filecontent = file_get_contents($file['fileurl']);
            file_put_contents($local_file, $filecontent);
        } else {
            // create parent folder
            $download_file = $user['username'] . "_" . date("d-m-Y");
            $folder = "downloads/" . $download_file;
            mkdir($folder, 0777);
            foreach ($treeArray as $idx=>$tree) {
                
                if ($tree['type'] == 'file') {
                    $path = $folder . "/" . $tree['name'];
                    $filecontent = file_get_contents($tree['fileurl']);
                    file_put_contents($path, $filecontent);
                }
                if ($tree['type'] == 'directory') {
                    // create subfolder
                    mkdir($folder . "/" . $tree['name']);
                    $childDirs = $this->aasort($tree['childDirs'], "id");
                    foreach ($childDirs as $index => $dir) {
                   
                        if ($dir['parentID'] == $tree['id']) {
                            $path = $folder . "/" . $tree['name'] . "/" . $dir['name'];
                            mkdir($path, 0777);
                            $childDirs[$index]['path'] = $path;
                        } else {
                            foreach ($childDirs as $index2 => $dir2) {
                                if ($dir2['id'] == $dir['parentID']) {
                                    $path = $childDirs[$index2]['path'] . "/" . $dir['name'];
                                    mkdir($path, 0777);
                                    $childDirs[$index]['path'] = $path;
                                }
                            }
                        }
                    }
                    $childFiles = $tree['childFiles'];
                    foreach ($childFiles as $index => $file) {
                        // add file to folder
                        if ($file['parentID'] == $tree['id']) {
                            $path = $folder . "/" . $tree['name'] . "/" . $file['name'];
                           
                            $filecontent = file_get_contents($file['fileurl']);
                            file_put_contents($path, $filecontent);
                        } else {
                            foreach ($childDirs as $index2 => $dir2) {
                                if ($dir2['id'] == $file['parentID']) {
                                    $path = $childDirs[$index2]['path'] . "/" . $file['name'];
                                    $filecontent = file_get_contents($file['fileurl']);
                                    file_put_contents($path, $filecontent);
                                }
                            }
                        }
                    }
                }
            }
            // zip folder
            $command = "tar -C downloads -cvf " . $folder . ".zip" . " $download_file";

            exec($command);
            $local_file = $folder . ".zip";
            $download_file = $download_file . ".zip";
        }
        $mime = "application/octet-stream";
        if (get_mime_by_extension($local_file) != "") {
            $mime = get_mime_by_extension($local_file);
        }
        header('Cache-control: private');
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($local_file));
        header('Content-Disposition: attachment; filename=' . $download_file);
        $download_rate = 2048;
        flush();
        $file = fopen($local_file, "r");

        while (!feof($file)) {
            print fread($file, round($download_rate * 1024));
            flush();
            sleep(1);
        }
        fclose($file);
        unlink($local_file);
        if (isset($folder)) {
            exec("rm -fr $folder");
        }
        exit;
    }

    private function aasort($array, $key) {
        $sorter = array();
        $ret = array();
        reset($array);
        foreach ($array as $ii => $va) {
            $sorter[$ii] = $va[$key];
        }
        asort($sorter);
        foreach ($sorter as $ii => $va) {
            $ret[$ii] = $array[$ii];
        }
        $array = $ret;
        return $array;
    }

    private function encodePath($path) {
        $fileName = $path;
        $fileNames = explode("/", $fileName);
        $name = $fileNames[(count($fileNames) - 1)];
        $fileName = str_replace($name, "", $fileName) . str_replace("+", "%20", urlencode($name));
        return $fileName;
    }

    private function convert_vi_to_en($str) {
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", "a", $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", "e", $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", "i", $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", "o", $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", "u", $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", "y", $str);
        $str = preg_replace("/(đ)/", "d", $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", "A", $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", "E", $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", "I", $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", "O", $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", "U", $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", "Y", $str);
        $str = preg_replace("/(Đ)/", "D", $str);
        $str=  str_replace(" ", "_", $str);
        return $str;
    }

}

/* End of file privatecontent.php */
/* Location: ./application/modules/ajax/controllers/privatecontent.php */