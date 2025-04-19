
import { useState, useEffect } from 'react';
import { Question, UserAnswer } from "@/types";
import { toast } from "sonner";
import { openaiService } from "@/services/openaiService";

export const useQuiz = (
  questions: Question[],
  initialAnswers: UserAnswer[] = [],
  onSaveAnswers?: (answers: UserAnswer[]) => void
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [customExplanation, setCustomExplanation] = useState<string | null>(null);

  // Initialize or update state when questions or answers change
  useEffect(() => {
    if (questions && questions.length > 0) {
      setUserAnswers(initialAnswers || []);
      updateSelectedOption();
      
      if (currentIndex >= questions.length) {
        setCurrentIndex(0);
      }
    }
  }, [questions, initialAnswers]);

  // Update selected option when changing questions
  useEffect(() => {
    if (questions && questions.length > 0 && currentIndex < questions.length) {
      updateSelectedOption();
      // Show explanation if answer exists for this question
      const currentQuestion = questions[currentIndex];
      const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
      setIsShowingExplanation(!!existingAnswer);
      setCustomExplanation(null);
    }
  }, [currentIndex, questions, userAnswers]);

  // Save answers when they change
  useEffect(() => {
    if (userAnswers.length > 0 && onSaveAnswers) {
      onSaveAnswers(userAnswers);
    }
  }, [userAnswers, onSaveAnswers]);

  // Update the selected option based on current question
  const updateSelectedOption = () => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion) {
      const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
      setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
    } else {
      setSelectedOption(null);
    }
  };

  // Handle submitting an answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || !questions[currentIndex]) return;

    const question = questions[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: question.id,
      selectedOption,
      isCorrect,
      question: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      timestamp: new Date()
    };
    
    setUserAnswers(prev => {
      const updated = [
        ...prev.filter(a => a.questionId !== question.id),
        newAnswer
      ];
      if (onSaveAnswers) {
        onSaveAnswers(updated);
      }
      return updated;
    });
    
    // Automatically show explanation after submitting
    setIsShowingExplanation(true);
    
    // Save to mistake collection if wrong
    if (!isCorrect) {
      saveToMistakeCollection(newAnswer);
    }
  };

  // Save to mistake collection
  const saveToMistakeCollection = (answer: UserAnswer) => {
    try {
      const mistakesString = localStorage.getItem('mistake_collection') || '[]';
      let mistakes = JSON.parse(mistakesString);
      
      const existingIndex = mistakes.findIndex((m: UserAnswer) => m.questionId === answer.questionId);
      
      if (existingIndex >= 0) {
        mistakes[existingIndex] = answer;
      } else {
        mistakes.push(answer);
      }
      
      localStorage.setItem('mistake_collection', JSON.stringify(mistakes));
    } catch (error) {
      console.error("Failed to save to mistake collection:", error);
    }
  };

  // Generate explanation for wrong answers
  const handleGenerateExplanation = async () => {
    if (!questions[currentIndex]) return;
    
    const answer = userAnswers.find(a => a.questionId === questions[currentIndex].id);
    if (!answer || answer.isCorrect) return;
    
    setIsLoadingExplanation(true);
    try {
      const explanation = await openaiService.evaluateAnswer(
        questions[currentIndex], 
        answer.selectedOption
      );
      setCustomExplanation(explanation);
    } catch (error) {
      console.error("Failed to generate explanation:", error);
      toast.error("生成解析失败，请重试");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Navigation
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCustomExplanation(null);
    setCurrentIndex(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setIsShowingExplanation(false);
    setCustomExplanation(null);
    setCurrentIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return {
    currentIndex,
    currentQuestion: questions[currentIndex],
    userAnswers,
    selectedOption,
    isShowingExplanation,
    isLoadingExplanation,
    customExplanation,
    setSelectedOption,
    setIsShowingExplanation,
    handleSubmitAnswer,
    handleGenerateExplanation,
    handleNextQuestion,
    handlePrevQuestion,
    saveToMistakeCollection
  };
};
