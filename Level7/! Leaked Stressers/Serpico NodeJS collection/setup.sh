echo "====> Layer7 Autoinstaller <===="
sudo apt-get update -y
echo "==> Installing Apache2 + PHP..."
sudo apt-get install apache2 -y
sudo apt-get install php -y
echo "==> Installing methods + api..."
sudo apt-get install screen -y
cd /var/www/html
wget -r -nH --cut-dirs=7 --reject="index.html*, *.gif" https://api-services.online/layer7_setup_script_methods_000/
mv api.php.txt api.php
chmod 777 *
sudo apt-get install nodejs -y
sudo apt-get install npm -y
npm install
npm i request
npm i fs
npm i cloudscraper
npm i crypto
npm i net
npm i url
npm i path
npm i sjcl
echo "====>   F I N I S H E D   <===="echo "====> Layer7 Autoinstaller <===="
sudo apt-get update -y
echo "==> Installing Apache2 + PHP..."
sudo apt-get install apache2 -y
sudo apt-get install php -y
echo "==> Installing methods + api..."
sudo apt-get install screen -y
cd /var/www/html
wget -r -nH --cut-dirs=7 --reject="index.html*, *.gif" https://api-services.online/layer7_setup_script_methods_000/
mv api.php.txt api.php
chmod 777 *
sudo apt-get install nodejs -y
sudo apt-get install npm -y
npm install
npm i request
npm i fs
npm i cloudscraper
npm i crypto
npm i net
npm i url
npm i path
npm i sjcl
echo "====>   F I N I S H E D   <===="
