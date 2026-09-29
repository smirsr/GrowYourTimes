import { GoogleGenerativeAI } from '@google/generative-ai';

// Function to check if an object has a 'message' property
const hasMessage = (obj: any): obj is { message: string } => {
  return obj !== null && 
         typeof obj === 'object' && 
         'message' in obj &&
         typeof obj.message === 'string';
};

// Function to generate a response using Gemini AI
export async function generateGeminiResponse(
  prompt: string, 
  systemPrompt: string,
  maxTokens: number = 300
): Promise<string> {
  try {
    // Initialize the Gemini API with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // Specific model based on what's available in the API version
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
    });
    
    // Prepare a better prompt that includes context
    const enhancedPrompt = `
    You are Carmelina, a friendly AI plant assistant in a productivity app called "Grow Your Time".
    
    Context: ${systemPrompt}
    
    The user says: ${prompt}
    
    As Carmelina, provide a helpful, concise, and encouraging response that relates to their tasks, plants, or productivity. Limit your response to 2-3 short paragraphs maximum. Always sign your messages with "- Carmelina" at the end.`;

    // Generate content using the model
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    });

    // Extract text from the response
    const response = result.response;
    return response.text();
  } catch (error: unknown) {
    console.error('Error generating Gemini response:', error);
    
    // If we encounter a specific model not found error, try with a different model
    if (hasMessage(error) && error.message.includes("not found for API version")) {
      try {
        // Fallback to a different initialization method
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        
        const result = await model.generateContent(
          `As Carmelina, a plant assistant in the "Grow Your Time" productivity app, respond to: ${prompt}. Sign your response with "- Carmelina".`
        );
        
        return result.response.text();
      } catch (fallbackError) {
        console.error('Fallback attempt also failed:', fallbackError);
      }
    }
    
    return "I'm Carmelina, and I'm having trouble processing that right now. How else can I help with your tasks or plant? - Carmelina";
  }
}