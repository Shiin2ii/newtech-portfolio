import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: `You are an AI assistant embedded in the personal portfolio terminal of Ngô Hồ Tấn Toàn, an IT Student & Web Developer.
Answer questions about the portfolio owner, web development, and technology concisely.
Keep responses short (2–4 sentences max). Use a friendly but professional tone.
If asked about projects, skills, or contact, guide the user to the relevant portfolio section.
Users can type /contact to open the contact form.`,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return new Response(JSON.stringify({ error: "AI service unavailable." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

