import { razorpay } from "./client";
import { db } from "@/lib/db";

interface RazorpayCustomer {
  id: string;
  name: string;
  email: string;
}

export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name: string,
): Promise<RazorpayCustomer> {
  console.log("[Get/Create Customer] Called with:", { userId, email, name });

  const user = await db.collection("user").findOne({ id: userId });
  console.log("[Get/Create Customer] User from DB:", {
    found: !!user,
    hasRazorpayId: !!user?.razorpayCustomerId,
    razorpayCustomerId: user?.razorpayCustomerId,
  });

  if (user?.razorpayCustomerId) {
    console.log(
      "[Get/Create Customer] Returning existing customer:",
      user.razorpayCustomerId,
    );
    return {
      id: user.razorpayCustomerId,
      name,
      email,
    };
  }

  console.log("[Get/Create Customer] Creating new customer in Razorpay...");
  console.log("[Get/Create Customer] Parameters:", {
    name,
    email,
    fail_existing: 0,
  });

  try {
    const customerResponse = await razorpay.customers.create({
      name,
      email,
      fail_existing: 0,
    });

    const customer = customerResponse as { id: string };
    console.log(
      "[Get/Create Customer] Razorpay customer created:",
      customer.id,
    );

    await db
      .collection("user")
      .updateOne({ id: userId }, { $set: { razorpayCustomerId: customer.id } });

    console.log("[Get/Create Customer] Saved customer ID to database");

    return {
      id: customer.id,
      name,
      email,
    };
  } catch (error) {
    console.error("[Get/Create Customer] Razorpay error:", error);
    console.error(
      "[Get/Create Customer] Error details:",
      JSON.stringify(error, null, 2),
    );
    throw error;
  }
}
