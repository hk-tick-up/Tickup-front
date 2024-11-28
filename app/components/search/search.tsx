import { useEffect, useState } from "react";
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
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [showCategoryResult, setShowCategoryResult] = useState<boolean>(false);
  // 한 단어의 자세한 설명을 가지거나 여러 단어의 간단한 뜻을 가지거나
  const [response, setResponse] = useState<ResultBySearch|Array<ResultByCategory>>();

  // 두 컴포넌트 중 최대 1개만 활성화 가능
  useEffect(()=>{
    if(showSearchResult) setShowCategoryResult(false);
  },[showSearchResult])
  useEffect(()=>{
    if(showCategoryResult) setShowSearchResult(false);
  },[showCategoryResult])

  return(
    <div>
      Search
      <ByKeyword setShow={setShowSearchResult} setResponse={setResponse as React.Dispatch<React.SetStateAction<ResultBySearch>>} />
      <ByConsonants setShow={setShowCategoryResult} setResponse={setResponse as React.Dispatch<React.SetStateAction<Array<ResultByCategory>>>} />
      {showSearchResult && <SearchResult response={response as ResultBySearch}/>}
      {showCategoryResult && <CategoryResult response={response as Array<ResultByCategory>}/>}
    </div>
  );
}