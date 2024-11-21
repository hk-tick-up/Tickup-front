import { NextResponse } from 'next/server';

    // response
    // 1. 오늘의 단어: 단어, 영어, 설명
    // 2. 오늘의 퀴즈: 문제, 답안지

const newWord = (word:string, english:string, meaning:string) => {
  return {
    word: word,
    english: english,
    meaning: meaning
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group");
  
  // group: ㄱ~ㅎ, a~z 중 하나
  // 엘라스틱 서치에서 group 연관 단어를 찾아서 받아오기

  // 찾아온 단어 목록을 반환하기
  // {단어, 영단어, 의미(한 줄)} 목록 (사전 순서대로)
  const words = [];
  for(let i=1; i<=10; i++){
    words.push(newWord(`${group}단어${i}`, `영어${i}`, `의미${i}`));
  }
  try {
    return NextResponse.json(
      {
        length: words.length,
        words: words
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "서버 에러" },
      { status: 500 }
    );
  }
}