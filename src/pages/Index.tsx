
// Modify these two existing methods
const generateAllSummaries = async (content: string, language: SummaryLanguage) => {
  try {
    const styles: SummaryStyle[] = ["casual", "academic", "basic"];
    
    const summaryPromises = styles.map(style => 
      openaiService.generateSummary(content, style, language)
    );
    
    const allSummaries = await Promise.all(summaryPromises);
    
    setCourseContent(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        summary: allSummaries[0]  // Default to first summary style
      };
    });
    
    toast.success("所有风格摘要已生成");
    return allSummaries;
  } catch (error) {
    console.error("Error generating summaries:", error);
    toast.error("生成摘要时出错");
    throw error;
  }
};

const generateAllQuestions = async (content: string, language: SummaryLanguage) => {
  try {
    const [easyQuestionsPromise, mediumQuestionsPromise, hardQuestionsPromise] = [
      openaiService.generateQuestions(content, "easy", 10, language),
      openaiService.generateQuestions(content, "medium", 10, language),
      openaiService.generateQuestions(content, "hard", 10, language)
    ];
    
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      easyQuestionsPromise, 
      mediumQuestionsPromise, 
      hardQuestionsPromise
    ]);
    
    setCourseContent(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        questions: {
          easy: easyQuestions,
          medium: mediumQuestions,
          hard: hardQuestions
        }
      };
    });
    
    toast.success("所有难度测验题已生成");
    return { easy: easyQuestions, medium: mediumQuestions, hard: hardQuestions };
  } catch (error) {
    console.error("Error generating questions:", error);
    toast.error("生成测验题时出错");
    throw error;
  }
};
