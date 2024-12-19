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
    <div className="w-full h-full">
      {response && Array.isArray(response) && response.map((v,i)=>
        <button onClick={searchWord} className="w-full mt-2" key={i}>
          <div className="flex flex-col border border-white border-b-black p-1 pb-3">
            <div className="flex flex-row gap-x-3 pb-2">
              <p className="text-blue-500 font-bold word text-left w-fit whitespace-nowrap">{v.단어명}</p>
              <p className="text-gray-400 font-bold text-left">{v.영문한문}</p>
            </div>
            <p className="text-left">{v.뜻}</p>
          </div>
        </button>
      )}
    </div>
  )
}