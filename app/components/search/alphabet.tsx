import { BaseSyntheticEvent } from "react";

export default function Alphabet(){
  const consonants = "abcdefghijklmnopqrstuvwxyz";
  const conso_array = [...consonants];

  const onSearchByConsonant = (e:BaseSyntheticEvent) => {
    // bottomnav 참고해서 타겟 잡고
    // inner 값 확인해서 자동적으로 axios
    e.preventDefault();
    console.log(e.currentTarget.innerText);
    
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