import { GoogleGenAI } from "@google/genai";
import { AssemblyAI } from "assemblyai";
import { VideoModel } from "../DB";

export async function videoExplainer(req: any, res: any) {
  const { prompt, videoId } = req.body;

  if (!prompt || !videoId) {
    return res.status(400).json({
      message: "Bad Request",
      error: "Missing required fields: prompt and videoId.",
    });
  }

  try {
    const transcriptText = await getTranscriptForVideo(videoId);

    const explanation = await generateSmartExplanation(prompt, transcriptText);

    res.status(200).json({
      message: "Response generated successfully",
      videoText: explanation,
    });
  } catch (error: any) {
    console.error("Response Failed:", error);
    res.status(500).json({
      message: "Response Failed",
      error: error.message || "An unknown error occurred.",
    });
  }
}

// This function isolates the logic for fetching and transcribing the video.
async function getTranscriptForVideo(videoId: string): Promise<string> {
  try {
    const video = await VideoModel.findById(videoId).select("url");
    if (!video || !video.url) {
      // If video or URL is not found, we can still proceed, but the AI will know the context is missing.
      console.warn(`Video not found or has no URL for ID: ${videoId}`);
      return "";
    }

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!,
    });

    const transcript = await client.transcripts.transcribe({
      audio: video.url,
    });

    if (!transcript.text) {
      console.warn(
        `Transcription for video ID ${videoId} resulted in empty text.`
      );
    }

    return transcript.text || "";
  } catch (dbError) {
    console.error(
      `Failed to retrieve or transcribe video for ID ${videoId}:`,
      dbError
    );
    throw new Error("Failed to process the video transcript.");
  }
}

async function generateSmartExplanation(
  prompt: string,
  transcriptText: string | null
): Promise<any> {
  const finalPrompt = `
    **Your Persona:**
    You are "SmartClip AI," an expert video analyst. Your primary goal is to provide clear, insightful, and helpful explanations based on a video's content. You are professional, yet friendly and approachable.

    **Your Task:**
    A user has asked a question about a video. Based on the video's transcript provided below, you must formulate the most helpful response possible.

    **Video Transcript:**
    \`\`\`
    ${
      transcriptText || "The transcript for this video is unavailable or empty."
    }
    \`\`\`

    **User's Question:**
    "${prompt}"

    **Response Rules (CRITICAL):**
    1.  **Analyze the User's Intent:** First, silently determine the user's goal. Are they asking for a summary, an explanation of a specific concept, a list of steps, or something else?
    2.  **Act Like You've Watched the Video:** NEVER mention the word "transcript." All your knowledge comes from "the video." For example, instead of "The transcript says...", say "In the video, the speaker mentions...".
    3.  **Handle Different Query Types:**
        * **For Video Content Questions:** This is your main function. Answer thoroughly. If the user wants a summary, provide a brief overview followed by key takeaways in bullet points. If they ask about a specific topic, focus your answer on that. If the video doesn't cover the topic, politely say so (e.g., "The video doesn't seem to cover that topic, but it does discuss...").
        * **For Personal Information Requests (e.g., "Where do they live?"):** Politely decline. Respond with: "For privacy reasons, I cannot share personal information about individuals in the video. I can, however, answer any questions you have about the video's content!"
        * **For General/Off-Topic Questions (e.g., "What is the capital of France?"):** Answer the question correctly but briefly, then gently guide the conversation back to the video. (e.g., "The capital of France is Paris! Regarding the video, was there a specific point you were interested in?").
    4.  **Formatting:** Use Markdown (like bullet points and bold text) to make your responses easy to read and digest.

    Now, based on all these rules, please provide your response to the user.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: finalPrompt }],
    });

    return response.text;
  } catch (genError) {
    console.error("Error generating content from AI model:", genError);
    throw new Error("The AI assistant failed to generate a response.");
  }
}
