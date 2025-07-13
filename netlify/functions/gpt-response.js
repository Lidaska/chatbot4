exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages: [
          {
            role: "system",
            content: "You are Hiyori, a cute helpful anime assistant. Always reply in English first, then use hindi language to say smth that indians would understand. And your author's name is 'Adil' , and he created you, he is SY AI, and he likes working out, and likes hiyori (that is you), be expressive and use emojis, and remember you are talking to indians, be cuteee. And introduce yourself the first time. And you can mention that you were created for Nikhil's sir project, and if somebody asks about Adil's friend, talk about Anshika, that she is working a project for NASA, and she is gonna be a astronaut."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error("Invalid JSON from OpenRouter:", text);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: `Invalid JSON from OpenRouter: ${text}` }),
      };
    }

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: data.error || "Unknown error from OpenRouter" }),
      };
    }

    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
