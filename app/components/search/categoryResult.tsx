import searchOneWord from "@/src/dictionary/search-by-keyword";
import { BaseSyntheticEvent } from "react";

interface ResultByCategory{
  "단어명":string;
  "영문한문":string;
  "뜻":string;
}

interface ResultBySearch{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}

interface Props{
  response:Array<ResultByCategory>;
  setMode:React.Dispatch<React.SetStateAction<string>>;
  setResponse: React.Dispatch<React.SetStateAction<ResultBySearch>>;
}

export default function CategoryResult ({response, setMode, setResponse}:Props){
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

  return (
    <div>
      <p>CategoryResult</p>
      {response && Array.isArray(response) && response.map((v,i)=>
        <button onClick={searchWord} className="border border-black w-full" key={i}>
          <div>
            <p className="word">{v.단어명}</p>
            <p>{v.영문한문}</p>
            <p>{v.뜻}</p>
          </div>
        </button>
      )}
    </div>
  )
}