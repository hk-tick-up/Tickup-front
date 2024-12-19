'use client';

import searchOneWord from "@/src/dictionary/search-by-keyword";
// import axios from "axios";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

interface ComponentProps {
  setMode: React.Dispatch<React.SetStateAction<string>>;
  setResponse: React.Dispatch<React.SetStateAction<OneWord>>
}
interface OneWord{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}

export default function ByKeyword({setMode, setResponse}:ComponentProps){
  const [keyword, setKeyword] = useState("");
  // const base_url = "http://localhost:9200/dictionary/_search?pretty";
  // const base_url = process.env.NEXT_PUBLIC_ELASTICSEARCH_URL;

  const onKeywordChanged = (e:BaseSyntheticEvent) => {
    setKeyword(e.currentTarget.value);
  }
  const onSearchClicked = async (e:BaseSyntheticEvent) => {
    e.preventDefault();
    setResponse(await searchOneWord(keyword));
    setMode("search");
  }
  return (
    <div className="w-full h-full">
      <form className="flex border border-gray rounded-lg p-1 w-full h-full">
        <input className="w-full" onChange={onKeywordChanged} type="text" placeholder="검색할 단어"></input>
        <button onClick={onSearchClicked} title="searchButton">
          <div className="bg-black rounded-lg w-9 h-7 flex items-center justify-center">
            <Image src="/images/dictionary/ic-search.png" alt="검색버튼" width={20} height={20}/>
          </div>
        </button>
      </form>
    </div>
  )
}