"use server";

import { db } from "@/db";
import { contact_messages } from "@/db/schema";

type ContactState = {
  success: boolean;
  error?: string;
};

export async function submitContact(
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  if (!name || name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, error: "Invalid email address." };
  }

  if (!message || message.length < 10) {
    return {
      success: false,
      error: "Message must be at least 10 characters.",
    };
  }

  // Enforce length limits
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return { success: false, error: "Input exceeds maximum length." };
  }

  try {
    await db.insert(contact_messages).values({ name, email, message });
    return { success: true };
  } catch (err) {
    console.error("Failed to insert contact message:", err);
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }
}
