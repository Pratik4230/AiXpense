import { sendEmail } from "@/lib/email";
import { jobApplicationAdminEmail, jobApplicationCandidateEmail } from "@/lib/email/templates/jobApplication";
import { connectDB } from "@/lib/db";
import { JobApplication } from "@/models";

export async function notifyPaidJobApplication(applicationId: string) {
  await connectDB();
  const application = await JobApplication.findById(applicationId);
  if (!application || application.payment.status !== "paid") {
    return { candidateEmailSent: false, adminEmailSent: false };
  }

  const options = {
    applicationId: application.id,
    roleTitle: application.roleTitle,
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    location: application.location,
    experience: application.experience,
    resumeUrl: application.resumeUrl,
    githubUrl: application.githubUrl,
    amount: application.payment.amountInPaise / 100,
    paymentId: application.payment.paymentId ?? "confirmed",
    answers: application.answers,
  };

  let candidateEmailSent = Boolean(application.candidateNotifiedAt);
  let adminEmailSent = Boolean(application.adminNotifiedAt);

  if (!candidateEmailSent) {
    const candidateEmail = jobApplicationCandidateEmail(options);
    try {
      await sendEmail({ to: application.email, ...candidateEmail });
      await JobApplication.updateOne({ _id: application._id }, { $set: { candidateNotifiedAt: new Date() } });
      candidateEmailSent = true;
    } catch (error) {
      console.error("[job-application-candidate-email]", error);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmailSent && adminEmail) {
    const adminEmailContent = jobApplicationAdminEmail(options);
    try {
      await sendEmail({ to: adminEmail, ...adminEmailContent });
      await JobApplication.updateOne({ _id: application._id }, { $set: { adminNotifiedAt: new Date() } });
      adminEmailSent = true;
    } catch (error) {
      console.error("[job-application-admin-email]", error);
    }
  }

  return { candidateEmailSent, adminEmailSent };
}
