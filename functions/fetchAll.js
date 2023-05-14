const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const urls = await client.query(q.Map(q.Paginate(q.Match(q.Index('all_urls'))), q.Lambda('x', q.Get('x'))));
    console.log('URLs fetched successfully:', urls);  // Debugging line
    return { statusCode: 200, body: JSON.stringify(urls) };
  } catch (error) {
    console.error('An error occurred:', error);  // Debugging line
    return { statusCode: 500, body: 'An error occurred: ' + error.toString() };
  }
};
