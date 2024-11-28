import axios from "axios";
import { BaseSyntheticEvent } from "react";

export default function Korean(){
  const consonants = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ";
  const conso_array = [...consonants];

  const base_url = "http://localhost:3000/api/v1/studies";

  const onSearchByConsonant = async (e:BaseSyntheticEvent) => {
    // bottomnav 참고해서 타겟 잡고
    // inner 값 확인해서 자동적으로 axios

    const button = e.currentTarget;
    e.preventDefault();
    // console.log(button.innerText);

    const response = await axios.get(`${base_url}/search/category?group=${button.innerText}`);
    console.log(response.data);
    // response
    // 0. category
    // 1. 카테고리에 속한 단어 목록
    //   - 단어, 영문한문, 뜻
  }

  return(
  <div>
    {
      conso_array.map((element, index)=>(
        <button key={index} title="category" onClick={onSearchByConsonant} className="w-6 h-6 border border-black">{element}</button>
      ))
    }
  </div>
  )
}