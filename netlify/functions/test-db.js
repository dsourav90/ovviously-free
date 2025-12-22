exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    // Test 1: Check if DATABASE_URL exists
    const hasDbUrl = !!process.env.DATABASE_URL;
    
    // Test 2: Try to load Prisma modules
    let prismaLoaded = false;
    let neonLoaded = false;
    let clientCreated = false;
    let querySuccess = false;
    let error = null;
    let queryError = null;

    try {
      const { PrismaClient } = require('@prisma/client');
      const { Pool } = require('@neondatabase/serverless');
      const { PrismaNeon } = require('@prisma/adapter-neon');
      const { neonConfig } = require('@neondatabase/serverless');
      
      prismaLoaded = true;
      neonLoaded = true;

      // Test 3: Try to create client
      if (hasDbUrl) {
        neonConfig.fetchConnectionCache = true;
        
        // Log the connection string format
        const connStr = process.env.DATABASE_URL;
        console.log('Connection string starts with:', connStr.substring(0, 20));
        console.log('Connection string length:', connStr.length);
        
        const pool = new Pool({ connectionString: connStr });
        const adapter = new PrismaNeon(pool);
        
        // Check pool configuration
        console.log('Pool created with connection string');
        
        const prisma = new PrismaClient({ adapter });
        clientCreated = true;

        // Test 4: Try an actual query
        try {
          console.log('Attempting user count query...');
          const userCount = await prisma.user.count();
          console.log('Query succeeded! User count:', userCount);
          querySuccess = true;
        } catch (qe) {
          console.error('Query failed:', qe);
          queryError = qe.message;
        }
      }
    } catch (e) {
      error = e.message;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        databaseUrlExists: hasDbUrl,
        databaseUrlLength: hasDbUrl ? process.env.DATABASE_URL.length : 0,
        prismaLoaded,
        neonLoaded,
        clientCreated,
        querySuccess,
        error,
        queryError,
        nodeVersion: process.version
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
