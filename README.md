# 🗨️ Anonymous Chat App 🗨️

![Demo App](/frontend/public/screenshot-for-readme.png)

## Features

- 💬 **Anonymous Messaging**: Chat without registration or login
- 🌐 **Real-time Communication**: Instant messaging powered by Socket.io
- 🎨 **Modern UI**: Built with TailwindCSS and Daisy UI
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🚀 **Fast & Lightweight**: No authentication overhead
- 🔄 **Live User Count**: See how many people are currently chatting
- 🎭 **Random Usernames**: Automatically assigned fun usernames for each session
- 🌟 **Simple & Clean**: Focus on conversation, not complexity

## Tech Stack

- **Frontend**: React, TailwindCSS, Daisy UI
- **Backend**: Node.js, Express
- **Real-time**: Socket.io
- **State Management**: Zustand

## Quick Start

### Setup Environment

Create a `.env` file in the root directory:

```bash
PORT=5001
NODE_ENV=development
```

### Install Dependencies

```bash
npm install
```

### Build the App

```bash
npm run build
```

### Start the App

```bash
npm start
```

Visit `http://localhost:5001` and start chatting anonymously!

## How It Works

1. **No Registration Required**: Simply visit the app and start chatting
2. **Auto-Generated Names**: Each user gets a random username for the session
3. **Real-time Updates**: Messages appear instantly for all connected users
4. **Session-Based**: Your identity lasts only for the current browser session

Perfect for quick conversations, temporary discussions, or when you want to chat without the hassle of creating accounts!