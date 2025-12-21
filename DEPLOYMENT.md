# Chatbase - Netlify Deployment Guide

## Deploy to Netlify (Free)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Click "Deploy site"

### 3. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_CHATKIT_WORKFLOW_ID=your_workflow_id_here
```

### 4. Redeploy

After adding environment variables, trigger a new deployment:
- Go to Deploys tab → "Trigger deploy" → "Clear cache and deploy site"

## Embed as iframe

Once deployed, use your Netlify URL in an iframe:

```html
<!-- Standard embed -->
<iframe 
  src="https://your-site-name.netlify.app" 
  width="400" 
  height="600"
  frameborder="0"
  allow="microphone; camera"
></iframe>

<!-- Full-screen embed -->
<iframe 
  src="https://your-site-name.netlify.app?iframe=true" 
  width="100%" 
  height="100vh"
  frameborder="0"
  allow="microphone; camera"
  style="border: none;"
></iframe>
```

## Features

✅ Free hosting on Netlify  
✅ Serverless functions for backend  
✅ Iframe-friendly headers  
✅ File upload support  
✅ ChatKit integration  

## Local Development

```bash
npm install
npm run dev
```

Backend: http://localhost:3001  
Frontend: http://localhost:3000
