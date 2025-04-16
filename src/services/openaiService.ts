import { SummaryStyle, QuestionDifficulty, Question, Summary, SummaryLanguage, CustomPrompt } from "@/types";

class OpenAIService {
  private apiKey: string | null = null;
  private model: string = "gpt-4o-mini";  // 默认模型改为gpt-4o-mini，这是一个实际存在的模型
  private customPrompts: Record<string, Record<string, string>> = {
    summary: {},
    questions: {},
    explanation: {}
  };

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

  getCustomPrompt(type: 'summary' | 'questions' | 'explanation', style?: SummaryStyle): string {
    if (type === 'summary' && style) {
      return this.customPrompts[type][style] || this.getDefaultPrompt(type, style);
    }
    return this.customPrompts[type]['default'] || this.getDefaultPrompt(type);
  }

  setCustomPrompt(type: 'summary' | 'questions' | 'explanation', content: string, style?: SummaryStyle) {
    if (type === 'summary' && style) {
      if (!this.customPrompts[type]) {
        this.customPrompts[type] = {};
      }
      this.customPrompts[type][style] = content;
    } else {
      if (!this.customPrompts[type]) {
        this.customPrompts[type] = {};
      }
      this.customPrompts[type]['default'] = content;
    }
    this.saveCustomPrompts();
  }

  resetCustomPrompt(type: 'summary' | 'questions' | 'explanation', style?: SummaryStyle) {
    if (type === 'summary' && style) {
      if (this.customPrompts[type]) {
        delete this.customPrompts[type][style];
      }
    } else {
      if (this.customPrompts[type]) {
        delete this.customPrompts[type]['default'];
      }
    }
    this.saveCustomPrompts();
  }

  private getDefaultPrompt(type: 'summary' | 'questions' | 'explanation', style?: SummaryStyle): string {
    if (type === 'summary' && style) {
      if (style === 'casual') {
        return "对以下课程内容进行通俗易懂的总结。使用简单的语言和比喻，让没有专业背景的人也能理解。避免使用专业术语，如果必须使用专业词汇，请提供简单解释。确保总结全面但通俗易懂。内容可以采用Markdown格式以提高可读性。";
      } else if (style === 'academic') {
        return "对以下课程内容进行学术专业的总结。使用专业的术语和概念，保持准确性和严谨性。面向具有该领域基础知识的读者，可以使用适当的专业术语。确保总结全面且专业。内容可以采用Markdown格式以提高可读性。";
      }
    }
    
    switch (type) {
      case 'summary':
        return "对以下课程内容进行总结。确保捕捉所有关键知识点和重要信息。内容要全面但简洁。内容可以采用Markdown格式以提高可读性。";
      case 'questions':
        return "根据这个课程内容创建多选题。每个问题必须有恰好4个选项，且只有一个正确答案。所有问题和答案必须直接基于提供的内容，不要引入外部信息。对每个问题，包含一个解释字段，用Markdown格式解释为什么正确答案是对的，以及其他选项为什么是错误的。";
      case 'explanation':
        return "提供详细解释说明为什么正确答案是对的，并特别针对用户的答案（无论是否正确）进行分析。如果答案不正确，请解释可能导致选择错误选项的常见误解。为了降低幻觉，请确保解释严格基于原始内容，不要添加没有在原始材料中出现的信息。";
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
        this.customPrompts = {
          summary: {},
          questions: {},
          explanation: {}
        };
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
      ? "请使用学术、正式的风格，使用适当的术语" 
      : "请使用轻松、易于理解的风格";
    
    const languagePrompt = `使用${language === 'chinese' ? '中文' : '英文'}输出摘要。`;
    
    const basePrompt = this.getCustomPrompt('summary', style);
    
    const prompt = `
    ${basePrompt}
    ${stylePrompt}
    ${languagePrompt}
    请使用Markdown格式来增强内容的可读性。

    ${content}
    `;

    const result = await this.callAPI(prompt);
    
    return {
      content: result,
      style,
      language
    };
  }

  async generateQuestions(content: string, difficulty: QuestionDifficulty, count: number = 10, language: SummaryLanguage = 'chinese'): Promise<Question[]> {
    const difficultyDescription = {
      'easy': '基础理解和回忆材料',
      'medium': '概念的应用和一些分析',
      'hard': '深度理解、分析和综合复杂思想'
    }[difficulty];

    const languagePrompt = `使用${language === 'chinese' ? '中文' : '英文'}创建问题和所有答案。`;
    
    const basePrompt = this.getCustomPrompt('questions');

    const prompt = `
    ${basePrompt}
    
    ${content}
    
    要求：
    1. 问题应该是${difficulty}难度级别（${difficultyDescription}）
    2. 每个问题必须有恰好4个选项，且只有一个正确答案
    3. 所有问题和答案必须直接基于提供的内容 - 不要引入外部信息
    4. ${languagePrompt}
    5. 为每个问题添加一个explanation字段，使用Markdown格式提供详细解释
    6. 以这种JSON格式返回响应：
    [
      {
        "id": 1,
        "text": "这里是问题文本？",
        "options": ["选项A", "选项B", "选项C", "选项D"],
        "correctAnswer": 0, // 正确选项的索引（0-3）
        "difficulty": "${difficulty}",
        "explanation": "这里是Markdown格式的详细解释说明为什么正确答案是对的，以及其他选项为什么是错误的"
      },
      ...更多问题
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
      throw new Error("生成问题失败。请重试。");
    }
  }

  async evaluateAnswer(question: Question, selectedOptionIndex: number, language: SummaryLanguage = 'chinese'): Promise<string> {
    if (question.explanation) {
      return question.explanation;
    }
    
    const isCorrect = selectedOptionIndex === question.correctAnswer;
    const selectedOption = question.options[selectedOptionIndex];
    const correctOption = question.options[question.correctAnswer];
    
    const languagePrompt = `请使用${language === 'chinese' ? '中文' : '英文'}提供解释。`;
    
    const basePrompt = this.getCustomPrompt('explanation');

    const prompt = `
    ${basePrompt}
    
    问题: ${question.text}
    
    选项:
    ${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
    
    用户选择: ${selectedOption}
    正确答案: ${correctOption}
    用户是否选择正确: ${isCorrect ? '是' : '否'}
    
    请提供简明但有教育意义的解释。解释为什么正确答案是对的，如果用户答错了，解释为什么用户的选择是错误的。
    为了降低幻觉，确保你的解释严格基于原始内容，不要添加没有在课程材料中出现的信息。
    ${languagePrompt}
    请使用Markdown格式来增强内容的可读性，支持表格、代码块、加粗等Markdown语法。
    `;

    const explanation = await this.callAPI(prompt);
    return explanation;
  }
}

export const openaiService = new OpenAIService();
