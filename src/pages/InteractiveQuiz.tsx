import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner";

const InteractiveQuiz = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [rawContent, setRawContent] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    }

    const storedAnswers = localStorage.getItem('userAnswers');
    if (storedAnswers) {
      setUserAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleCourseSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);

    const storedContent = localStorage.getItem(`courseContent_${courseId}`);
    if (storedContent) {
      setRawContent(storedContent);
    } else {
      setRawContent('');
    }

    setQuizStarted(false);
    setUserAnswers([]);
    setQuestionIndex(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handleStartQuiz = () => {
    if (!selectedCourseId) {
      toast.error("请选择课程");
      return;
    }
    if (!rawContent) {
      toast.error("请先输入课程内容");
      return;
    }

    const generatedQuestions = generateQuestions(rawContent);
    if (generatedQuestions.length === 0) {
      toast.error("无法生成问题，请检查课程内容");
      return;
    }

    setCurrentQuestion(generatedQuestions[0]);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error("请选择一个答案");
      return;
    }

    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedAnswer,
        isCorrect: isCorrect,
        timestamp: new Date(),
        courseId: selectedCourseId
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    const generatedQuestions = generateQuestions(rawContent);
    if (questionIndex < generatedQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(generatedQuestions[questionIndex + 1]);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      toast.info("已完成所有问题");
    }
  };

  const generateQuestions = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => ({
      id: index + 1,
      text: `问题 ${index + 1}: ${line.substring(0, 50)}...?`,
      options: [
        `${line.substring(0, 20)}...`,
        `${line.substring(20, 40)}...`,
        `${line.substring(40, 60)}...`,
        `${line.substring(60, 80)}...`,
      ],
      correctAnswer: index % 4,
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">互动测验</h1>

      <div className="mb-4">
        <Label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700">
          选择课程:
        </Label>
        <select
          id="courseSelect"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedCourseId}
          onChange={handleCourseSelect}
        >
          <option value="">请选择课程</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <Button onClick={handleStartQuiz} disabled={quizStarted}>
          {quizStarted ? '测验已开始' : '开始测验'}
        </Button>
      </div>

      {quizStarted && currentQuestion && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>问题 {questionIndex + 1}</CardTitle>
            <CardDescription>{currentQuestion.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <li key={index}
                  className={`p-3 rounded-lg border ${selectedAnswer === index ? 'bg-blue-100 border-blue-500' : 'border-gray-200'}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    {option}
                  </Button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between">
              <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                提交答案
              </Button>
              <Button onClick={handleNextQuestion}>
                下一题
              </Button>
            </div>

            {isAnswerCorrect !== null && (
              <div className={`mt-4 p-4 rounded-lg ${isAnswerCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  {isAnswerCorrect ? (
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5 mr-2" />
                  )}
                  {isAnswerCorrect ? '回答正确' : '回答错误'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {userAnswers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-8 mb-4">你的答案:</h2>
          <ul className="space-y-4 mt-4">
            {userAnswers.map((answer, index) => (
              <li key={index} className={`p-4 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  {answer.isCorrect ? (
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5 mr-2" />
                  )}
                  <div>
                    <div className="font-medium">{answer.question || `问题 ${index + 1}`}</div>
                    <div className="text-sm text-gray-600">
                      {answer.isCorrect ? '回答正确' : `您选择了: ${answer.options?.[answer.selectedOptionIndex] || '未知选项'}`}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InteractiveQuiz;
