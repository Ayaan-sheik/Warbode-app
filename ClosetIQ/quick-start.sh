#!/bin/bash

echo "🚀 ClosetIQ Quick Start Script"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your Firebase credentials"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎯 Setup complete! You can now:"
echo "  1. Edit .env with your Firebase config (or use demo mode)"
echo "  2. Run 'npm start' to start the development server"
echo "  3. Scan the QR code with Expo Go app"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
echo "Happy hacking! 🎉"
