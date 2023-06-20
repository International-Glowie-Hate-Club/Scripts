print "Open Port 80/22  [Y/n]\n";
chomp($req=<STDIN>);
if(lc ($req) eq "y" || $req eq ""){
    print "";
    sleep(2);
    system("sudo ufw allow 80/tcp");
    system("sudo ufw allow 22/tcp");
    system("sudo ufw reload");
    system("sudo systemctl enable apache2");
    system("sudo systemctl start apache2");
    system("sudo apt update");
    system("sudo apt install -y php libapache2-mod-php php-mysql php-dev php-gd php-memcache php-pspell php-snmp php-xmlrpc php-xml");
    system("sudo systemctl restart apache2");
    system("");
    print "";
}

print "Do you want to install the required packages? [Y/n]\n";
chomp($req=<STDIN>);
if(lc ($req) eq "y" || $req eq ""){
    print "Installing required packages...\n";
    sleep(2);
    system("sudo apt update");
    system("sudo apt install -y build-essential gcc libssh2-1 libssh2-1-dev");
    system("sudo apt install -y apache2");
    system("sudo systemctl enable apache2");
    system("sudo apt install -y php libapache2-mod-php php-mysql php-dev php-gd php-memcache php-pspell php-snmp php-xmlrpc php-xml");
    system("sudo systemctl restart apache2");
    system("sudo apt install -y build-essential");
    system("sudo apt install -y screen");
    system("sudo apt install -y software-properties-common");
    system("sudo add-apt-repository ppa:ondrej/php");
    system("sudo apt update");
    system("sudo apt install -y php7.2");
    system("sudo apt install -y php7.2-mysql");
    system("sudo apt install -y apache2");
    system("sudo apt update");
    system("sudo apt install -y unzip");
    print "\nInstallation of packages completed!\n";
}

print "Do you want to install SSH2? [Y/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "y" || $ssh eq ""){
    print "Installing SSH2...\n";
    sleep(2);
    system("sudo apt update");
    system("sudo apt install -y gcc php-dev libssh2-1-dev");
    system("wget https://github.com/Sean-Der/pecl-networking-ssh2/archive/php7.zip");
    system("unzip php7.zip");
    system("cd pecl-networking-ssh2-php7");
    system("phpize");
    system("./configure");
    system("make");
    system("sudo make install");
    system("sudo touch /etc/php/7.2/mods-available/ssh2.ini");
    system('sudo sh -c \'echo "extension=ssh2.so" > /etc/php/7.2/mods-available/ssh2.ini\'');
    system("sudo ln -s /etc/php/7.2/mods-available/ssh2.ini /etc/php/7.2/apache2/conf.d/20-ssh2.ini");
    system("sudo systemctl restart apache2");
    print "\nVerification...\n";
    system("php -m | grep ssh2");
    print "If you see \"ssh2\", it means the installation was successful!\n";
}

print "Install extras? [Y/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "y" || $ssh eq ""){
    print "Installing extras...\n";
    sleep(2);
    system("sudo apt install -y nano");
    system("sudo apt install -y cpan");
    system("sudo apt install -y vnstat");
    system("sudo apt install -y dstat");
    system("sudo apt install -y hping3");
    system("sudo apt install -y htop");
    print "\nInstallation of extras completed!\n";
}

print "Check Port 80/22 TCP? [Y/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "y" || $ssh eq ""){
    print "Opening ports...\n";
    sleep(2);
    system("sudo ufw enable");
    system("sudo ufw allow 80/tcp");
    system("sudo ufw allow 22/tcp");
    system("sudo ufw status");
    print "\nPort 80/22 TCP opened!\n";
}

print "Install SSH2 pecl? [Y/n]\n";
chomp($ssh=<STDIN>);
if(lc ($ssh) eq "y" || $ssh eq ""){
    print "Installing SSH2 pecl...\n";
    sleep(2);
    system("sudo apt install -y php-ssh2");
    system("sudo systemctl restart apache2");
    system("php -m | grep ssh2");
    print "\nInstallation of SSH2 pecl completed!\n";
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
