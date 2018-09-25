const http = require('http'); // http module
const url = require('url'); // url module
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(request, response, bodyParams);
    });
  }
};


// function to handle requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    if (parsedUrl.pathname === '/') {
      htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
      htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/getUsers') {
      jsonHandler.getUsers(request, response);
    } else if (parsedUrl.pathname === '/updateUser') {
      jsonHandler.updateUser(request, response);
    } else {
      jsonHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    if (parsedUrl.pathname === '/getUsers') {
      jsonHandler.getUsersMeta(request, response);
    } else {
      jsonHandler.notFoundMeta(request, response);
    }
  } else {
    jsonHandler.notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
