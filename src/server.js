const http = require('http');
const url = require('url');
const requestHandler = require('./requestHandler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  const queries = parsedUrl.query;//Get queries object from parsed url

  queries.type = queries.type || 'application/json';//If queries doesn't have type property, set it to json

  // Switch on url path to determine what response to send
  switch (parsedUrl.pathname) {
    case '/':
      requestHandler.GetIndex(request, response);
      break;
    case '/style.css':
      requestHandler.GetStyle(request, response);
      break;
    case '/success':
      requestHandler.SendSuccess(request, response, queries);
      break;
    case '/badRequest':
      requestHandler.SendBadRequest(request, response, queries);
      break;
    case '/unauthorized':
      requestHandler.SendUnauthorized(request, response, queries);
      break;
    case '/forbidden':
      requestHandler.SendForbidden(request, response, queries);
      break;
    case '/internal':
      requestHandler.SendInternal(request, response, queries);
      break;
    case '/notImplemented':
      requestHandler.SendNotImplemented(request, response, queries);
      break;
    default:
      requestHandler.SendNotFound(request, response, queries);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
