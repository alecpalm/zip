const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET });
const q = faunadb.query;

exports.handler = async function(event, context) {
  const short = event.path.substring(1);
  console.log('Short URL:', short); // Debugging: log the short URL

  // If the path is empty or contains "index.html", return the main page content
  if (short === '' || short === 'index.html') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: '<!-- Place your main page HTML content here -->'
    };
  }

  const query = q.Get(q.Match(q.Index('urls_by_short'), short));

  try {
    const result = await client.query(query);
    console.log('Query result:', result); // Debugging: log the query result

    return {
      statusCode: 302,
      headers: {
        Location: result.data.url
      },
      body: ''
    };
  } catch (error) {
    console.error('Error:', error); // Debugging: log the error
    return { statusCode: 404, body: 'OOPS' };
  }
};
