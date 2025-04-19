
import { CourseContent, StyleSummaries, UserAnswer } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const useHistoryManagement = () => {
  const saveToHistory = (
    content: string, 
    summaries: any, 
    questions: any, 
    courseId: string
  ) => {
    try {
      if (!content || !courseId) return;
      
      const historyString = localStorage.getItem('content_history') || '[]';
      let history = JSON.parse(historyString);
      
      const existingIndex = history.findIndex(item => item.rawContent === content);
      
      const firstLine = content.split('\n')[0] || '';
      let title = firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
      
      // Create summaries object in the right format
      const summariesObj: StyleSummaries = {};
      if (summaries.casual) summariesObj.casual = summaries.casual.content;
      if (summaries.academic) summariesObj.academic = summaries.academic.content;
      if (summaries.basic) summariesObj.basic = summaries.basic.content;
      
      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          title: title,
          courseId: courseId,
          summaries: summariesObj,
          questions: questions
        };
      } else {
        const newItem = {
          id: uuidv4(),
          rawContent: content,
          timestamp: new Date(),
          title: title,
          courseId: courseId,
          summaries: summariesObj,
          questions: questions
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

  return {
    saveToHistory,
    updateUserStats
  };
};
