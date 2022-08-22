#!/usr/bin/env bash

################ USAGE ################
# Assumes you're already loggedin to the CLI
# ./surface/setEmailDeliverabilityAllEmail.sh.sh DEVa2beFeb DEVa2beFeb
################ USAGE ################

echo "Running setEmailDeliverabilityAllEmail.sh"
DEBUG_PATH="./runtimeResources/debugScreenshots"
USERNAME=$1
SANDBOX_NAME=$2
ENABLE_LOGS='Finest'#Finest
WORK_SPACE=$3

echo "SANDBOX_NAME: $SANDBOX_NAME"
SB_LOWER="$(echo "$SANDBOX_NAME" | tr '[:upper:]' '[:lower:]')" 
echo "SB_LOWER: $SB_LOWER"

echo "Running puppeteer"
rm -rf $DEBUG_PATH
yarn add puppeteer

echo "Get URL to Open Org"
OPEN_URL=$(echo `sfdx force:org:open -u $USERNAME -r`)
OPEN_URL="${OPEN_URL/URL: /,}"    
OPEN_URL=$(cut -d',' -f2 <<<"$OPEN_URL")

CMD_STR="None"
JOB_NAME=enableAllEmail

mkdir -p $DEBUG_PATH/$JOB_NAME
node $WORK_SPACE/sfdx-pipelines/utils/surface/setEmailDeliverabilityAllEmail.js $WORK_SPACE $JOB_NAME $ENABLE_LOGS $OPEN_URL $SANDBOX_NAME $CMD_STR;

echo "Process Completed Successfully"
exit 0;