
import { SummaryStyle, QuestionDifficulty, Question, Summary } from "@/types";

class OpenAIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return this.apiKey;
  }

  private async callAPI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error("API key not set. Please enter your OpenAI API key.");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an educational assistant that helps summarize content and create quizzes.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API call failed");
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }

  async generateSummary(content: string, style: SummaryStyle): Promise<Summary> {
    const stylePrompt = style === 'academic' 
      ? "in an academic, formal style with proper terminology" 
      : "in a casual, easy-to-understand style";
    
    const prompt = `
    Summarize the following course content ${stylePrompt}. 
    Make sure to capture ALL key knowledge points and important information.
    Be comprehensive but concise:

    ${content}
    `;

    const result = await this.callAPI(prompt);
    
    return {
      content: result,
      style
    };
  }

  async generateQuestions(content: string, difficulty: QuestionDifficulty, count: number = 10): Promise<Question[]> {
    const difficultyDescription = {
      'easy': 'basic understanding and recall of the material',
      'medium': 'application of concepts and some analysis',
      'hard': 'deep understanding, analysis, and synthesis of complex ideas'
    }[difficulty];

    const prompt = `
    Create ${count} multiple-choice questions based on this course content:
    
    ${content}
    
    Requirements:
    1. Questions should be at ${difficulty} difficulty level (${difficultyDescription})
    2. Each question must have exactly 4 options with only one correct answer
    3. All questions and answers must be directly based on the provided content - do not introduce external information
    4. Return the response in this JSON format:
    [
      {
        "id": 1,
        "text": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // Index of correct option (0-3)
        "difficulty": "${difficulty}"
      },
      ...more questions
    ]
    `;

    const result = await this.callAPI(prompt);
    
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Failed to parse questions JSON");
      
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    } catch (error) {
      console.error("Error parsing questions response:", error);
      throw new Error("Failed to generate questions. Please try again.");
    }
  }

  async evaluateAnswer(question: Question, selectedOptionIndex: number): Promise<string> {
    const isCorrect = selectedOptionIndex === question.correctAnswer;
    const selectedOption = question.options[selectedOptionIndex];
    const correctOption = question.options[question.correctAnswer];
    
    const prompt = `
    The user answered the following multiple-choice question:
    
    Question: ${question.text}
    
    Options:
    ${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
    
    User selected: ${selectedOption}
    Correct answer: ${correctOption}
    
    Provide a detailed explanation of why the correct answer is right, and specifically address the user's answer (whether correct or incorrect). 
    If incorrect, explain the misconception that might have led to selecting the wrong option.
    Keep the explanation concise but educational.
    `;

    const explanation = await this.callAPI(prompt);
    return explanation;
  }
}

export const openaiService = new OpenAIService();
