
import { CourseContent, HistoryItem, UserAnswer } from "@/types";

export const useContentHistory = () => {
  const saveToHistory = (content: CourseContent, selectedCourseId: string) => {
    try {
      if (!content.rawContent || !selectedCourseId) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content.rawContent);
      
      const firstLine = content.rawContent.split('\n')[0] || '';
      let title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          title: title,
          courseId: selectedCourseId,
          summaries: content.summary ? {
            ...(history[existingIndex].summaries || {}),
            [content.summary.style]: content.summary.content
          } : history[existingIndex].summaries,
          questions: content.questions || history[existingIndex].questions,
          language: content.summary?.language || history[existingIndex].language
        };
      } else {
        const newItem: HistoryItem = {
          id: uuidv4(),
          rawContent: content.rawContent,
          timestamp: new Date(),
          title: title,
          courseId: selectedCourseId,
          summaries: content.summary ? { [content.summary.style]: content.summary.content } : undefined,
          questions: content.questions,
          language: content.summary?.language
        };
        
        history = [newItem, ...history];
        
        if (history.length > 50) {
          history = history.slice(0, 50);
        }
      }
      
      localStorage.setItem('content_history', JSON.stringify(history));
      updateUserStats();
    } catch (error) {
      console.error("Failed to save to history:", error);
    }
  };

  const updateUserStats = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        
        const historyString = localStorage.getItem('content_history') || '[]';
        const history = JSON.parse(historyString);
        
        let totalQuizzes = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;
        
        history.forEach(item => {
          if (item.userAnswers && item.userAnswers.length) {
            totalQuizzes++;
            item.userAnswers.forEach(answer => {
              if (answer.isCorrect) correctAnswers++;
              totalQuestions++;
            });
          }
        });
        
        const updatedProfile = {
          ...userProfile,
          quizStats: { totalQuizzes, correctAnswers, totalQuestions }
        };
        
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Failed to update user stats:", error);
    }
  };

  const saveUserAnswersToHistory = (userAnswers: UserAnswer[], content: CourseContent, selectedCourseId: string) => {
    try {
      if (!content.rawContent) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history: HistoryItem[] = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content.rawContent);
      
      const updatedAnswers = userAnswers.map(answer => ({
        ...answer,
        courseId: selectedCourseId,
        timestamp: answer.timestamp || new Date()
      }));
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          userAnswers: updatedAnswers
        };
        
        localStorage.setItem('content_history', JSON.stringify(history));
        saveIncorrectToMistakeCollection(updatedAnswers, content);
        updateUserStats();
      }
    } catch (error) {
      console.error("Failed to save user answers to history:", error);
    }
  };

  const saveIncorrectToMistakeCollection = (userAnswers: UserAnswer[], content: CourseContent) => {
    try {
      const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
      if (incorrectAnswers.length === 0) return;
      
      const detailedIncorrectAnswers = incorrectAnswers.map(answer => {
        let questionDetails;
        
        if (content.questions?.easy) {
          questionDetails = content.questions.easy.find(q => q.id === answer.questionId);
        }
        if (!questionDetails && content.questions?.medium) {
          questionDetails = content.questions.medium.find(q => q.id === answer.questionId);
        }
        if (!questionDetails && content.questions?.hard) {
          questionDetails = content.questions.hard.find(q => q.id === answer.questionId);
        }
        
        return {
          ...answer,
          question: questionDetails?.text,
          options: questionDetails?.options,
          correctAnswer: questionDetails?.correctAnswer,
          explanation: questionDetails?.explanation,
          timestamp: new Date()
        };
      });
      
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      const existingMistakes: UserAnswer[] = JSON.parse(mistakesString);
      
      const updatedMistakes = [...existingMistakes];
      
      detailedIncorrectAnswers.forEach(newMistake => {
        const existingIndex = updatedMistakes.findIndex(m => m.questionId === newMistake.questionId);
        if (existingIndex >= 0) {
          updatedMistakes[existingIndex] = newMistake;
        } else {
          updatedMistakes.push(newMistake);
        }
      });
      
      localStorage.setItem('mistake_collection', JSON.stringify(updatedMistakes.slice(0, 100)));
    } catch (error) {
      console.error("Failed to save to mistake collection:", error);
    }
  };

  return {
    saveToHistory,
    saveUserAnswersToHistory
  };
};
