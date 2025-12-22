// Direct test of Neon Pool without Prisma
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const { neonConfig, Pool } = require('@neondatabase/serverless');
    
    neonConfig.fetchConnectionCache = true;
    
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'DATABASE_URL not set' })
      };
    }

    console.log('Testing direct Pool connection');
    console.log('DATABASE_URL exists:', !!databaseUrl);
    console.log('DATABASE_URL length:', databaseUrl.length);
    console.log('DATABASE_URL prefix:', databaseUrl.substring(0, 20));

    // Try to create a pool and execute a simple query
    const pool = new Pool({ connectionString: databaseUrl });
    
    console.log('Pool created');
    
    // Try a raw SQL query
    const client = await pool.connect();
    console.log('Client connected');
    
    const result = await client.query('SELECT NOW()');
    console.log('Query result:', result.rows[0]);
    
    client.release();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Direct Pool connection works!',
        time: result.rows[0]
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
};
