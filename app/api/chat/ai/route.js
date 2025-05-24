// Please install the SDK first: `npm install @google/genai`
export const maxDuration=60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // not DEEPSEEK

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    const { chatId, prompt } = await req.json();

    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });
    if (!data) {
      return NextResponse.json({ success: false, message: "Chat not found" });
    }

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const message = {
      role: "model",
      content: text,
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}














// async function main() {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const result = await model.generateContent("Explain how AI works in a few words");
//   const response = await result.response;
//   const text = await response.text();

//   console.log(text);
// }

// main();
