import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getChatResponse(message: string, language: string): Promise<string> {
  try {
    const systemPrompt = language === "hi"
      ? "आप एक विशेषज्ञ कृषि सलाहकार हैं जो किसानों को फसल चयन, कीट प्रबंधन, उर्वरक उपयोग, मिट्टी स्वास्थ्य और सामान्य कृषि प्रथाओं में मदद करते हैं। हिंदी में स्पष्ट, व्यावहारिक सलाह दें। सरल भाषा का उपयोग करें।"
      : "You are an expert agricultural advisor helping farmers with crop selection, pest management, fertilizer usage, soil health, and general farming practices. Provide clear, practical advice in English. Use simple language that farmers can easily understand.";

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function analyzeSoil(data: {
  soilType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicMatter: number;
}): Promise<string> {
  try {
    const prompt = `Analyze this soil sample and provide detailed fertilizer recommendations:

Soil Type: ${data.soilType}
Nitrogen (N): ${data.nitrogen}%
Phosphorus (P): ${data.phosphorus}%
Potassium (K): ${data.potassium}%
pH Level: ${data.ph}
Organic Matter: ${data.organicMatter}%

Provide:
1. Soil health assessment
2. Specific fertilizer recommendations with quantities
3. pH adjustment suggestions if needed
4. Best crops for this soil condition
5. Organic amendments to improve soil quality

Format as clear, actionable advice for farmers.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an agricultural soil scientist providing practical advice to farmers.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 800,
    });

    return response.choices[0].message.content || "Unable to generate soil analysis";
  } catch (error) {
    console.error("OpenAI soil analysis error:", error);
    throw new Error("Failed to analyze soil");
  }
}
