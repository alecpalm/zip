const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { short } = JSON.parse(event.body);
  if (!short) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  try {
    const existingUrlRef = await client.query(q.Select('ref', q.Get(q.Match(q.Index('urls_by_short'), short))));
    if (existingUrlRef) {
      await client.query(q.Delete(existingUrlRef));
      return { statusCode: 200, body: 'URL deleted successfully' };
    } else {
      return { statusCode: 404, body: 'URL not found' };
    }
  } catch (error) {
    return { statusCode: 500, body: 'An error occurred: ' + error.toString() };
  }
};
