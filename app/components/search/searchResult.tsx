interface OneWord{
  response:{
    "단어명":string;
    "영문한문":string;
    "설명":string;
    "연관단어":string;
  }
}

export default function SearchResult({response}:OneWord){
  console.log(response);
  // 연관단어로 다시 한번 axios해서 단어명, 영문한문, 뜻 수신할 것
  return (
    <div>SearchResult
      <p>{response.단어명}</p>
      <p>{response.영문한문}</p>
      <p>{response.설명}</p>
      <p>{response.연관단어}</p>
    </div>
  )
}