'use client';

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

export default function ByKeyword(){
  const [keyword, setKeyword] = useState("");
  const base_url = "http://localhost:3000/api/v1/studies";
  const router = useRouter();

  const onKeywordChanged = (e:BaseSyntheticEvent) => {
    setKeyword(e.currentTarget.value);
    console.log(e);
    
  }
  const onSearchClicked = async (e:BaseSyntheticEvent) => {
    // keyword로 (유사)단어 검색

    const input = e.currentTarget.parentElement.firstElementChild;
    e.preventDefault();
    // console.log(input);
    // console.log(input.value);

    const response = await axios.get(`${base_url}/search/keyword?query=${input.value}`);
console.log(response.data);

    const body = response.data;
    // response
    // 0. keyword
    // 1. (유사)단어, 영단어, 설명
    // 2. 연관단어 목록(단어, 영단어, 설명)
    // (연관단어: 단어의 설명 중 사전에 등록된 단어)

    // 단어 페이지로 리다이렉트
    const params = new URLSearchParams({
      data: JSON.stringify(response.data)
    });
    router.push(`/study/search?${params.toString()}`);
  }
  return (
    <div>
      <form className="flex border border-black p-1 w-fit h-fit">
        <input onChange={onKeywordChanged} type="text" placeholder="검색할 단어"></input>
        <button onClick={onSearchClicked} title="searchButton"><Image src="/images/Home.png" alt="검색버튼" width={32} height={32}/></button>
      </form>
    </div>
  )
}