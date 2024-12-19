"use client";

import axios from "axios";
import { BaseSyntheticEvent, useState } from "react";

interface ComponentProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setResponse: React.Dispatch<React.SetStateAction<Array<simpleWord>>>;
}
interface simpleWord{
  "단어명":string;
  "영문한문":string;
  "뜻":string;
}
interface WordInOrder{
  sort: string[];
  _id: string;
  _ignored: string[];
  _index: string;
  _score: number | null;
  _source: {
    단어명: string;
    영문한문: string;
    뜻: string;
  };
}

export default function ByConsonants({setMode, setResponse}:ComponentProps) {
  const [language, setLanguage] = useState<boolean>(true);
  const consonants = new Map<string, string>([
    ["ㄱ","[가-깋].*"],["ㄴ","[나-닣].*"],["ㄷ","[다-딯].*"],["ㄹ","[라-맇].*"],["ㅁ","[마-밓].*"],["ㅂ","[바-빟].*"],["ㅅ","[사-싷].*"],
    ["ㅇ","[아-잏].*"],["ㅈ","[자-짛].*"],["ㅊ","[차-칳].*"],["ㅋ","[카-킿].*"],["ㅌ","[타-팋].*"],["ㅍ","[파-핗].*"],["ㅎ","[하-힣].*"],
    ["a","a.*"],["b","b.*"],["c","c.*"],["d","d.*"],["e","e.*"],["f","f.*"],["g","g.*"],["h","h.*"],["i","i.*"],
    ["j","j.*"],["k","k.*"],["l","l.*"],["m","m.*"],["n","n.*"],["o","o.*"],["p","p.*"],["q","q.*"],["r","r.*"],
    ["s","s.*"],["t","t.*"],["u","u.*"],["v","v.*"],["w","w.*"],["x","x.*"],["y","y.*"],["z","z.*"]
  ]);
  const korean = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
  const english = "abcdefghijklmnopqrstuvwxyz";
  // const base_url = "http://localhost:9200/dictionary/_search?pretty"
  const ELASTICSEARCH_URL = process.env.NEXT_PUBLIC_ELASTICSEARCH_URL;
  const base_url = `${ELASTICSEARCH_URL}/dictionary/_search?pretty`;

  const onSwitchLanguage = () => {
    setLanguage(!language);
  };

  const onClickSearch = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    const button:HTMLButtonElement = e.currentTarget;
    console.log(consonants.get(button.innerText));

    const body = {
      "query": {
        "regexp": {
          "단어명.keyword": {
            "value": consonants.get(button.innerText),
            "case_insensitive": true
          }
        }
      },
      "_source": ["단어명", "영문한문", "뜻"],
      "sort": [
        {"단어명.keyword": "asc"}
      ],
      "size":1000
    }
    const header = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios.post(base_url, body, header)
    .then((response)=>{
      const data:WordInOrder[] = response.data.hits.hits;
      console.log(data);
      // setResponse, setShow
      const arr = new Array<simpleWord>();
      data.map((value)=>{
        arr.push(value._source);
      })
      console.log(arr);
      setResponse(arr);
      setMode("category");
    })
    .catch((error)=>{
      console.error(error);
    })
  }

  return (
    <div className="flex space-x-1 my-2">
      <button title="switchLanguage" onClick={onSwitchLanguage} className="w-10 h-6 border border-gray-100 bg-gray-100 rounded-md">가/A</button>
      
      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {language ? 
            [...korean].map((element, index)=>(
              <button key={index} title="category" onClick={onClickSearch} className="w-6 h-6 border border-gray-100 bg-gray-100 rounded-md">{element}</button>
            ))
          :
            [...english].map((element, index)=>(
              <button key={index} title="category" onClick={onClickSearch} className="w-6 h-6 border border-gray-100 bg-gray-100 rounded-md">{element}</button>
            ))
          
        }
      </div>
    </div>
  );
}
