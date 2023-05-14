const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  const short = event.path.substring(1);
  const query = q.Get(q.Match(q.Index('urls_by_short'), short));

  try {
    const result = await client.query(query);
    return {
      statusCode: 302,
      headers: {
        Location: result.data.url
      },
      body: ''
    };
  } catch (error) {
    return { statusCode: 404, body: 'Not Found' };
  }
};
