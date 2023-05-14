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
        'Content-Type': 'text/html'
      },
      body: `
        <div style="display: flex;">
          <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
            <h1>Uh oh, you're lost</h1>
          </div>
          <div style="flex: 1;">
            <video src="RB-yrHYLwpLsgbIN.mp4" autoplay loop style="width: 100%; height: 100%; object-fit: cover;"></video>
          </div>
        </div>
      `
    };
  }
};
