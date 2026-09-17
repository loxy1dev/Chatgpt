import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const allowedModels = new Set(["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol"]);

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response("OPENAI_API_KEY n'est pas configurée.", { status: 500 });
    }

    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return new Response("Messages invalides.", { status: 400 });
    }

    const model = allowedModels.has(body.model)
      ? body.model
      : process.env.OPENAI_MODEL || "gpt-5.6-luna";

    const stream = await openai.responses.create({
      model,
      input: messages.map((message: { role: "user" | "assistant"; content: string }) => ({
        role: message.role,
        content: message.content
      })),
      stream: true
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
              controller.enqueue(encoder.encode(event.delta));
            }
          }
          controller.close();
        } catch (error) {
          console.error(error);
          controller.error(error);
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error(error);
    return new Response("Erreur lors de la communication avec OpenAI.", { status: 500 });
  }
}