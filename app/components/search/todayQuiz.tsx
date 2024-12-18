import { BaseSyntheticEvent } from "react";

type TodayQuizType = {
  quiznumber: number;
  quiz: string;
  answers: {
    [key: number]: string
  };
  answer: number;
}

export default function TodayQuiz({data}:{data: TodayQuizType}) {
  // 무작위 단어 axios

  // console.log(data);
  if (!data || !data.answers) {
    return <div>Loading...</div>;
  }

  // data.answer: 정답은 선택지1
  
  
  // 오늘의 퀴즈는 진행도 체크 제외

  const changeChoicesColor = (target:HTMLButtonElement, buttons:HTMLCollection, color:string) => {
    for(let i=0; i<buttons.length; i++){
      const button = buttons.item(i) as HTMLButtonElement;
      if(target === button)
        button.style.border = "2px solid "+color;
      else
        button.style.border = "";
    }
  };
  const onButtonClick = (e:BaseSyntheticEvent) => {
    const target = e.target;
    const buttons: HTMLCollection = target.parentElement.children;
    const answer = data.answer.toString();

    if(e.target.name === answer){
      changeChoicesColor(target, buttons, "green");
    }
    else{
      changeChoicesColor(target, buttons, "red");
    }
    
  }

  return (
    <div className="border border-black">
      <img alt="icon"/>
      <div>오늘의 퀴즈</div>
      <p>문제ID: {data.quiznumber}</p>
      <p>문제: {data.quiz}</p>
      <div className="flex flex-col">
        {data && Object.entries(data.answers).map(([key, value]) => (
          <button onClick={onButtonClick} key={key} name={key}>{key}: {value}</button>
        ))}
      </div>
      <div>{}</div>
    </div>
  );
}

