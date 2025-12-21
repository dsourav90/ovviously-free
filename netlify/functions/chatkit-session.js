exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { deviceId } = JSON.parse(event.body);
    const workflowId = process.env.REACT_APP_CHATKIT_WORKFLOW_ID;
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!workflowId || !apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing configuration. Please set REACT_APP_CHATKIT_WORKFLOW_ID and REACT_APP_OPENAI_API_KEY in Netlify environment variables' 
        })
      };
    }

    // Create ChatKit session
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
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to create ChatKit session' })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ client_secret: data.client_secret })
    };
  } catch (error) {
    console.error('Error creating ChatKit session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
