# Chatbase UI - React Application with OpenAI Agent Builder

A modern, modular chat interface built with React and integrated with OpenAI's API to create and manage AI agents.

## Features

- **AI Agent Builder**: Create custom AI agents with configurable personalities and behaviors
- **Multiple Agent Support**: Switch between different specialized agents
- **OpenAI Integration**: Real-time chat powered by GPT-4 and GPT-3.5
- **Modular Component Architecture**: Clean, reusable components
- **Persistent Agent Storage**: Agents saved in localStorage
- **Responsive Design**: Works seamlessly on different screen sizes
- **Modern UI**: Beautiful gradient input with smooth animations
- **SCSS Styling**: Enhanced styling with variables and nesting

## Project Structure

```
chatbase/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AgentBuilder/      # Agent configuration modal
│   │   ├── AgentCard/          # Agent display cards
│   │   ├── ChatContainer/      # Main chat area
│   │   ├── ChatInput/          # Message input component
│   │   ├── ChatMessage/        # Message display component
│   │   ├── Footer/             # Footer component
│   │   ├── Logo/               # Logo SVG component
│   │   ├── NewChatButton/      # New chat button
│   │   └── Sidebar/            # Sidebar with agents list
│   ├── services/
│   │   ├── agentStore.js       # Agent management & storage
│   │   └── openaiService.js    # OpenAI API integration
│   ├── App.js
│   ├── App.scss
│   ├── index.js
│   └── index.scss
├── .env.example
├── package.json
└── README.md
```
│   │   │   ├── Logo.js
│   │   │   └── Logo.css
│   │   ├── NewChatButton/
│   │   │   ├── NewChatButton.js
│   │   │   └── NewChatButton.css
│   │   └── Sidebar/
│   │       ├── Sidebar.js
│   │       └── Sidebar.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Add your OpenAI API key to the `.env` file:
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

### Testing

```bash
npm test
```

Runs the test suite with React Testing Library.

## Using the Agent Builder

### Creating a New Agent

1. Click the "+" button in the sidebar under "Agents"
2. Configure your agent:
   - **Icon**: Choose an emoji to represent your agent
### ChatInput
- Gradient-styled input field
- Emoji button and send button
- Auto-expanding textarea
- Enter to send (Shift+Enter for new line)
- Disabled state during message sending

### Services

#### openaiService.js
- OpenAI API client wrapper
- Message sending
- Streaming support (for future use)
- Error handling

#### agentStore.js
- Agent CRUD operations
- localStorage persistence
- Default agents management

## API Configuration

### Important Security Note

The current implementation uses `dangerouslyAllowBrowser: true` for demonstration purposes. **For production use**, you should:

1. Create a backend proxy server
2. Store your API key securely on the server
3. Make API calls from your backend
4. Remove the `dangerouslyAllowBrowser` flag

## Customization

You can easily customize:
- Default agents in `src/services/agentStore.js`
- UI colors and styles in SCSS files
- Available models in `AgentBuilder.js`
- **Edit**: Click the ✏️ button on any custom agent
- **Delete**: Click the 🗑️ button on any custom agent
- **Switch**: Click any agent card to start chatting with it

## Component Overview

### App.js
Main application orchestrator handling agent selection and modal state

### Sidebar
- Agent list display
- Agent selection
- Create/Edit/Delete agent actions
- "New chat" functionality

### ChatContainer
- Displays chat messages
- Handles message sending
- Shows typing indicators
- Integrates with OpenAI service

### AgentBuilder
- Form-based agent configuration
- Validation
- Create/Edit modes
- Available models in `AgentBuilder.js`
- Logo in `Logo.js`
- System prompts and behavior

## Technologies

- React 18.2.0
- OpenAI SDK 6.14.0
- Axios 1.13.2
- Sass/SCSS
- React Testing Library
- Modern ES6+ JavaScript

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions, please refer to:
- OpenAI API Documentation: https://platform.openai.com/docs
- React Documentation: https://react.devranding

### Footer
- "Powered by Chatbase" attribution
- Positioned at the bottom of the chat area

## Customization

You can easily customize:
- Colors in the CSS files
- Logo in `Logo.js`
- Layout dimensions
- Component behavior

## Technologies

- React 18.2.0
- CSS3 with Flexbox
- SVG icons
- Modern ES6+ JavaScript
