const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { short, url } = JSON.parse(event.body);
  if (!short || !url) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  const data = { short, url };

  try {
    const existingUrl = await client.query(q.Get(q.Match(q.Index('urls_by_short'), short)));
    if (existingUrl) {
      return { statusCode: 409, body: 'URL already exists' };
    }
  } catch (error) {
    // No existing URL, continue to create one
  }

  const query = q.Create(q.Collection('urls'), { data });

  try {
    await client.query(query);
    return { statusCode: 200, body: 'URL shortened successfully' };
  } catch (error) {
    return { statusCode: 500, body: 'An error occurred: ' + error.toString() };
  }
};
