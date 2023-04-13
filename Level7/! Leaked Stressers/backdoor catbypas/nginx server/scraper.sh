wget 'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt' -O proxy.txt
cat proxy.txt | uniq > uniq.txt
rm -rf proxy.txt
node proxychecker.js uniq.txt http proxys.txt 10000

