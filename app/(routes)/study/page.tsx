'use client';

import BottomNav from "@/app/components/BottomNav";
import Search from "@/app/components/search/search"
// import TodayWord from "@/app/components/search/todayWord"
// import TodayQuiz from "@/app/components/search/todayQuiz";
// import MoveToQuiz from "@/app/components/search/moveToQuiz";
import { useEffect, useState } from "react";
// import axios from "axios";

export default function StudyMainpage() {
  // const base_url = "http://localhost:3000/api/v1/studies"

  // const [todayQuiz, setTodayQuiz] = useState(null);
  // const [todayWord, setTodayWord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    (async () => {
      try{
        // 오늘의 컨텐츠(단어, 퀴즈) 받기
        // const response = await axios(`${base_url}/today`);

        // const quiz = response.data.todayquiz;
        // const word = response.data.todayword;
        // setTodayQuiz(quiz);
        // setTodayWord(word);
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
      {/* {todayWord && <TodayWord data={todayWord}/>}
      {todayQuiz && <TodayQuiz data={todayQuiz}/>}
      <MoveToQuiz/> */}
      <br/><br/><br/><br/><br/><br/>
      <BottomNav/>
    </div>
  );
}