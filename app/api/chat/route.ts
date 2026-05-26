// app/api/chat/route.ts
import { siteConfig } from '../../../siteConfig';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = (process.env.DEEPSEEK_API_KEY || '').trim();
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "DEEPSEEK_API_KEY not set" }), { status: 500 });
    }

    const { modelId, systemPrompt, maxOutputTokens, temperature } = siteConfig.aiConfig;
    const authHeader = 'Bearer ' + apiKey;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: maxOutputTokens,
        temperature: temperature,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek error:", JSON.stringify(data));
      return new Response(JSON.stringify({
        error: 'API error: ' + response.status,
        details: data.error?.message || "unknown"
      }), { status: response.status });
    }

    const reply = data.choices?.[0]?.message?.content || "本喵现在不想理你喵...";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Chat route error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ status: "Ready", model: "DeepSeek" }), { status: 200 });
}
