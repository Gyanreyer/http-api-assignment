const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Takes info and writes appropriate response
const generateResponse = (type, statusCode, response, message, id = null) => {
  response.writeHead(statusCode, { 'Content-Type': type });

  // Return xml message
  if (type === 'text/xml') {
    // Send xml string with given message and id - if id is null then don't include it
    response.write(`<response><message>${message}</message>${id ? `<id>${id}</id>` : ''}</response>`);
  } else {
    // Return json message by default
    const returnObj = { message };
    if (id) returnObj.id = id;// Only add id property if id is given

    response.write(JSON.stringify(returnObj));
  }

  response.end();
};

exports.GetIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

exports.GetStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

exports.SendSuccess = (request, response, queries) => {
  generateResponse(queries.type, 200, response, 'Successful response');
};

exports.SendBadRequest = (request, response, queries) => {
  let statusCode;
  let message;
  let id;

  if (queries.valid === 'true') {
    message = 'Request has required parameters';
    id = null;
    statusCode = 200;
  } else {
    message = 'Missing valid query parameter set to true';
    id = 'badRequest';
    statusCode = 400;
  }

  generateResponse(queries.type, statusCode, response, message, id);
};

exports.SendUnauthorized = (request, response, queries) => {
  let statusCode;
  let message;
  let id;

  if (queries.loggedIn === 'yes') {
    message = 'You have successfully viewed the content.';
    id = null;
    statusCode = 200;
  } else {
    message = 'Missing loggedIn query parameter set to yes';
    id = 'unauthorized';
    statusCode = 401;
  }

  generateResponse(queries.type, statusCode, response, message, id);
};

exports.SendForbidden = (request, response, queries) => {
  generateResponse(queries.type, 403, response, 'You do not have access to this content', 'forbidden');
};

exports.SendInternal = (request, response, queries) => {
  generateResponse(queries.type, 500, response, 'Internal server error, something went wrong', 'internalError');
};

exports.SendNotImplemented = (request, response, queries) => {
  generateResponse(queries.type, 501, response, 'A request for this page has not been implemented yet', 'notImplemented');
};

exports.SendNotFound = (request, response, queries) => {
  generateResponse(queries.type, 404, response, 'Page not found', 'notFound');
};
