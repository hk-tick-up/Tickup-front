'use client';

import axios from "axios";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

interface ComponentProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setResponse: React.Dispatch<React.SetStateAction<OneWord>>
}
interface OneWord{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}

export default function ByKeyword({setShow, setResponse}:ComponentProps){
  const [keyword, setKeyword] = useState("");
  const base_url = "http://localhost:9200/dictionary/_search?pretty";

  const onKeywordChanged = (e:BaseSyntheticEvent) => {
    setKeyword(e.currentTarget.value);
  }
  const onSearchClicked = async (e:BaseSyntheticEvent) => {
    // keyword로 (유사)단어 검색

    const input = keyword;
    e.preventDefault();
    console.log(input);

    const searchQuery = {
      "query": {
        "match": {
          "단어명": input
        }
      },
      "_source": ["단어명", "영문한문", "설명", "연관단어"]
    };
    const header = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await axios.post(`${base_url}`,searchQuery,header);
    const hits = response.data.hits.hits;
    if(hits.length > 0){
      // 검색된 단어 있음
      const word = hits[0]._source;
      setResponse({
        "단어명":word.단어명,
        "영문한문":word.영문한문,
        "설명":word.설명,
        "연관단어":word.연관단어
      })
    }
    else{
      // 검색된 단어 없음
      setResponse({
        "단어명":"",
        "영문한문":"",
        "설명":"검색 결과가 없습니다.",
        "연관단어":""
      })
    }
    setShow(true);
  }
  return (
    <div>
      <form className="flex border border-black p-1 w-fit h-fit">
        <input onChange={onKeywordChanged} type="text" placeholder="검색할 단어"></input>
        <button onClick={onSearchClicked} title="searchButton">
          <div className="bg-black rounded-lg w-9 h-7 flex items-center justify-center m-1">
            <Image src="/images/dictionary/ic-search.png" alt="검색버튼" width={20} height={20}/>
          </div>
        </button>
      </form>
    </div>
  )
}