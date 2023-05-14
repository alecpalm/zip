const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  const short = event.path.substring(1);
  console.log('Short URL:', short);

  const query = q.Get(q.Match(q.Index('urls_by_short'), short));
  console.log('FaunaDB query:', JSON.stringify(query)); // Debugging: log the FaunaDB query

  try {
    const result = await client.query(query);
    console.log('Query result:', result);

    return {
      statusCode: 302,
      headers: {
        Location: result.data.url
      },
      body: ''
    };
  } catch (error) {
    console.error('Error:', error);
    console.error('FaunaDB server secret:', process.env.FAUNADB_SERVER_SECRET); // Debugging: log the server secret
    
    // Custom 404 response
    return {
      statusCode: 404,
      headers: {
        'Location': '/404.html' // Redirect to the custom 404 page
      },
      body: ''
    };
  }
};
