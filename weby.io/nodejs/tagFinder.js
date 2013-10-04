var arguments = process.argv.splice(2);
var pg = require('pg');
var http = require('http');
var url = require('url');

// Force this referer
var REQUEST_REFERER = false;

// Database config
var DB_USER = "adrian";
var DB_PASS = "4ndr055!";
var DB_NAME = "weby.io";


// Get hostIp and hostPort
var temp = arguments[0].split(':');
var listeningHost = temp[0];
var listeningPort = parseInt(temp[1]);
var processLabel = listeningHost + ':' + listeningPort;

// Connection string
var conString = "postgres://" + DB_USER + ":" + DB_PASS + "@localhost/" + DB_NAME;

/**
 * Strip tags from input
 * @param input
 * @param allowed
 */
function stripTags (input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}


function findTags(query, response) {
	if (typeof query == "undefined") {
		return sendResponse([], response);
	}

	query = stripTags(query).toLowerCase();

	pg.connect(conString, function(err, client, done) {
		if(err) {
			done();
			return sendResponse([], response);
		}
		client.query('SELECT id, tag FROM w_tags WHERE tag LIKE $1::varchar LIMIT 10', ['%'+query+'%'], function(err, result) {
			done();
			if(err) {
				return sendResponse([], response);
			}
			if(result.rowCount == 0){
				result.rows = [{id:0, tag: query}];
			} else {
                var inRes = false;
                for(var i in result.rows){
                    if(result.rows[i].tag == query){
                        inRes = true;
                        break;
                    }
                }
                if(!inRes){
                    result.rows.push({id:0, tag: query});
                }
            }
			return sendResponse(result.rows, response);
		});
	});
}

function findWebies(query, response) {
    if (typeof query == "undefined") {
        return sendResponse([], response);
    }

    query = stripTags(query).toLowerCase();

    pg.connect(conString, function(err, client, done) {
        if(err) {
            done();
            return sendResponse([], response);
        }
        client.query('SELECT w.id, w.slug, w.hits, w.title, MIN(u.username) username, MIN(wi.file) screenshot, COUNT(f.weby) favorited_count FROM w_weby w ' +
                        'JOIN w_user u ON u.id = w.user ' +
                        "LEFT JOIN w_weby_image wi ON wi.weby = w.id AND tag ='frontend-square' " +
                        'LEFT JOIN w_favorite f ON f.weby = w.id ' +
                        'WHERE lower(w.title) LIKE $1::varchar AND w.deleted = 0::bit AND meta_follow = 1::bit GROUP BY w.id LIMIT 5',
                        ['%'+query+'%'], function(err, result) {
            done();
            if(err) {
                return sendResponse([], response);
            }

            return sendResponse(result.rows, response);
        });
    });
}

function sendResponse(data, response) {
	response.writeHead(200, {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
		'Connection': 'close',
		// Access Control to allow cross domain requests (for development only)
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true'
	});
	response.write(JSON.stringify(data));
	response.end();
}

// Create server which will catch requests and process
var server = http.createServer(function (request, response) {

	if(REQUEST_REFERER){
		// Make sure request came from domain name that is allowed to use this service
		if('referer' in request.headers){
			if(request.headers['referer'].indexOf(REQUEST_REFERER) > -1){
				// Parse request and get QUERY parameters*/
				var urlParts = url.parse(request.url, true);

				// Find tags
				return findTags(urlParts.query.tag, response);
			}
		}
		return sendResponse({message: 'Dude, you shouldn\'t be here!'}, response);
	}

	// Parse request and get QUERY parameters*/
	var urlParts = url.parse(request.url, true);

	// Find tags
    if (typeof urlParts.query.tag !='undefined') {
        return findTags(urlParts.query.tag, response);
    }
    if (typeof urlParts.query.search !='undefined') {
        return findWebies(urlParts.query.search, response);
    }

});

server.on("error", function (e) {
	// Just catch it...
});

server.listen(listeningPort, listeningHost);
process.stdout.write('[INFO][' + processLabel + ']: Listening...\n')