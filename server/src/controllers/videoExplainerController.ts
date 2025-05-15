import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import path from "path";
export async function videoExplainer(req: any, res: any) {
  const { prompt } = req.body;
  try {
    const filePath = path.resolve(__dirname, "../../uploads/clip1.mp4");
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    const base64VideoFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const contents = [
      {
        inlineData: {
          mimeType: "video/mp4",
          data: base64VideoFile,
        },
      },
      {
        text: `You are a helpful assistant. A user says:
“${prompt}”

First, decide which of these three they're asking:
  1. **VideoSpeaker Personal** : personal or private details about the person in the video (e.g. “What's their name?”, “Where do they live?”).
  2. **General Personal/Knowledge** : everyday chitchat or factual questions (e.g. “How are you?”, “What's the capital of India?”).
  3. **Other** : anything else.

If it's **VideoSpeaker Personal**, politely refuse:
  “I'm sorry, I can't share personal information about individuals.”

If it's **General Personal/Knowledge**, answer normally as a chat assistant.

Otherwise, answer the user's request directly.

Keep your responses big and ontopic.`,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    console.log(response.text);
    res.status(200).json({
      message: "Response generated successfully",
      videoText: response.text,
    });
  } catch (error) {
    console.error("Response Failed:", error);
    res.status(500).json({
      message: "Response Failed",
      error: error,
    });
  }
}
