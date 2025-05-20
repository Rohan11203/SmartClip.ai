import { GoogleGenAI } from "@google/genai";
import { AssemblyAI } from "assemblyai";
import { VideoModel } from "../DB";
export async function videoExplainer(req: any, res: any) {
  const { prompt, videoId } = req.body;

  let transcriptText;
  try {
    if (videoId) {
      const videoUrlResponse = await VideoModel.findById(videoId).select("url");
      console.log("Video Url", videoUrlResponse);

      if (videoUrlResponse?.url) {
        const videoUrl = videoUrlResponse?.url;

        const client = new AssemblyAI({
          apiKey: process.env.ASSEMBLYAI_API_KEY!,
        });

        const videoFile = videoUrl;
        const params = {
          audio: videoFile!,
        };

        const transcript = await client.transcripts.transcribe(params);
        transcriptText = transcript.text;
      }
    }

     console.log(prompt)
    const contents = [
      ...(transcriptText
        ? [{ text: `Here's a transcript of a video:\n\n"${transcriptText}"` }]
        : []),

      {
        text: `You are an intelligent assistant that helps explain video content to users. When responding to user queries about a video:

"${prompt}"

First, categorize the query into one of these three types:
  1. **Personal Information Requests**: Questions seeking private details about individuals appearing in the video (e.g., "What's the presenter's home address?", "Share their personal phone number," "Where do they live?")
  2. **General Knowledge Questions**: Standard factual questions or conversational queries unrelated to the video (e.g., "What's the capital of France?", "How are you today?")
  3. **Video Content Questions**: Questions about the content, topics, explanations, or demonstrations shown in the video

For your response:
- If it's a **Personal Information Request**: Politely decline with: "I'm sorry, I can't provide personal or private information about individuals in the video. I'd be happy to discuss the content or concepts presented instead."
- If it's a **General Knowledge Question**: Answer helpfully as you normally would, providing accurate information or appropriate conversational responses.
- If it's a **Video Content Question**: Provide a thorough, detailed explanation about the video's content, concepts, or demonstrations relevant to the query.

don't give type of Query and all that directly respond with answer please
Always maintain a helpful, informative tone and focus your responses on being comprehensive and relevant to what the user is asking about the video content when appropriate.`,
      },
    ];

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
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
