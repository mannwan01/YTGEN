export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { script } = req.body;

    // 🔥 TEST MODE (dummy output)
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        sets: [
          {
            title: "5 Powerful Habits That Will Change Your Life",
            description:
              "Discover 5 powerful habits that can transform your life and mindset.\n\n#motivation #success #habits",
          },
        ],
      });
    }

    // 🚀 REAL AI MODE (jab API key add hogi)
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
      })
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({
      sets: [
        {
          title: text,
          description: text,
        },
      ],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}