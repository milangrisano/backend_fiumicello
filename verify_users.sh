#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
SUPER_ADMIN_EMAIL="superadmin@fiumicello.com"
SUPER_ADMIN_PASSWORD="SuperSecretPassword123!"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "    Testing User CRUD & Soft Delete"
echo "========================================"

# 1. Login as Super Admin
echo -e "\n1. Logging in as Super Admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$SUPER_ADMIN_EMAIL\", \"password\": \"$SUPER_ADMIN_PASSWORD\"}")

# Extract Token
TOKEN=$(echo $LOGIN_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).access_token)")

if [ "$TOKEN" == "undefined" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to login. Response: $LOGIN_RESPONSE${NC}"
  exit 1
fi
echo -e "${GREEN}Login Successful! Token obtained.${NC}"

# 2. Create User
echo -e "\n2. Creating New User..."
TIMESTAMP=$(date +%s)
USER_EMAIL="testuser_${TIMESTAMP}@example.com"
USER_PAYLOAD="{
  \"firstName\": \"Test\",
  \"lastName\": \"User\",
  \"email\": \"$USER_EMAIL\",
  \"password\": \"TestPassword123!\",
  \"isActive\": true
}"

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$USER_PAYLOAD")

USER_ID=$(echo $CREATE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")

if [ "$USER_ID" == "undefined" ] || [ -z "$USER_ID" ]; then
  echo -e "${RED}Failed to create user. Response: $CREATE_RESPONSE${NC}"
  exit 1
else
  echo -e "${GREEN}User Created! ID: $USER_ID${NC}"
fi

# 3. Soft Delete (Deactivate User)
echo -e "\n3. Soft Deleting User (isActive = false)..."
UPDATE_PAYLOAD='{
  "isActive": false
}'

UPDATE_RESPONSE=$(curl -s -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

IS_ACTIVE=$(echo $UPDATE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).isActive)")

if [ "$IS_ACTIVE" == "false" ]; then
  echo -e "${GREEN}User Soft Deleted Successfully (isActive: false)${NC}"
else
  echo -e "${RED}Failed to soft delete. Response: $UPDATE_RESPONSE${NC}"
fi

# 4. Reactivate User
echo -e "\n4. Reactivating User (isActive = true)..."
ACTIVATE_PAYLOAD='{
  "isActive": true
}'

ACTIVATE_RESPONSE=$(curl -s -X PATCH "$API_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$ACTIVATE_PAYLOAD")

IS_ACTIVE_AGAIN=$(echo $ACTIVATE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).isActive)")

if [ "$IS_ACTIVE_AGAIN" == "true" ]; then
  echo -e "${GREEN}User Reactivated Successfully (isActive: true)${NC}"
else
  echo -e "${RED}Failed to reactivate. Response: $ACTIVATE_RESPONSE${NC}"
fi


echo -e "\n========================================"
echo "    Test Completed"
echo "========================================"
