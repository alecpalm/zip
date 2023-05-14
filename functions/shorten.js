const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { short, url } = JSON.parse(event.body);
  if (!short || !url) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const redirectsPath = path.join(__dirname, '../_redirects');
  const newRedirect = `\n/${short} ${url} 301`;

  fs.appendFileSync(redirectsPath, newRedirect);

  return { statusCode: 200, body: 'URL shortened successfully' };
};
