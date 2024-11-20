import { NextResponse } from 'next/server';

    // response
    // 1. 오늘의 단어: 단어, 영어, 설명
    // 2. 오늘의 퀴즈: 문제, 답안지

export async function GET() {
  try {
    return NextResponse.json(
      {
        todayword: {
          word: "오늘의단어",
          english: "todayword",
          description: "단어 설명"
        },
        todayquiz: {
          quiznumber: "1",
          quiz: "오늘의문제",
          answers: {
            1: "선택지1",
            2: "선택지2",
            3: "선택지3",
            4: "선택지4"
          },
          answer: 1
        }
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json(
      { message: "생성 완료", data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "잘못된 요청" },
      { status: 400 }
    );
  }
}