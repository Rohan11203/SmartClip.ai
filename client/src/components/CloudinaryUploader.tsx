import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api";

// --- SVG Icons for Chat UI ---
const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-500 dark:text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

const SendIcon = ({ disabled }: { disabled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 text-white transition-colors ${disabled ? 'opacity-50' : ''}`}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      U
    </div>
);

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Z" />
        <path fillRule="evenodd" d="M11.755 4.222a.75.75 0 0 0-1.22-.868l-1.5 2.598a.75.75 0 0 0 1.22.868l1.5-2.598Zm-3.51 0-.001.002a.75.75 0 0 0 1.22-.868l-1.5-2.598a.75.75 0 0 0-1.22.868l1.5 2.598Z" clipRule="evenodd" />
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z" />
       </svg>
    </div>
);

// --- Type definitions for our chat messages ---
type Message = {
    id: number;
    sender: 'user' | 'ai';
    text: string;
    videoName?: string;
    status: 'loading' | 'success' | 'error';
};

// --- Main Chat Component ---
export const CloudinaryUploader: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [prompt, setPrompt] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the bottom of the chat on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    const handleSubmit = useCallback(async () => {
        if (!prompt || isProcessing) return;

        setIsProcessing(true);
        const userMessageId = Date.now();
        const aiMessageId = userMessageId + 1;

        // Add user prompt and AI loading messages to chat
        setMessages(prev => [
            ...prev,
            { id: userMessageId, sender: 'user', text: prompt, videoName: selectedFile?.name, status: 'success' },
            { id: aiMessageId, sender: 'ai', text: "Thinking...", status: 'loading' }
        ]);
        
        const currentPrompt = prompt;
        const currentFile = selectedFile;

        // Reset inputs
        setPrompt("");
        setSelectedFile(null);

        // --- Start processing logic ---
        const CLOUD_NAME = "dhaqlhoe7";
        const UPLOAD_PRESET = "unsigned_clips";
        
        try {
            let videoUrl = null;

            // Only upload to Cloudinary if a file is selected
            if (currentFile) {
                const formData = new FormData();
                formData.append("file", currentFile);
                formData.append("upload_preset", UPLOAD_PRESET);

                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
                const uploadResponse = await axios.post(cloudinaryUrl, formData, { withCredentials: false });
                videoUrl = uploadResponse.data.secure_url;
            }

            // Call the backend with the prompt and optional video URL
            const explanationResponse = await axios.post(
                `${BACKEND_URL}/api/v1/video/explain`,
                { prompt: currentPrompt, videoUrl }, // videoUrl will be null if no file
                { withCredentials: true }
            );
            
            // Update AI message with success
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                ? { ...msg, text: explanationResponse.data.videoText, status: 'success' } 
                : msg
            ));
        } catch (err: any) {
            console.error("Process failed:", err);
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (err.response?.data?.message) {
                errorMessage = `Server Error: ${err.response.data.message}`;
            } else if (err.message.includes('CORS')) {
                errorMessage = 'A network error occurred. Check server CORS settings.';
            }
            
            // Update AI message with error
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                ? { ...msg, text: errorMessage, status: 'error' } 
                : msg
            ));
        } finally {
            setIsProcessing(false);
        }
    }, [prompt, selectedFile, isProcessing]);

    return (
        <div className="flex flex-col h-[70vh] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg">
            {/* Chat Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.length === 0 && (
                        <div className="text-center pt-16">
                            <BotIcon />
                            <h2 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">How can I help you today?</h2>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">Attach a video and ask me anything about it.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <BotIcon />}
                            <div className={`max-w-lg p-4 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-slate-800 text-white rounded-br-none' 
                                : `bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-slate-700 dark:text-slate-200 rounded-bl-none ${msg.status === 'error' ? 'border-red-500' : ''}`
                            }`}>
                                {msg.videoName && (
                                    <div className="mb-2 p-2 bg-slate-700 dark:bg-slate-600 border border-slate-600 dark:border-slate-500 rounded-lg text-sm">
                                        <p className="font-bold truncate text-white">Video: {msg.videoName}</p>
                                    </div>
                                )}
                                {msg.status === 'loading' ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                                    </div>
                                ) : (
                                    <p className={`whitespace-pre-wrap ${msg.status === 'error' ? 'text-red-500' : ''}`}>{msg.text}</p>
                                )}
                            </div>
                            {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {/* Input Bar Area */}
            <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 p-4">
                <div className="max-w-3xl mx-auto">
                    {selectedFile && (
                        <div className="mb-3 px-3 py-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg flex items-center justify-between">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300 truncate">Attached: {selectedFile.name}</p>
                            <button onClick={() => setSelectedFile(null)} className="font-bold text-orange-500 dark:text-orange-400 hover:text-orange-800 text-xl">&times;</button>
                        </div>
                    )}
                    <div className="flex items-center gap-2 p-2 border border-slate-300 dark:border-neutral-700 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-orange-500">
                        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full">
                            <PaperclipIcon />
                        </button>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder="Ask something about the video..."
                            className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-slate-800 dark:text-white"
                            rows={1}
                            disabled={isProcessing}
                        />
                        <button onClick={handleSubmit} disabled={!prompt || isProcessing} className="p-2 bg-orange-500 rounded-full hover:bg-orange-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors">
                            <SendIcon disabled={!prompt || isProcessing}/>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CloudinaryUploader;
