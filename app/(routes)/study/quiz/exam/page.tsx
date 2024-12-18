'use client';

import GoBackTo from '@/app/components/common/goBackTo';
import Quiz from '@/app/components/search/quiz';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type QuizType = {
  quiznumber: number;
  quiz: string;
  answers: {
    [key: number]: string
  };
  answer: number;
}

export default function Exam(){
  const searchParams = useSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizType[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const levelRef = useRef<string | null>(null);
  const level:string = levelRef.current as string;

  useEffect(() => {
    const levelParam = searchParams.get("level");
    if(levelParam) levelRef.current = levelParam;
    window.history.replaceState({}, '', '/study/quiz');
  }, []);

  useEffect(()=>{
    // const level의 값에 따라 axios
    // axios의 응답은 문제 5개
    const getQuestions = async () => {
      const response = await axios.get(`http://localhost:3000/api/v1/studies/exam?level=${level}`);
      setQuestions([
        response.data.quiz1,
        response.data.quiz2,
        response.data.quiz3,
        response.data.quiz4,
        response.data.quiz5
      ]);
      setAnswers([
        response.data.quiz1.answer,
        response.data.quiz1.answer,
        response.data.quiz1.answer,
        response.data.quiz1.answer,
        response.data.quiz1.answer
      ]);
      setSelected([0,0,0,0,0]);
    }
    getQuestions();
  },[level]);

  const handleSelectedAnswerFromQuiz = (data:{quizIndex:number, answer:number}) => {
    const tempSelected = selected;
    tempSelected[data.quizIndex] = data.answer;
    setSelected(tempSelected);
    console.log(tempSelected);
  };

  const markExam = () => {
    // router.replace(
    //   `/study/quiz/mark?answers=${JSON.stringify(answers)}\
    //       &selected=${JSON.stringify(selected)}`, "/study/quiz"
    // );
    router.replace(
      `/study/quiz/mark?answers=${JSON.stringify(answers)}\
          &selected=${JSON.stringify(selected)}`
    );
  }

  return (
    <div className='flex flex-col'>
      {/* 퀴즈 5개 불러와서 보여주기 (이미 푼 문제 중복 불허 여부 선택?강제?) */}
      <p>{level} 레벨 페이지</p>
      <div className='flex flex-row'>
        <GoBackTo/>
        <p className='border border-black'>금융 지식 퀴즈</p>
      </div>
      {/* 정해진 레벨에 따라 문제 무작위 5개 */}
      {
        questions.map((question, index)=>{
          return <Quiz data={question} selected={handleSelectedAnswerFromQuiz} key={index} quizIndex={index}/>
        })
      }
      <button onClick={markExam}
        type="button" title="채점창"
        className='border border-black'>
        <p>정답 확인하기</p>
      </button>
      <button onClick={()=>{router.back()}} type="button" title="레벨 선택창"
        className='border border-black'>
        <img alt="icon"/>
        <p>다른 레벨의 퀴즈에 도전해보고 싶다면?</p>
      </button>
    </div>
  )
}