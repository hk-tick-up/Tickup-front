'use client';

import TodayWord from "@/app/components/search/todayWord"
import Search from "@/app/components/search/search"
import TodayQuiz from "@/app/components/search/todayQuiz";
import MoveToQuiz from "@/app/components/search/moveToQuiz";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudyMainpage() {
  const base_url = "http://localhost:3000/api/v1/studies"
  const [todayQuiz, setTodayQuiz] = useState(null);
  const [todayWord, setTodayWord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    (async () => {
      try{
        const response = await axios(`${base_url}/today`);
        // console.log(response.data);
        const quiz = response.data.todayquiz;
        const word = response.data.todayword;
        setTodayQuiz(quiz);
        setTodayWord(word);
      }catch(error){
        console.error(error);
      }finally{
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return(
    <div>
      <Search/>
      {todayWord && <TodayWord data={todayWord}/>}
      {todayQuiz && <TodayQuiz data={todayQuiz}/>}
      <MoveToQuiz/>
    </div>
  );
}