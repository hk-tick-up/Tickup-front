'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function searchResult(){
  const searchParams = useSearchParams();
  const singleParam = searchParams.get('data');
  const response = JSON.parse(singleParam as string).data;

  const [mode, setMode] = useState('');

  useEffect(()=>{
    console.log(response);
    
    switch(response.mode){
      case "keyword":
        setMode('keyword');
        break;
      case "category":
        setMode('category');
        break;
      default:
    }
  });

  return (
    <>
      {mode === "keyword" &&
        <>
        <div>by keyword</div>
        <div>{response.self.word}</div>
        <div>{response.self.english}</div>
        <div>{response.self.description}</div>
        <div>relate words</div>
        </>
      }
      {mode === "category" &&
        <div>by category</div>
      }
      {mode === "" &&
        <div>wrong access</div>
      }
    </>
  );
}