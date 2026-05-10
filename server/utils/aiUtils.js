import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const getModel = () =>
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.3,
  });

const outputParser = new StringOutputParser();

export async function summarizeDocument(text) {
  const truncated = text.slice(0, 8000);

  const prompt = PromptTemplate.fromTemplate(
    `You are a helpful assistant. Summarize the following document in 3-5 clear, concise sentences. 
Focus on the main topics, key points, and purpose of the document.

Document:
{text}

Summary:`
  );

  const chain = prompt.pipe(getModel()).pipe(outputParser);
  const summary = await chain.invoke({ text: truncated });
  return summary.trim();
}

export async function answerQuestion(question, documentText) {
  const context = documentText.slice(0, 8000);

  const prompt = PromptTemplate.fromTemplate(
    `You are a helpful document assistant. Answer the user's question strictly based on the provided document context.
    If the answer is not in the document, say "I couldn't find that information in the document."
    Keep the answer concise and direct (2-4 sentences max).

    Document Context:
    {context}

    Question: {question}

    Answer:`
  );

  const chain = prompt.pipe(getModel()).pipe(outputParser);
  const answer = await chain.invoke({ context, question });
  return answer.trim();
}