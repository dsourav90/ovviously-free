const { buildLegalSystemInstructions } = require('./utils/legalContext');
const { buildSemanticInstructions } = require('./utils/legalSemanticSearch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, OpenAI-Beta, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { deviceId, contractType, query, useSemanticSearch = false } = requestBody;
    
    console.log('📥 ChatKit session request:', { deviceId, contractType, useSemanticSearch });

    const workflowId = process.env.REACT_APP_CHATKIT_WORKFLOW_ID;
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!workflowId || !apiKey) {
      console.error('❌ Missing environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Missing configuration. Please set REACT_APP_CHATKIT_WORKFLOW_ID and REACT_APP_OPENAI_API_KEY in Netlify environment variables' 
        })
      };
    }

    let systemInstructions;

    // Use semantic search if query is provided and enabled
    if (useSemanticSearch && query) {
      console.log('🔍 Using semantic search for query:', query.substring(0, 50));
      systemInstructions = await buildSemanticInstructions(query, 5);
    } else {
      // Fallback to static filtering by contract type
      console.log('📋 Using static context for contract type:', contractType);
      systemInstructions = buildLegalSystemInstructions(contractType);
    }

    // Create ChatKit session with legal context
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: deviceId || `user-${Date.now()}`,
        chatkit_configuration: {
          file_upload: {
            enabled: true
          }
        },
        instructions: systemInstructions
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to create ChatKit session', 
          details: error,
          status: response.status 
        })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ client_secret: data.client_secret })
    };
  } catch (error) {
    console.error('Error creating ChatKit session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
