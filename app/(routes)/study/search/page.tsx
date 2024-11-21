'use client';

import Search from '@/app/components/search/search';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

type Word = {
  word: string;
  english: string;
  meaning: string;
  description: string;
};
type Response = {
  mode: string,
  self: {
    length: number,
    words: Word[]
  }
}

export default function SearchResult(){
  const searchParams = useSearchParams();
  // const response = JSON.parse(searchParams.get('data') as string);
  const [response, setResponse] = useState<Response>({
    mode: "",
    self: {
      length: 0,
      words: []
    }
  });

  const [mode, setMode] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setResponse(parsed);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }
  }, [searchParams]);

  useEffect(()=>{
    switch(response.mode){
      case "keyword":
        setMode('keyword');
        break;
      case "category":
        setMode('category');
        setWords(response.self.words);
        break;
      default:
    }
  });

  // useEffect(()=>{
  //   switch(mode){
  //     case "keyword":
  //       break;
  //     case "category":
  //       console.log(mode);
  //
  //       break;
  //     default:
  //   }
  // }, [mode])

  return (
    <>
    <Search/>
      {mode === "keyword" &&
        <>
        <div>by keyword</div>
        <div>{response.self.words[0].word}</div>
        <div>{response.self.words[0].english}</div>
        <div>{response.self.words[0].description}</div>
        <div>relate words</div>
        </>
      }
      {mode === "category" &&
        <>
        <div>by category</div>
        <div className='flex flex-col'>
          {
            words.map((v,i)=><button key={i}><div className='border border-black'>
              <div className='flex flex-row justify-center'>
                <p>{v.word}</p>
                <p>{v.english}</p>
              </div>
              <p>{v.meaning}</p>
            </div></button>)
          }
        </div>
        </>
      }
      {mode === "" &&
        <div>wrong access</div>
      }
    </>
  );
}