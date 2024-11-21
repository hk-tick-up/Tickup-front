import { NextResponse } from 'next/server';

    // response
    // 1. 오늘의 단어: 단어, 영어, 설명
    // 2. 오늘의 퀴즈: 문제, 답안지

export async function GET() {
  try {
    return NextResponse.json(
      {
        quiz1: {
          quiznumber: "11",
          quiz: "문제1",
          answers: {
            1: "선택지1",
            2: "선택지2",
            3: "선택지3",
            4: "선택지4"
          },
          answer: 1
        },
        quiz2: {
          quiznumber: "12",
          quiz: "문제2",
          answers: {
            1: "선택지1",
            2: "선택지2",
            3: "선택지3",
            4: "선택지4"
          },
          answer: 1
        },
        quiz3: {
          quiznumber: "13",
          quiz: "문제3",
          answers: {
            1: "선택지1",
            2: "선택지2",
            3: "선택지3",
            4: "선택지4"
          },
          answer: 1
        },
        quiz4: {
          quiznumber: "14",
          quiz: "문제4",
          answers: {
            1: "선택지1",
            2: "선택지2",
            3: "선택지3",
            4: "선택지4"
          },
          answer: 1
        },
        quiz5: {
          quiznumber: "15",
          quiz: "문제5",
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