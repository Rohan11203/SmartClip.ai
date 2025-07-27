import { GoogleGenAI } from "@google/genai";
import { AssemblyAI } from "assemblyai";
import { VideoModel } from "../DB";

export async function videoExplainer(req: any, res: any) {
  const { prompt, videoUrl } = req.body;

  if (!prompt) {
    return res.status(400).json({
      message: "Bad Request",
      error: "Missing required field: prompt.",
    });
  }

  try {
    let transcriptText: string | null = null;
    
    if (videoUrl) {
      transcriptText = await getTranscriptForVideo(videoUrl);
    }

    // The function now intelligently handles requests with or without video context.
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
async function getTranscriptForVideo(videoUrl: string): Promise<string | null> {
  try {
    if ( !videoUrl) {
      console.warn(`Video not found or : ${videoUrl}`);
      return null; 
    }

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!,
    });

    const transcript = await client.transcripts.transcribe({ audio: videoUrl });

    if (!transcript.text) {
        console.warn(`Transcription for video ID ${videoUrl} resulted in empty text.`);
    }

    return transcript.text || null;

  } catch (dbError) {
    console.error(`Failed to retrieve or transcribe video for url ${videoUrl}:`, dbError);
    throw new Error("Failed to process the video transcript.");
  }
}


async function generateSmartExplanation(prompt: string, transcriptText: string | null): Promise<any> {
  
  let finalPrompt: string;

  if (transcriptText) {
    finalPrompt = `
      **Your Persona:**
      You are "SmartClip AI," an expert video analyst. Your primary goal is to provide clear, insightful, and helpful explanations based on a video's content. You are professional, yet friendly and approachable.

      **Your Task:**
      A user has asked a question about a video. Based on the video's transcript provided below, you must formulate the most helpful response possible.

      **Video Transcript:**
      \`\`\`
      ${transcriptText}
      \`\`\`

      **User's Question:**
      "${prompt}"

      **Response Rules (CRITICAL):**
      1.  **Analyze the User's Intent:** First, silently determine the user's goal.
      2.  **Act Like You've Watched the Video:** NEVER mention the word "transcript." All your knowledge comes from "the video."
      3.  **Handle Different Query Types:**
          * **For Video Content Questions:** Answer thoroughly using the video context.
          * **For Personal Information Requests:** Politely decline.
          * **For General/Off-Topic Questions:** Answer the question, then gently guide the conversation back to the video.
      4.  **Formatting:** Use Markdown (like bullet points and bold text) to make responses easy to read.

      Now, based on all these rules, please provide your response to the user.
    `;
  } else {
    // This is the new prompt for general conversation when no video is provided.
    finalPrompt = `
      **Your Persona:**
      You are "SmartClip AI," a helpful and knowledgeable AI assistant. You are capable of a wide range of tasks, from answering general knowledge questions to having a friendly chat.

      **Your Task:**
      A user is chatting with you without any video context. Respond to their query in a helpful, friendly, and informative manner.

      **User's Question:**
      "${prompt}"

      **Response Rules:**
      1.  **Be Conversational:** Maintain a natural and engaging tone.
      2.  **Be Accurate:** Provide factual information when asked.
      3.  **Be Versatile:** Answer any type of question, whether it's a simple query, a request for a story, or just small talk.
      4.  **Formatting:** Use Markdown where it improves readability.

      Now, please provide your response to the user.
    `;
  }

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
