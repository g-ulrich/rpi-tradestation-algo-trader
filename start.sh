#!/bin/bash

# Function to prepend datetime to log entries
log_entry() {
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "$timestamp $1" >> "$LOG_FILE"
}

# Set up logging
LOG_FILE="/algo/algo.log"
exec > >(tee -a "$LOG_FILE") 2>&1

# Change to the algo directory
cd algo || { log_entry "Failed to change to algo directory"; exit 1; }

# Git pull
if ! git pull; then
    log_entry "Git pull failed. Attempting to stash and retry."
    git stash
    if ! git pull; then
        log_entry "Second git pull failed. Exiting."
        exit 1
    fi
fi

# Check if any changes were pulled
if git status --porcelain | grep -q '^M'; then
    log_entry "Changes detected after git pull. Installing dependencies..."
    npm install
else
    log_entry "No changes detected after git pull. Skipping npm install."
fi

log_entry "Starting application..."
npm run start