#!/bin/bash
if git pull; then
    npm install
    npm run start
else
    npm run start
fi
# log_entry() {
#     local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
#     echo "$timestamp $1" >> "$LOG_FILE"
# }

# # Function to check internet connectivity
# check_internet() {
#     # Ping Google's DNS server
#     ping -c 1 8.8.8.8 &>/dev/null
#     if [ $? -eq 0 ]; then
#         return 0  # Internet connection exists
#     else
#         return 1  # No internet connection
#     fi
# }

# cd algo
# LOG_FILE="algo.log"
# exec > >(tee -a "$LOG_FILE") 2>&1
# if check_internet; then
#     git checkout start.sh
#     if git pull; then
#         echo "Git pull success."
#         sudo chmod 777 start.sh
#         npm install
#         if [$? -ne 0 ]; then
#             log_entry "npm install failed!"
#             npm run start
#         else 
#             log_entry "npm install success!"
#             npm run start
#         fi
#     else
#         log_entry "Git pull failed."
#         npm run start
#     fi
# else
#     log_entry "No internet, defaulting to start."
#    npm run start
# fi
