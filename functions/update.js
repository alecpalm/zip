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
    const existingUrlRef = await client.query(q.Select('ref', q.Get(q.Match(q.Index('urls_by_short'), short))));
    if (existingUrlRef) {
      const query = q.Update(existingUrlRef, { data });
      await client.query(query);
      return { statusCode: 200, body: 'URL updated successfully' };
    }
  } catch (error) {
    return { statusCode: 500, body: 'An error occurred: ' + error.toString() };
  }
};
