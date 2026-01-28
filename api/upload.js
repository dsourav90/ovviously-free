import formidable from 'formidable';

// Disable body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    
    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read file data
    const fs = await import('fs/promises');
    const fileData = await fs.readFile(file.filepath);
    
    // Convert file data to base64 for storage/transmission
    const base64Data = fileData.toString('base64');
    
    const attachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.originalFilename || file.newFilename,
      mime_type: file.mimetype,
      size: file.size,
      data: `data:${file.mimetype};base64,${base64Data}`,
      preview_url: file.mimetype.startsWith('image/') 
        ? `data:${file.mimetype};base64,${base64Data}` 
        : null
    };

    return res.status(200).json(attachment);
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}
