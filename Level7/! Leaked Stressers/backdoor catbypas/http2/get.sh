#!/bin/bash

echo "\033[92mRemoving old proxys\033[37m..."
rm -rf proxynofilter.txt proxys.txt 2>/dev/null
echo "\033[92mDownloading proxy\033[37m..."
wget "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=500&country=all&ssl=all&anonymity=all" -O proxynofilter.txt 2>/dev/null
wget "https://www.proxy-list.download/api/v1/get?type=http" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt 2>/dev/null
wget "https://www.proxyscan.io/api/proxy?type=http&format=txt&limit=10" -O proxy.txt 2>/dev/null
wget "https://www.proxyscan.io/api/proxy?type=http&format=txt&limit=10" -O proxy1.txt 2>/dev/null
wget "https://www.proxyscan.io/api/proxy?type=http&format=txt&limit=10" -O proxy2.txt 2>/dev/null
wget "https://www.proxyscan.io/api/proxy?type=http&format=txt&limit=10" -O proxy3.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
cat proxy1.txt >> proxynofilter.txt 2>/dev/null
cat proxy2.txt >> proxynofilter.txt 2>/dev/null
cat proxy3.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt proxy1.txt proxy2.txt proxy3.txt 2>/dev/null
wget "https://proxy11.com/api/proxy.txt?key=NDAzNg.YYHPVA.QB8moHDjsHJ_R_q8lkgkUV3wt2c" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
wget "https://proxylist.geonode.com/api/proxy-list?protocols=http" -O proxy.txt 2>/dev/null
cat proxy.txt | sed "s/,/ /g" | sed "s/{/\n{/g" |awk '{print $2" "$3}'|sed 's/"ip":"//g'|tr -d '"'|sed "s/ port:/:/g" > proxys.txt
rm -rf proxy.txt
cat proxys.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt 2>/dev/null
wget "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all&simplified=true" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt
wget "https://www.proxy-list.download/api/v1/get?type=http" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt
python3 proxyScraper.py -p http 2>/dev/null
cat output.txt >> proxynofilter.txt
rm -rf output.txt
wget "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt 2>/dev/null
rm -rf proxy.txt
wget "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/chipsed/proxies/main/proxies.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/hendrikbgr/Free-Proxy-Repo/master/proxy_list.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http%2Bhttps.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/proxiesmaster/Free-Proxy-List/main/proxies.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://api.proxyscrape.com/v2/account/datacenter_shared/proxy-list?auth=8fo1gdqz21oamvso6zdy&type=getproxies&country[]=all&protocol=http&format=normal&status=all" -O proxy.txt Ã2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/roma8ok/proxy-list/main/proxy-list-http.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/roma8ok/proxy-list/main/proxy-list-https.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://raw.githubusercontent.com/Volodichev/proxy-list/main/http.txt" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://www.proxy-list.download/api/v1/get?type=http" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://www.proxy-list.download/api/v1/get?type=https" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
wget "https://www.proxyscan.io/download?type=http" -O proxy.txt 2>/dev/null
cat proxy.txt >> proxynofilter.txt
rm -rf proxy.txt
cat proxynofilter.txt | sort | uniq > proxy.txt 2>/dev/null
mv proxy.txt proxynofilter.txt 2>/dev/null
echo "\033[91mDone\033[37m.\n"

node proxychecker.js proxynofilter.txt http proxys.txt 1
