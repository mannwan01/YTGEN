export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST allowed" }),
      { status: 405 }
    );
  }

  try {
    const { script } = await req.json();

    // 🔥 TEST MODE
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          sets: [
            {
              title: "🔥 AI Generated Title",
              description: "Backend connected successfully 🚀",
            },
          ],
        }),
        { status: 200 }
      );
    }

    // 🚀 REAL AI MODE
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a YouTube growth expert. Generate high CTR title and SEO description.",
          },
          {
            role: "user",
            content: script,
          },
        ],
      }),
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({
        sets: [
          {
            title: text,
            description: text,
          },
        ],
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}