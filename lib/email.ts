import "server-only";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@optionflow.com.au";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const FOOTER = `<p style="color:#9ca3af;font-size:12px;margin-top:32px;">OptionFlow · ${process.env.PLATFORM_ABN ?? ""} · This email does not constitute legal advice.</p>`;

type EmailTemplate =
  | "WELCOME"
  | "PROPERTY_SUBMITTED"
  | "PROPERTY_APPROVED"
  | "PROPERTY_REJECTED"
  | "DEED_SENT"
  | "DEED_SIGNED"
  | "OPTION_EXPIRY_WARNING"
  | "OFFER_RECEIVED"
  | "OFFER_ACCEPTED"
  | "OFFER_REJECTED"
  | "PAYMENT_RECEIVED";

async function logEmail(to: string, template: EmailTemplate, subject: string, messageId?: string) {
  await prisma.emailLog.create({
    data: { to, subject, templateId: template, resendId: messageId, status: messageId ? "sent" : "failed" },
  }).catch(() => {});
}

async function send(to: string, subject: string, html: string, template: EmailTemplate) {
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
  await logEmail(to, template, subject, data?.id);
  if (error) console.error("[email] send failed", error);
}

function wrap(content: string) {
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111827">${content}${FOOTER}</div>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await send(to, "Welcome to OptionFlow", wrap(`
    <h2>Welcome${name ? `, ${name}` : ""}!</h2>
    <p>Your OptionFlow account is ready. You can now submit properties or browse the marketplace.</p>
    <a href="${APP_URL}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">Get started</a>
  `), "WELCOME");
}

export async function sendPropertySubmittedEmail(to: string, address: string) {
  await send(to, "Property submission received", wrap(`
    <h2>We've received your submission</h2>
    <p>Thanks for submitting <strong>${address}</strong>. Our team will review it within 2–3 business days and let you know the outcome.</p>
    <a href="${APP_URL}/homeowner/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View dashboard</a>
  `), "PROPERTY_SUBMITTED");
}

export async function sendPropertyApprovedEmail(to: string, address: string, adminNotes?: string) {
  await send(to, `Your property has been approved — ${address}`, wrap(`
    <h2>Great news — your property has been approved!</h2>
    <p>We're moving forward with <strong>${address}</strong>. Our team will be in touch shortly to arrange the option deed.</p>
    ${adminNotes ? `<p style="background:#f3f4f6;padding:12px;border-radius:6px;"><strong>Admin notes:</strong> ${adminNotes}</p>` : ""}
    <a href="${APP_URL}/homeowner/dashboard" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View dashboard</a>
  `), "PROPERTY_APPROVED");
}

export async function sendPropertyRejectedEmail(to: string, address: string, reason: string) {
  await send(to, `Property submission update — ${address}`, wrap(`
    <h2>Submission update</h2>
    <p>After review, we're unable to proceed with <strong>${address}</strong> at this time.</p>
    <p style="background:#fef2f2;padding:12px;border-radius:6px;"><strong>Reason:</strong> ${reason}</p>
    <p>If you have other properties or questions, feel free to get in touch.</p>
  `), "PROPERTY_REJECTED");
}

export async function sendDeedSentEmail(to: string, address: string, deedType: "option" | "assignment") {
  const label = deedType === "option" ? "Option deed" : "Assignment deed";
  await send(to, `${label} ready for signing — ${address}`, wrap(`
    <h2>${label} sent for signing</h2>
    <p>The ${label.toLowerCase()} for <strong>${address}</strong> has been sent to you via DocuSign. Please check your email for the signing request.</p>
    <a href="${APP_URL}/homeowner/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View dashboard</a>
  `), "DEED_SENT");
}

export async function sendDeedSignedEmail(to: string, address: string, deedType: "option" | "assignment") {
  const label = deedType === "option" ? "Option deed" : "Assignment deed";
  await send(to, `${label} signed — ${address}`, wrap(`
    <h2>${label} fully executed</h2>
    <p>All parties have signed the ${label.toLowerCase()} for <strong>${address}</strong>. A copy will be available in your portal.</p>
    <a href="${APP_URL}/homeowner/dashboard" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View signed deed</a>
  `), "DEED_SIGNED");
}

export async function sendExpiryWarningEmail(to: string, address: string, daysUntilExpiry: number) {
  await send(to, `Option deed expiring in ${daysUntilExpiry} days — ${address}`, wrap(`
    <h2>Option deed expiry reminder</h2>
    <p>The option deed for <strong>${address}</strong> expires in <strong>${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}</strong>.</p>
    <p>Please contact us if you wish to discuss an extension.</p>
    <a href="${APP_URL}/homeowner/dashboard" style="display:inline-block;background:#d97706;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View property</a>
  `), "OPTION_EXPIRY_WARNING");
}

export async function sendOfferReceivedEmail(to: string, address: string, offerAmount: string) {
  await send(to, `New offer received — ${address}`, wrap(`
    <h2>New developer offer</h2>
    <p>A developer has submitted an offer of <strong>${offerAmount}</strong> on <strong>${address}</strong>.</p>
    <a href="${APP_URL}/admin/properties" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">Review offer</a>
  `), "OFFER_RECEIVED");
}

export async function sendOfferAcceptedEmail(to: string, address: string) {
  await send(to, `Your offer has been accepted — ${address}`, wrap(`
    <h2>Offer accepted!</h2>
    <p>Your offer on <strong>${address}</strong> has been accepted. Our team will be in touch to finalise the assignment deed and deposit.</p>
    <a href="${APP_URL}/developer/offers" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px;">View your offers</a>
  `), "OFFER_ACCEPTED");
}

export async function sendPaymentReceivedEmail(to: string, description: string, amount: string) {
  await send(to, `Payment received — ${description}`, wrap(`
    <h2>Payment confirmed</h2>
    <p>We've received your payment of <strong>${amount}</strong> for <strong>${description}</strong>.</p>
    <p>A receipt will be available in your portal.</p>
  `), "PAYMENT_RECEIVED");
}
