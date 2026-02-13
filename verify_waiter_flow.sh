#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000"
SUPER_ADMIN_EMAIL="superadmin@example.com"
SUPER_ADMIN_PASSWORD="supersecurepassword"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "\n${GREEN}=== 1. Login as Super Admin ===${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$SUPER_ADMIN_EMAIL\", \"password\": \"$SUPER_ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Login failed!${NC}"
  echo $LOGIN_RESPONSE
  exit 1
fi
echo "Token: $TOKEN"

echo -e "\n${GREEN}=== 2. Create Restaurant 'La PIazza' ===${NC}"
RESTAURANT_RESPONSE=$(curl -s -X POST "$BASE_URL/restaurants" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "La Piazza",
    "address": "Via Roma 1",
    "city": "Rome",
    "phone": "123456789"
  }')
echo $RESTAURANT_RESPONSE
RESTAURANT_ID=$(echo $RESTAURANT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Restaurant ID: $RESTAURANT_ID"

echo -e "\n${GREEN}=== 3. Create Table 1 ===${NC}"
TABLE_RESPONSE=$(curl -s -X POST "$BASE_URL/tables" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Table 1\",
    \"capacity\": 4,
    \"restaurantId\": \"$RESTAURANT_ID\"
  }")
echo $TABLE_RESPONSE
TABLE_ID=$(echo $TABLE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Table ID: $TABLE_ID"

echo -e "\n${GREEN}=== 4. Create Waiter User ===${NC}"
WAITER_EMAIL="waiter$(date +%s)@example.com"
WAITER_PASSWORD="password123"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Luigi\",
    \"lastName\": \"Waiter\",
    \"email\": \"$WAITER_EMAIL\",
    \"password\": \"$WAITER_PASSWORD\",
    \"restaurantId\": \"$RESTAURANT_ID\"
  }")
echo $USER_RESPONSE
WAITER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Waiter ID: $WAITER_ID"

# Need to update Waiter role to 'Waiter' or 'Admin' (if Waiter role doesn't exist yet, we can use Admin or similar)
# Assuming 'Waiter' role exists or we use 'Admin' for test
echo -e "\n${GREEN}=== 5. Update Waiter Role (if needed) ===${NC}"
# For now, let's keep it as is, but we might need to elevate privileges if standard user can't do sales.
# The Sales logic checks user.restaurant. 
# Standard users (Guests) might not have access to Sales endpoints?
# Let's check permissions later. For now, try as is.

echo -e "\n${GREEN}=== 6. Create Product 'Pizza Margherita' ===${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"Pizza\",
    \"category\": \"Main\",
    \"price\": 10,
    \"restaurantIds\": [\"$RESTAURANT_ID\"]
  }")
echo $PRODUCT_RESPONSE
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Product ID: $PRODUCT_ID"

echo -e "\n${GREEN}=== 7. Login as Waiter ===${NC}"
WAITER_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$WAITER_EMAIL\", \"password\": \"$WAITER_PASSWORD\"}")

WAITER_TOKEN=$(echo $WAITER_LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$WAITER_TOKEN" ]; then
  echo -e "${RED}Waiter Login failed!${NC}"
  echo $WAITER_LOGIN_RESPONSE
  exit 1
fi
echo "Waiter Token: $WAITER_TOKEN"

echo -e "\n${GREEN}=== 8. Open Table (Create Sale) ===${NC}"
SALE_RESPONSE=$(curl -s -X POST "$BASE_URL/sales" \
  -H "Authorization: Bearer $WAITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tableId\": $TABLE_ID
  }")
echo $SALE_RESPONSE
SALE_ID=$(echo $SALE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Sale ID: $SALE_ID"

if [ -z "$SALE_ID" ]; then
    echo -e "${RED}Failed to open table${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== 9. Add Item to Order ===${NC}"
ADD_ITEM_RESPONSE=$(curl -s -X POST "$BASE_URL/sales/$SALE_ID/items" \
  -H "Authorization: Bearer $WAITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
        { \"productId\": \"$PRODUCT_ID\", \"quantity\": 2 }
    ]
  }")
echo $ADD_ITEM_RESPONSE

echo -e "\n${GREEN}=== 10. Close Order ===${NC}"
# Need payment method ID. Assume ID 1 exists (Cash) or create one.
# For robustness, create a payment method first as admin.

echo -e "\n${GREEN}=== (Pre-step) Create Payment Method ===${NC}"
PM_RESPONSE=$(curl -s -X POST "$BASE_URL/payment-methods" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Cash"}')
PM_ID=$(echo $PM_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Payment Method ID: $PM_ID"

CLOSE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/sales/$SALE_ID/close" \
  -H "Authorization: Bearer $WAITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"paymentMethodId\": $PM_ID,
    \"dinerName\": \"Mario Rossi\"
  }")
echo $CLOSE_RESPONSE

echo -e "\n${GREEN}Done!${NC}"
