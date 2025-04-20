import { SummaryStyle, QuestionDifficulty, Question, Summary, SummaryLanguage, CustomPrompt } from "@/types";

class OpenAIService {
  private apiKey: string | null = null;
  private model: string = "gpt-4o-mini";  // 默认模型
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
      if (style === 'academic') {
        return `**任务**: 对提供的教学内容（如课程录音转录、技术文档或讲座）进行专业且详尽的技术总结。

**请遵循以下要求**:

1.  **目标受众**: 具备相关领域基础知识的技术人员、研究者、学生或专业人士。
2.  **语言风格**: 使用**精确、规范的专业术语**。保持客观、严谨，注重逻辑性。
3.  **核心内容**:
    *   清晰阐述内容所涉及的**核心概念、理论框架、技术架构或方法论**。
    *   **详细识别并解释**文本中提到的所有关键术语、工具、技术组件、模型或流程。说明其**功能、原理、适用场景及优缺点**（如文本中有提及）。
    *   如果内容包含对比、评估或问答环节，需系统性地**总结关键的对比分析、决策依据和结论**。例如，不同方案的性能比较、特定技术选型的理由等。
    *   **确保完整覆盖**源文本中传达的所有**重要信息点、知识体系和关键结论**，不得有实质性遗漏。
    *   严格依据提供的文本内容进行总结，**不引入外部信息**[1, 5]。
4.  **结构要求**:
    *   逻辑清晰，可包含引言（概述主题）、主体（分点阐述核心概念、技术、方法）、关键分析（综合对比或结论）、总结（提炼核心价值或观点）。
5.  **格式要求**:
    *   使用标准的Markdown格式。
    *   标题层级分明 (\`##\`, \`###\`)。
    *   关键术语、模型、工具名称使用**加粗**。
    *   使用列表（有序/无序）清晰组织信息。`;
      } else if (style === 'casual') {
        return `**任务**: 对提供的教学内容（如课程录音转录、介绍性文章或讲座）进行清晰简明、易于理解的总结。

**请遵循以下要求**:

1.  **目标受众**: 对该领域**了解不多的初学者**、学生或需要快速了解核心内容的非专业人士[3]。
2.  **语言风格**: 使用**简单、平实的日常语言**。多运用**贴切的比喻或类比**来解释复杂的概念[3]。侧重于说明**"它是什么"、"它能做什么"以及"它为什么重要/有用"**。
3.  **核心内容**:
    *   用通俗易懂的方式介绍内容的主题和核心思想。
    *   识别并列出文本中提到的**主要概念、工具或步骤**。对每一个都用**大白话解释**其基本作用或目的。
    *   说明这些概念或工具在**实际中可能的应用场景或能解决的问题**。
    *   如果内容涉及对比或选择，用**简单直白的方式总结其主要结论或建议**（例如："做A比做B更快，因为..."）。
    *   **确保提及所有核心主题和关键信息点**，即使解释简化，也要保证信息的**完整性**，不遗漏要点[Implicit Goal]。
    *   仅根据提供的文本进行总结[1]。
4.  **结构要求**:
    *   开头简要介绍主题。
    *   分点或分段介绍关键概念/工具及其作用。
    *   列举实际应用或好处。
    *   简要总结核心观点或建议。
5.  **格式要求**:
    *   使用易读的Markdown格式。
    *   标题简洁易懂。
    *   关键名称或术语使用**加粗**以便识别，并紧随简单解释。
    *   多使用短句、列表（如bullet points）[3, 5]。`;
      } else if (style === 'basic') {
        return `**任务**: 提取文档中的所有术语、概念和专业名词，并提供解释。

**输出格式要求**: 
输出必须是一个有效的 JSON 数组，每个条目包含以下字段：
1. "term": 提取的术语或概念名称
2. "definition": 该术语的解释或定义
3. "category": 术语所属的类别（如："技术术语"、"理论概念"、"方法论"等）

格式示例：
\`\`\`json
[
  {
    "term": "术语名称1",
    "definition": "该术语的完整解释和定义...",
    "category": "技术术语"
  },
  {
    "term": "术语名称2",
    "definition": "该术语的完整解释和定义...",
    "category": "理论概念"
  }
]
\`\`\`

**详细要求**:

1. **全面提取**: 
   - 必须从文档中提取所有专业术语、概念、方法、工具、平台或专有名词。
   - 确保不遗漏任何在文档中出现的专业术语。

2. **解释质量**: 
   - 每个术语的解释必须清晰、准确，并基于文档中提供的信息。
   - 如果文档中提供了术语的正式定义，请使用该定义。
   - 如果文档中没有直接定义，请根据术语在文档中的使用上下文给出合理解释。

3. **分类要求**:
   - 将术语按照合理方式分为不同类别，如"技术术语"、"理论概念"、"方法论"、"工具"、"平台"等。
   - 分类方式需要适合文档的实际内容和领域特点。

4. **严格遵守JSON格式**:
   - 输出必须是有效的JSON，确保所有引号、括号配对完整。
   - 不要在JSON之外添加任何额外的说明文字。

请确保仅输出符合要求的JSON数组，不要添加其他解释或标记。这个JSON将被直接用于构建术语表界面。`;
      }
    }
    
    switch (type) {
      case 'summary':
        return "对以下课程内容进行总结。确保捕捉所有关键知识点和重要信息。内容要全面但简洁。内容必须采用Markdown格式以提高可读性，包括标题、重点内容加粗、列表等。";
      case 'questions':
        return "根据这个课程内容创建多选题。每个问题必须有恰好4个选项，且只有一个正确答案。所有问题和答案必须直接基于提供的内容，不要引入外部信息。对每个问题，包含一个解释字段，用Markdown格式详细解释为什么正确答案是对的，以及其他选项为什么是错误的。确保解释清晰易懂，有教育意义。不要添加没有在原始内容中出现的信息。";
      case 'explanation':
        return "针对用户在这道题的错误，提供详细解释。首先解释正确答案为什么是对的，然后特别针对用户选择的错误选项进行分析，说明为什么这个选项是错误的，以及可能导致用户选择这个错误选项的常见误解。为了降低幻觉，确保解释严格基于原始内容，不要添加没有在课程材料中出现的信息。回答必须使用Markdown格式来增强可读性，包括标题、加粗、列表等格式。";
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
      : style === 'casual'
      ? "请使用轻松、易于理解的风格"
      : "请使用基础、直接的风格，注重知识点的完整列举";
    
    const languagePrompt = `使用${language === 'chinese' ? '中文' : 
                              language === 'english' ? '英文' : 
                              language === 'spanish' ? '西班牙语' : '法语'}输出摘要。`;
    
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

    const languagePrompt = `使用${language === 'chinese' ? '中文' : 
                             language === 'english' ? '英文' : 
                             language === 'spanish' ? '西班牙语' : '法语'}创建问题和所有答案。`;
    
    const basePrompt = this.getCustomPrompt('questions');

    const prompt = `
    ${basePrompt}
    
    ${content}
    
    要求：
    1. 问题应该是${difficulty}难度级别（${difficultyDescription}）
    2. 每个问题必须有恰好4个选项，且只有一个正确答案
    3. 所有问题和答案必须直接基于提供的内容 - 不要引入外部信息
    4. ${languagePrompt}
    5. 为每个问题添加一个explanation字段，使用Markdown格式提供详细解释，解释为什么正确答案是正确的，其他选项为什么是错误的
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
    
    请确保返回格式正确的JSON，不要添加任何额外的文本。
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
    const isCorrect = selectedOptionIndex === question.correctAnswer;
    const selectedOption = question.options[selectedOptionIndex];
    const correctOption = question.options[question.correctAnswer];
    
    const languagePrompt = `请使用${language === 'chinese' ? '中文' : 
                              language === 'english' ? '英文' : 
                              language === 'spanish' ? '西班牙语' : '法语'}提供解释。`;
    
    const basePrompt = this.getCustomPrompt('explanation');

    const prompt = `
    ${basePrompt}
    
    问题: ${question.text}
    
    选项:
    ${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
    
    用户选择: ${selectedOption}
    正确答案: ${correctOption}
    用户是否选择正确: ${isCorrect ? '是' : '否'}
    
    原始解释: ${question.explanation || "无解释"}
    
    请提供简明但有教育意义的解释。解释为什么正确答案是对的，如果用户答错了，专门解释为什么用户的选择是错误的以及为什么会选错。
    为了降低幻觉，确保你的解释严格基于原始内容和原始解释，不要添加没有在课程材料中出现的信息。
    ${languagePrompt}
    请使用Markdown格式来增强内容的可读性，支持标题、列表、加粗等Markdown语法。
    `;

    const explanation = await this.callAPI(prompt);
    return explanation;
  }
}

export const openaiService = new OpenAIService();
