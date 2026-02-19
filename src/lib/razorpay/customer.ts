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
  const user = await db.collection("user").findOne({ id: userId });

  if (user?.razorpayCustomerId) {
    return { id: user.razorpayCustomerId, name, email };
  }

  try {
    const customerResponse = await razorpay.customers.create({
      name,
      email,
      fail_existing: 0,
    });

    const customer = customerResponse as { id: string };

    await db
      .collection("user")
      .updateOne({ id: userId }, { $set: { razorpayCustomerId: customer.id } });

    return { id: customer.id, name, email };
  } catch (error) {
    console.error("[Razorpay] Failed to create customer:", error);
    throw error;
  }
}
