#!/bin/bash

# Run npm start
echo "Running 'npm run start'..."
npm run start || {
    echo "Failed to start the application."
    exit 1
}