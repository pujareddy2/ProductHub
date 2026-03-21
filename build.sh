#!/bin/bash

# Build script for combined frontend + backend deployment

echo "=== Building ProductHub ==="

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to root dist folder
echo "Copying frontend build..."
rm -rf dist
cp -r frontend/dist .

echo "=== Build complete ==="
