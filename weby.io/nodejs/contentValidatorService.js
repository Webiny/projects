var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy');
var numberOfListeners = parseInt(arguments[1]) || 3;

/**
 * Get hostIp and hostPort
 */

var temp = arguments[0].split(':');
var hostIp = temp[0];
var hostPort = parseInt(temp[1]);

/**
 * The addresses to use in round robin proxy
 */

var addresses = [];

/**
 * Child process handler
 */

console.log("\nBooting listeners...");

var listeners = [];

var spawn = require('child_process').spawn;
for (var i = 0; i < numberOfListeners; i++) {
	listeners[i] = spawn("node", ['./contentValidator.js', hostIp + ':' + (hostPort + (i + 1))]);
	addresses.push({
		host: hostIp,
		port: hostPort + (i + 1)
	});

	listeners[i].stdout.on('data', function (buf) {
		console.log(String(buf));
	});

	listeners[i].stderr.on('data', function (buf) {
		console.log(String(buf));
	});

	listeners[i].on("exit", function (code, signal) {
		console.log(this.pid + " is offline!");
	});

	console.log("PID: " + listeners[i].pid + ' > ' + addresses[i].host + ':' + addresses[i].port)
}

console.log("\nMaster process listening on " + hostIp + ':' + hostPort + ' PID: ' + process.pid+"\n");

// Create proxy server
var i = 0;
httpProxy.createServer(function (req, res, proxy) {
	proxy.proxyRequest(req, res, addresses[i]);
	i = (i + 1) % addresses.length;
}).listen(hostPort, hostIp);

var killListeners = function () {
	console.log("\nShutting down listeners...")
	for (var i in listeners) {
		var listener = listeners[i];
		listener.kill();
	}
	setTimeout(function(){
		process.exit(0);
	}, 1000);
}

process.on("SIGINT", killListeners);
process.on("SIGHUP", killListeners);