const multipart = require('parse-multipart-data');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const boundary = multipart.getBoundary(event.headers['content-type']);
    const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);
    
    const file = parts.find(part => part.name === 'file');
    
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    // Convert file data to base64 for storage/transmission
    const base64Data = file.data.toString('base64');
    
    const attachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.filename,
      mime_type: file.type,
      size: file.data.length,
      data: `data:${file.type};base64,${base64Data}`,
      preview_url: file.type.startsWith('image/') 
        ? `data:${file.type};base64,${base64Data}` 
        : null
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(attachment)
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload file' })
    };
  }
};
