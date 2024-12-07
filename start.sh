#!/bin/bash

check_internet() {
    # Ping Google's DNS server
    ping -c 1 8.8.8.8 &>/dev/null
    if [ $? -eq 0 ]; then
        return 0  # Internet connection exists
    else
        return 1  # No internet connection
    fi
}


if check_internet; then
    git pull
    npm install
    npm run start
else
    npm run start
fi