#!/bin/bash

# Deployment script for KrishiSaarthi
echo "🌾 Starting KrishiSaarthi deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please run: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Please login to Firebase: firebase login"
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Your app is now live at: https://$(firebase projects:list | grep -o '\S*\.web\.app')"
else
    echo "❌ Deployment failed. Please check the logs."
    exit 1
fi
