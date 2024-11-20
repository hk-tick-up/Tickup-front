type TodayWordType = {
  word: string;
  english: string;
  description: string;
}

export default function TodayWord({data}:{data: TodayWordType}) {
  // 무작위 단어 axios
  console.log(data);
  

  return (
    <div className="border border-black">
      <img alt="icon"/>
      <p>오늘의 단어</p>
      <p>단어: {data.word}</p>
      <p>영어: {data.english}</p>
      <p>설명: {data.description}</p>
    </div>
  );
}