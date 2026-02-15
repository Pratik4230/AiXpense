import Razorpay from "razorpay";
import { RAZORPAY_PLANS } from "@/lib/razorpay/plans";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function createSubscriptionPlans() {
  console.log("🚀 Creating Razorpay subscription plans...\n");

  try {
    const monthlyPlan = await razorpay.plans.create({
      period: RAZORPAY_PLANS.monthly.period,
      interval: RAZORPAY_PLANS.monthly.interval,
      item: {
        name: RAZORPAY_PLANS.monthly.name,
        amount: RAZORPAY_PLANS.monthly.amount,
        currency: RAZORPAY_PLANS.monthly.currency,
      },
    });

    console.log("✅ Monthly Plan Created:");
    console.log(`   Name: ${RAZORPAY_PLANS.monthly.name}`);
    console.log(`   Amount: ₹${RAZORPAY_PLANS.monthly.amount / 100}`);
    console.log(`   Plan ID: ${monthlyPlan.id}\n`);

    const yearlyPlan = await razorpay.plans.create({
      period: RAZORPAY_PLANS.yearly.period,
      interval: RAZORPAY_PLANS.yearly.interval,
      item: {
        name: RAZORPAY_PLANS.yearly.name,
        amount: RAZORPAY_PLANS.yearly.amount,
        currency: RAZORPAY_PLANS.yearly.currency,
      },
    });

    console.log("✅ Yearly Plan Created:");
    console.log(`   Name: ${RAZORPAY_PLANS.yearly.name}`);
    console.log(`   Amount: ₹${RAZORPAY_PLANS.yearly.amount / 100}`);
    console.log(`   Plan ID: ${yearlyPlan.id}\n`);

    console.log("📋 Add these to your .env file:\n");
    console.log(`RAZORPAY_PLAN_ID_MONTHLY=${monthlyPlan.id}`);
    console.log(`RAZORPAY_PLAN_ID_YEARLY=${yearlyPlan.id}\n`);

    console.log("✨ Done! Plans created successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error creating plans:", error.message);
    } else {
      console.error("❌ Error creating plans:", error);
    }
    process.exit(1);
  }
}

createSubscriptionPlans()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
