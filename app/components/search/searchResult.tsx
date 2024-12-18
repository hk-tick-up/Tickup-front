'use client';

import searchOneWord from "@/src/dictionary/search-by-keyword";
import { BaseSyntheticEvent, useEffect, useState } from "react";

interface Props{
  response: OneWord;
  setMode:React.Dispatch<React.SetStateAction<string>>;
  setResponse: React.Dispatch<React.SetStateAction<OneWord>>;
}
interface OneWord{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}

export default function SearchResult({response, setMode, setResponse}:Props){
  const [relate, setRelate] = useState<string>(response.연관단어);
  const [relateWords, setRelateWords] = useState<Array<string>>();
  const [wordInfos, setWordInfos] = useState<Array<OneWord>>();

  useEffect(()=>{
    if(relate) {
      setRelateWords([...relate.split(", ")]);
    }
    setWordInfos([]);
  },[relate]);

  useEffect(()=>{
    console.log("response has changed");
    console.log(response);
    setRelate(response.연관단어);
  },[response]);
  
  useEffect (()=>{
    if(relateWords){
      const fetchWordInfos = async () => {
        const arr: OneWord[] = [];
        
        for (let i = 0; i < relateWords.length; i++) {
          const wordInfo = await searchOneWord(relateWords[i]);
          arr.push(wordInfo);
        }

        setWordInfos(arr);
      };

      fetchWordInfos();
    }
    
  },[relateWords]);

  const searchWord = async(e:BaseSyntheticEvent) => {
    e.preventDefault();
    const button:HTMLButtonElement = e.currentTarget;
    const word = button.querySelector(".word");
    console.log(word?.textContent);
    if(word?.textContent){
      setResponse(await searchOneWord(word.textContent));
      setMode("search");
    }
  };
  
  // 연관단어로 다시 한번 axios해서 단어명, 영문한문, 뜻 수신할 것
  return (
    <div>SearchResult
      <p>{response.단어명}</p>
      <p>{response.영문한문}</p>
      <p>{response.설명}</p>

      {
        response.연관단어 && <p>연관단어: {response.연관단어}</p>
      }
      {/* 연관단어 개수에 따라 0~n개 단어 나열 (단어명,영문한문,설명) */}
      {
        // relateWords.map()
        wordInfos && wordInfos.map((v,i)=>
          <button onClick={searchWord} className="w-full" key={i}>
            <div>
              <hr/>
              <p className="word">{v.단어명}</p>
              <p>{v.영문한문}</p>
              <p>{v.설명.split(".")[0]+"."}</p>
            </div>
          </button>
        )
      }
    </div>
  )
}