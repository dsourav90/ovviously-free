import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

// Configure Neon for serverless environment
neonConfig.fetchConnectionCache = true;

// Lazy initialization of Prisma
let prisma;

function getPrismaClient() {
  if (prisma) return prisma;

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Initializing Prisma with DATABASE_URL');

  // PrismaNeonHttp takes the connection string directly
  const adapter = new PrismaNeonHttp(databaseUrl);

  // Initialize Prisma Client with the adapter
  prisma = new PrismaClient({ adapter });
  
  console.log('Prisma client initialized with neon HTTP adapter');
  
  return prisma;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Request:', req.method, req.url);
    console.log('Query params:', req.query);

    // Initialize Prisma client
    const prisma = getPrismaClient();

    const { deviceId } = req.query;
    
    if (!deviceId) {
      console.error('No deviceId provided');
      return res.status(400).json({ error: 'deviceId is required' });
    }

    console.log('Looking for user with deviceId:', deviceId);

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { deviceId }
    });

    if (!user) {
      console.log('User not found, creating new user');
      user = await prisma.user.create({
        data: { deviceId }
      });
      console.log('Created user:', user.id);
    } else {
      console.log('Found user:', user.id);
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // Get all documents for user
        const documents = await prisma.document.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(documents);
      }

      case 'POST': {
        // Create new document
        const createData = req.body;
        console.log('Creating document:', createData);
        const newDocument = await prisma.document.create({
          data: {
            ...createData,
            userId: user.id
          }
        });
        console.log('Document created:', newDocument.id);
        return res.status(201).json(newDocument);
      }

      case 'PUT': {
        // Update document
        const updateData = req.body;
        const { id, ...updates } = updateData;
        const updatedDocument = await prisma.document.update({
          where: { id },
          data: updates
        });
        return res.status(200).json(updatedDocument);
      }

      case 'DELETE': {
        // Delete document
        const { id: deleteId } = req.body;
        await prisma.document.delete({
          where: { id: deleteId }
        });
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in handler:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: error.message,
      details: error.toString()
    });
  }
}
