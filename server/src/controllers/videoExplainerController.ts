import { GoogleGenAI } from "@google/genai";
import { AssemblyAI } from "assemblyai";
import { VideoModel } from "../DB";
export async function videoExplainer(req: any, res: any) {
  const { prompt, videoId } = req.body;
  let transcriptText;
  try {

    const videoUrlResponse = await VideoModel.findById(videoId).select("url")
    console.log("Video Url",videoUrlResponse)

    const videoUrl = videoUrlResponse?.url;

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!,
    });

    const videoFile = videoUrl

    const params = {
      audio: videoFile!,
    };

      const transcript = await client.transcripts.transcribe(params);
      transcriptText = transcript.text

    const contents = [
      {
        text: `Here's a transcript of a video:\n\n"${transcriptText}"`,
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
