#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
EMAIL="superadmin@fiumicello.com"
PASSWORD="SuperSecretPassword123!"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "    Testing Product CRUD & Soft Delete"
echo "========================================"

# 1. Login
echo -e "\n1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

# Extract Token
TOKEN=$(echo $LOGIN_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).access_token)")

if [ "$TOKEN" == "undefined" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to login. Response: $LOGIN_RESPONSE${NC}"
  exit 1
fi
echo -e "${GREEN}Login Successful! Token obtained.${NC}"

# 2. Create Product
echo -e "\n2. Creating Product..."
PRODUCT_PAYLOAD='{
  "type": "Pizza Test",
  "category": "Pizzas",
  "description": "Pizza for soft delete test",
  "price": 10.00,
  "isActive": true,
  "images": []
}'

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PRODUCT_PAYLOAD")

PRODUCT_ID=$(echo $CREATE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")

if [ "$PRODUCT_ID" == "undefined" ] || [ -z "$PRODUCT_ID" ]; then
  echo -e "${RED}Failed to create product. Response: $CREATE_RESPONSE${NC}"
  exit 1
else
  echo -e "${GREEN}Product Created! ID: $PRODUCT_ID${NC}"
fi

# 3. "Soft Delete" (Update isActive to false)
echo -e "\n3. Soft Deleting Product (isActive = false)..."
UPDATE_PAYLOAD='{
  "isActive": false
}'

UPDATE_RESPONSE=$(curl -s -X PATCH "$API_URL/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

IS_ACTIVE=$(echo $UPDATE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).isActive)")

if [ "$IS_ACTIVE" == "false" ]; then
  echo -e "${GREEN}Product Soft Deleted Successfully (isActive: false)${NC}"
else
  echo -e "${RED}Failed to soft delete. Response: $UPDATE_RESPONSE${NC}"
fi

echo -e "\n========================================"
echo "    Test Completed"
echo "========================================"
