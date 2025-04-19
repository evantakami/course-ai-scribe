
import { useState, useEffect } from 'react';
import { Question, UserAnswer } from "@/types";
import { toast } from "sonner";

export const useQuizState = (
  questions: Question[],
  initialAnswers: UserAnswer[] = [],
  onSaveAnswers?: (answers: UserAnswer[]) => void
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setUserAnswers(initialAnswers || []);
      const currentQuestion = questions[currentIndex];
      if (currentQuestion) {
        const existingAnswer = initialAnswers?.find(a => a.questionId === currentQuestion.id);
        setSelectedOption(existingAnswer ? existingAnswer.selectedOption : null);
      }
      
      if (currentIndex >= questions.length) {
        setCurrentIndex(0);
      }
    }
  }, [questions, initialAnswers, currentIndex]);

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
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setCurrentIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return {
    currentIndex,
    currentQuestion: questions[currentIndex],
    userAnswers,
    selectedOption,
    setSelectedOption,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePrevQuestion
  };
};
