print <<EOTEXT;



         ,--.                                                            
        /  /,--.                               ,--.   ,--.       ,--.    
       /  / |  |,-----.,--.,--.,--,--,  ,--,--.|  |   |  | ,---. |  |-.  
      /  /  |  |`-.  / |  ||  ||      \' ,-.  ||  |.'.|  || .-. :| .-. ' 
.--. /  /   |  | /  `-.'  ''  '|  ||  |\ '-'  ||   ,'.   |\   --.| `-' | 
'--'/  /    `--'`-----' `----' `--''--' `--`--''--'   '--' `----' `---'  
   `--'                                                                                                                           




EOTEXT

print "Open Port 80/22  [O/n]\n";
chomp($req=<STDIN>);
if(lc ($req) eq "o" || $req eq ""){
	print "";
	sleep(2);
	system("sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT");
	system("sudo service iptables save");
	system("sudo /sbin/chkconfig httpd on");
	system("sudo /sbin/chkconfig --list httpd");
	system("sudo yum install php php-mysql php-devel php-gd php-pecl-memcache php-pspell php-snmp php-xmlrpc php-xml");
	system("sudo /usr/sbin/apachectl restart");
	system("");
	print "";
}

print "Voulez vous installer les paquet requis ? [O/n]\n";
chomp($req=<STDIN>);
if(lc ($req) eq "o" || $req eq ""){
	print "Installation des packet requis...\n";
	sleep(2);
	system("yum -y update");
	system("yum install -y make gcc libssh2 php-devel php-pearlibssh2-devel");
	system("yum install -y httpd mod_ssl");
	system("yum /sbin/chkconfig httpd on");
	system("yum install -y php php-mysql php-devel php-gd php-pecl-memcache php-pspell php-snmp php-xmlrpc php-xml");
	system("yum /usr/sbin/apachectl restart");
	system("yum install -y make");
	system("yum install -y gcc");
	system("yum install -y screen");
	system("yum install -y epel-release");
	system("yum install -y yum-utils");
	system("yum install -y http://rpms.remirepo.net/enterprise/remi-release-7.rpm");
	system("yum-config-manager --enable remi-php72");
	system("yum install -y php");
	system("yum install -y php-mysqlnd");
	system("yum install -y httpd");
	system("yum makecache");
	system("yum install -y unzip");
	print "\nL'installation des packet fini !\n";
}

print "Voulez vous installer SSH2 ? [O/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "o" || $ssh eq ""){
    print "Installation de SSH2...\n";
	sleep(2);
	system("yum install -y gcc php71w-devel libssh2 libssh2-devel");
	system("wget https://github.com/Sean-Der/pecl-networking-ssh2/archive/php7.zip");
	system("unzip php7.zip");
	system("pecl install -f ssh2");
	system("touch /etc/php.d/ssh2.ini");
	system("echo extension=ssh2.so > /etc/php.d/ssh2.ini");
	system("setsebool -P httpd_can_network_connect 1");
	system("/etc/init.d/httpd restart");
	print "\nVerification...\n";
	system("php -m | grep ssh2");
        system("cd pecl-networking-ssh2-php7");
        system("phpize");
        system("./configure");
        system("make");
        system("make install");
        system("systemctl restart httpd");
        system("systemctl start httpd");
	print "Si vous voyez \"ssh2\" c'est que cela a ete correctement installer !\n";
}

print "installer extra ? [O/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "o" || $ssh eq ""){
    print "Installation des Extras...\n";
	sleep(2);
	system("yum install -y nano");
	system("yum install -y cpan");
	system("yum install -y vnstat");
	system("yum install -y dstat");
	system("yum install -y hping3");
	system("yum install -y htop");
	print "\nL'installation des extras fini !\n";
}

	
	print "CheckPort 80/22 TCP ? [O/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "o" || $ssh eq ""){
    print "Ouverture des Ports...\n";
	sleep(2);
	system("systemctl start firewalld");
	system("systemctl enable firewalld");
	system("firewall-cmd --permanent --add-service=http");
	system("firewall-cmd  --permanent --add-port={80,22}/tcp ");
	system("firewall-cmd --complete-reload");
	system("firewall-cmd  --list-all");
	print "\nport/80/22/tcp open !\n";


print "installer SSH2 pecl ? [O/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "o" || $ssh eq ""){
    print "Installation du SSH2 pecl...\n";
	sleep(2);
	system("sudo yum install php-pecl-ssh2.x86_64");
	system("pecl install -f ssh2");
	system("service httpd restart");
	system("php -m | grep ssh2");
	print "\nL'installation du SSH2 pecl fini !\n";
}

	print <<EOTEXT;




         ,--.                                                            
        /  /,--.                               ,--.   ,--.       ,--.    
       /  / |  |,-----.,--.,--.,--,--,  ,--,--.|  |   |  | ,---. |  |-.  
      /  /  |  |`-.  / |  ||  ||      \' ,-.  ||  |.'.|  || .-. :| .-. ' 
.--. /  /   |  | /  `-.'  ''  '|  ||  |\ '-'  ||   ,'.   |\   --.| `-' | 
'--'/  /    `--'`-----' `----' `--''--' `--`--''--'   '--' `----' `---'  
   `--'                                                                  


EOTEXT
}
