export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, OpenAI-Beta, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      received: req.method,
      expected: 'POST'
    });
  }

  try {
    const { deviceId } = req.body;
    
    console.log('📥 ChatKit session request:', { deviceId });

    const workflowId = process.env.REACT_APP_CHATKIT_WORKFLOW_ID;
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const enableAttachments = process.env.REACT_APP_ENABLE_ATTACHMENTS === 'true';

    if (!workflowId || !apiKey) {
      console.error('❌ Missing environment variables');
      return res.status(500).json({ 
        error: 'Missing configuration. Please set REACT_APP_CHATKIT_WORKFLOW_ID and REACT_APP_OPENAI_API_KEY in Vercel environment variables' 
      });
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
        chatkit_configuration: {
          file_upload: {
            enabled: enableAttachments
          }
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);
      return res.status(response.status).json({ 
        error: 'Failed to create ChatKit session', 
        details: error,
        status: response.status 
      });
    }

    const data = await response.json();
    
    return res.status(200).json({ client_secret: data.client_secret });
  } catch (error) {
    console.error('❌ Error in ChatKit session handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
