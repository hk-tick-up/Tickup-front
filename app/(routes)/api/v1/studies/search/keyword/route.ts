import { NextResponse } from 'next/server';

    // response
    // 0. keyword
    // 1. (유사)단어, 영단어, 설명
    // 2. 연관단어 목록(단어, 영단어, 설명)
    // (연관단어: 단어의 설명 중 사전에 등록된 단어)

export async function GET() {
  try {
    return NextResponse.json(
      { 
        data: {
          mode: "keyword",
          self: {
            word: "some word",
            english: "in english",
            description: "description of word"
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
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
    return NextResponse.json(
      { message: "잘못된 요청" },
      { status: 400 }
    );
  }
}