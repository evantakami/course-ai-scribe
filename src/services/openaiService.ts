
import { SummaryStyle, QuestionDifficulty, Question, Summary, SummaryLanguage, CustomPrompt } from "@/types";

class OpenAIService {
  private apiKey: string | null = null;
  private model: string = "gpt-4o-mini";  // 默认模型改为gpt-4o-mini，这是一个实际存在的模型
  private customPrompts: Record<string, string> = {};

  constructor() {
    this.loadCustomPrompts();
  }

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

  setModel(model: string) {
    this.model = model;
    localStorage.setItem('openai_model', model);
  }

  getModel(): string {
    const savedModel = localStorage.getItem('openai_model');
    if (savedModel) {
      this.model = savedModel;
    }
    return this.model;
  }

  // Custom prompts methods
  getCustomPrompt(type: 'summary' | 'questions' | 'explanation'): string {
    return this.customPrompts[type] || this.getDefaultPrompt(type);
  }

  setCustomPrompt(type: 'summary' | 'questions' | 'explanation', content: string) {
    this.customPrompts[type] = content;
    this.saveCustomPrompts();
  }

  resetCustomPrompt(type: 'summary' | 'questions' | 'explanation') {
    delete this.customPrompts[type];
    this.saveCustomPrompts();
  }

  private getDefaultPrompt(type: 'summary' | 'questions' | 'explanation'): string {
    switch (type) {
      case 'summary':
        return "Summarize the following course content. Make sure to capture ALL key knowledge points and important information. Be comprehensive but concise.";
      case 'questions':
        return "Create multiple-choice questions based on this course content. Each question must have exactly 4 options with only one correct answer. All questions and answers must be directly based on the provided content.";
      case 'explanation':
        return "Provide a detailed explanation of why the correct answer is right, and specifically address the user's answer (whether correct or incorrect). If incorrect, explain the misconception that might have led to selecting the wrong option.";
      default:
        return "";
    }
  }

  private saveCustomPrompts() {
    localStorage.setItem('openai_custom_prompts', JSON.stringify(this.customPrompts));
  }

  private loadCustomPrompts() {
    const saved = localStorage.getItem('openai_custom_prompts');
    if (saved) {
      try {
        this.customPrompts = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse custom prompts", error);
        this.customPrompts = {};
      }
    }
  }

  private async callAPI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    const model = this.getModel();
    
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
          model: model,
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

  async generateSummary(content: string, style: SummaryStyle, language: SummaryLanguage): Promise<Summary> {
    const stylePrompt = style === 'academic' 
      ? "in an academic, formal style with proper terminology" 
      : "in a casual, easy-to-understand style";
    
    const languagePrompt = `Output the summary in ${language} language.`;
    
    const basePrompt = this.getCustomPrompt('summary');
    
    const prompt = `
    ${basePrompt}
    ${stylePrompt}. 
    ${languagePrompt}

    ${content}
    `;

    const result = await this.callAPI(prompt);
    
    return {
      content: result,
      style,
      language
    };
  }

  async generateQuestions(content: string, difficulty: QuestionDifficulty, count: number = 10, language: SummaryLanguage = 'english'): Promise<Question[]> {
    const difficultyDescription = {
      'easy': 'basic understanding and recall of the material',
      'medium': 'application of concepts and some analysis',
      'hard': 'deep understanding, analysis, and synthesis of complex ideas'
    }[difficulty];

    const languagePrompt = `Create the questions and all answers in ${language} language.`;
    
    const basePrompt = this.getCustomPrompt('questions');

    const prompt = `
    ${basePrompt}
    
    ${content}
    
    Requirements:
    1. Questions should be at ${difficulty} difficulty level (${difficultyDescription})
    2. Each question must have exactly 4 options with only one correct answer
    3. All questions and answers must be directly based on the provided content - do not introduce external information
    4. ${languagePrompt}
    5. Return the response in this JSON format:
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

  async evaluateAnswer(question: Question, selectedOptionIndex: number, language: SummaryLanguage = 'english'): Promise<string> {
    const isCorrect = selectedOptionIndex === question.correctAnswer;
    const selectedOption = question.options[selectedOptionIndex];
    const correctOption = question.options[question.correctAnswer];
    
    const languagePrompt = `Provide the explanation in ${language} language.`;
    
    const basePrompt = this.getCustomPrompt('explanation');

    const prompt = `
    ${basePrompt}
    
    Question: ${question.text}
    
    Options:
    ${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
    
    User selected: ${selectedOption}
    Correct answer: ${correctOption}
    
    Keep the explanation concise but educational.
    ${languagePrompt}
    `;

    const explanation = await this.callAPI(prompt);
    return explanation;
  }
}

export const openaiService = new OpenAIService();
