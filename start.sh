#!/bin/bash
log_entry() {
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "$timestamp $1" >> "$LOG_FILE"
}

# Function to check internet connectivity
check_internet() {
    # Ping Google's DNS server
    ping -c 1 8.8.8.8 &>/dev/null
    if [ $? -eq 0 ]; then
        return 0  # Internet connection exists
    else
        return 1  # No internet connection
    fi
}


cd algo
LOG_FILE="algo.log"
exec > >(tee -a "$LOG_FILE") 2>&1
if check_internet; then
    git pull
    if [$? -ne 0 ]; then
        log_entry "Git pull success."
        npm install
        if [$? -ne 0 ]; then
            log_entry "npm install success!"
            npm run start
        else 
            log_entry "npm install failed!"
            npm run start
        fi
    else
        log_entry "Git pull not success."
        npm run start
    fi
else
    log_entry "No internet, defaulting to start.+"
   npm run start
fi

# # Function to prepend datetime to log entries
# log_entry() {
#     local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
#     echo "$timestamp $1" >> "$LOG_FILE"
# }

# # Change to the algo directory
# cd algo
# # Set up logging
# LOG_FILE="algo.log"
# exec > >(tee -a "$LOG_FILE") 2>&1

# # Git pull
# if ! git pull; then
#     log_entry "Git pull failed. Attempting to stash and retry."
#     git stash
#     if ! git pull; then
#         log_entry "Second git pull failed. Exiting."
#         exit 1
#     fi
# fi

# # Check if any changes were pulled
# if git status --porcelain | grep -q '^M'; then
#     log_entry "Changes detected after git pull. Installing dependencies..."
#     npm install
# else
#     log_entry "No changes detected after git pull. Skipping npm install."
# fi

# log_entry "Starting application..."
# npm run start