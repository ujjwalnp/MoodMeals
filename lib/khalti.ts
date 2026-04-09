// Khalti configuration for sandbox testing

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "test_secret_key_fd47d734f1a24d7a9a2b8c9d1e2f3g4h";
const KHALTI_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://khalti.com/api/v2/" 
  : "https://dev.khalti.com/api/v2/";

// For sandbox testing, use the test secret key
// You can get this from: https://test-admin.khalti.com/
// Default test key: test_public_key_4b8a5e6d7f8g9h0i1j2k3l4m5n6o7p8q

export const khaltiConfig = {
  secretKey: KHALTI_SECRET_KEY,
  baseUrl: KHALTI_BASE_URL,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/khalti/verify`,
};

// Helper to convert NPR to Paisa (Khalti expects amount in paisa)
export const convertToPaisa = (amountInNpr: number): number => {
  return Math.round(amountInNpr * 100);
};

// Helper to convert Paisa to NPR
export const convertToNpr = (amountInPaisa: number): number => {
  return amountInPaisa / 100;
};

interface KhaltiInitiatePayload {
  return_url: string;
  website_url: string;
  amount: number; // in paisa
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Initiated" | "Refunded" | "Expired" | "User canceled";
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
}

// Initiate payment with Khalti
export async function initiateKhaltiPayment(
  payload: KhaltiInitiatePayload
): Promise<KhaltiInitiateResponse> {
  try {
    const response = await fetch(`${khaltiConfig.baseUrl}epayment/initiate/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${khaltiConfig.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to initiate payment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Khalti initiate error:", error);
    throw error;
  }
}

// Lookup payment status (for verification)
export async function lookupKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse> {
  try {
    const response = await fetch(`${khaltiConfig.baseUrl}epayment/lookup/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${khaltiConfig.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to lookup payment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Khalti lookup error:", error);
    throw error;
  }
}