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
        text: `take this prompt ${prompt} provided by user and give them what they need`,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    console.log(response.text);
    res.status(200).json({
      message: "Response generated successfully",
      video: response.text,
    });
  } catch (error) {
    console.error("Response Failed:", error);
    res.status(500).json({
      message: "Response Failed",
      error: error,
    });
  }
}
