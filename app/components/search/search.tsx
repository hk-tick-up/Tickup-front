import { useState } from "react";
import ByConsonants from "./byConsonants";
import ByKeyword from "./byKeyword";
import SearchResult from "./searchResult";
import CategoryResult from "./categoryResult";

interface ResultBySearch{
  "단어명":string;
  "영문한문":string;
  "설명":string;
  "연관단어":string;
}
interface ResultByCategory{
  "단어명":string;
  "영문한문":string;
  "뜻":string;
}

export default function Search(){

  const [mode, setMode] = useState<string>("");
  const [searchResponse, setSearchResponse] = useState<ResultBySearch>();
  const [categoryResponse, setCategoryResponse] = useState<Array<ResultByCategory>>();

  return(
    <div>
      Search
      <ByKeyword setMode={setMode} setResponse={setSearchResponse as React.Dispatch<React.SetStateAction<ResultBySearch>>} />
      <ByConsonants setMode={setMode} setResponse={setCategoryResponse as React.Dispatch<React.SetStateAction<Array<ResultByCategory>>>} />
      {(mode === "search") && <SearchResult response={searchResponse as ResultBySearch}  setMode={setMode} setResponse={setSearchResponse as React.Dispatch<React.SetStateAction<ResultBySearch>>} />}
      {(mode === "category") && <CategoryResult response={categoryResponse as Array<ResultByCategory>} setMode={setMode} setResponse={setSearchResponse as React.Dispatch<React.SetStateAction<ResultBySearch>>} />}
    </div>
  );
}