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
echo "    Testing Sales Module Flow"
echo "========================================"

# 1. Login
echo -e "\n1. Logging in as Super Admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$SUPER_ADMIN_EMAIL\", \"password\": \"$SUPER_ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).access_token)")

if [ "$TOKEN" == "undefined" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to login.${NC}"
  exit 1
fi
echo -e "${GREEN}Login Successful.${NC}"

# 2. Create Payment Method
echo -e "\n2. Creating Payment Method (Cash)..."
PM_PAYLOAD='{ "name": "Efectivo" }'
PM_RESPONSE=$(curl -s -X POST "$API_URL/payment-methods" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PM_PAYLOAD")
PM_ID=$(echo $PM_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")
echo -e "${GREEN}Payment Method Created! ID: $PM_ID${NC}"

# 3. Create Terminal
echo -e "\n3. Creating Terminal (Caja 1)..."
TERM_PAYLOAD='{ "name": "Caja Principal" }'
TERM_RESPONSE=$(curl -s -X POST "$API_URL/terminals" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$TERM_PAYLOAD")
TERM_ID=$(echo $TERM_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")
echo -e "${GREEN}Terminal Created! ID: $TERM_ID${NC}"

# 4. Create Product (Needed for sale)
echo -e "\n4. Creating Product (Pizza)..."
PROD_PAYLOAD='{
  "type": "Pizza Sale Test",
  "category": "Pizzas",
  "price": 15.50,
  "isActive": true
}'
PROD_RESPONSE=$(curl -s -X POST "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PROD_PAYLOAD")
PROD_ID=$(echo $PROD_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")
echo -e "${GREEN}Product Created! ID: $PROD_ID${NC}"

# 5. Create Sale
echo -e "\n5. Creating Sale..."
SALE_PAYLOAD="{
  \"terminalId\": $TERM_ID,
  \"paymentMethodId\": $PM_ID,
  \"details\": [
    { \"productId\": \"$PROD_ID\", \"quantity\": 2 }
  ]
}"
# Expected Total: 15.50 * 2 = 31.00

SALE_RESPONSE=$(curl -s -X POST "$API_URL/sales" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$SALE_PAYLOAD")

SALE_ID=$(echo $SALE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).id)")
TOTAL=$(echo $SALE_RESPONSE | node -e "console.log(JSON.parse(fs.readFileSync(0)).total)")

if [ "$SALE_ID" == "undefined" ] || [ -z "$SALE_ID" ]; then
  echo -e "${RED}Failed to create sale. Response: $SALE_RESPONSE${NC}"
  exit 1
else
  echo -e "${GREEN}Sale Created! ID: $SALE_ID${NC}"
  echo -e "${GREEN}Total Amount: $TOTAL${NC}"
fi

# 6. Verify Sale Details
echo -e "\n6. Verifying Sale Details..."
GET_SALE=$(curl -s -X GET "$API_URL/sales/$SALE_ID" \
  -H "Authorization: Bearer $TOKEN")

# Simple check to see if details exist
DETAILS_COUNT=$(echo $GET_SALE | node -e "console.log(JSON.parse(fs.readFileSync(0)).details.length)")

if [ "$DETAILS_COUNT" -gt 0 ]; then
   echo -e "${GREEN}Verification Successful! Sale has $DETAILS_COUNT details.${NC}"
else
   echo -e "${RED}Verification Failed! No details found.${NC}"
fi

echo -e "\n========================================"
echo "    Test Completed"
echo "========================================"
