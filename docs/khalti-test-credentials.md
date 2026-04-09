# Khalti Sandbox Test Credentials

## Test Merchant Account
- URL: https://test-admin.khalti.com/
- Login OTP: 987654

## Test Customer Credentials
- Khalti ID: 9800000000 (or 9800000001, 9800000002, 9800000003, 9800000004, 9800000005)
- MPIN: 1111
- OTP: 987654

## Test Secret Key
- For sandbox: `test_secret_key_fd47d734f1a24d7a9a2b8c9d1e2f3g4h`
- Get your own from: https://test-admin.khalti.com/ (Settings → API Keys)

## Test Payment Flow
1. Select Khalti as payment method
2. Click "Place Order"
3. Redirected to Khalti payment page
4. Enter test Khalti ID: 9800000000
5. Enter MPIN: 1111
6. Enter OTP: 987654
7. Payment success!

## Important Notes
- Amount must be at least Rs. 10 (1000 paisa)
- Payment link expires in 60 minutes
- Always verify payment using lookup API
- Only "Completed" status is success