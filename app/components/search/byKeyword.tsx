'use client';

import Image from "next/image";

export default function ByKeyword(){
  const onSearchClicked = () => {

  }
  return (
    <div>
      <form className="flex border border-black p-1 w-fit h-fit">
        <input onChange={onSearchClicked} type="text" placeholder="검색할 단어"></input>
        <button title="searchButton"><Image src="/images/Home.png" alt="검색버튼" width={32} height={32}/></button>
      </form>
    </div>
  )
}