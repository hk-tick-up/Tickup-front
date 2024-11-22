// app/components/BottomNav.tsx

'use client';

import Image from "next/image";

import '../css/BottomNav.css'

import studyImage from '../../public/images/금융 학습.png';
import communityImage from '../../public/images/커뮤니티.png';
import gameImage from '../../public/images/투자 게임.png';
import homeImage from '../../public/images/Home.png';
import myImage from '../../public/images/My.png';
import { BaseSyntheticEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BottomNav(data:{page:string}) {
  const router = useRouter();
  // CSS filter generator by Barrett Sonntag
  // #09D2CF
  // const MINT = 'invert(62%) sepia(98%) saturate(1682%) hue-rotate(132deg) brightness(99%) contrast(93%)';
  // #000000
  const BLACK = 'invert(0%) sepia(100%) saturate(0%) hue-rotate(7deg) brightness(95%) contrast(102%)';
  // #0F6A49
  const GREEN = 'invert(27%) sepia(18%) saturate(2802%) hue-rotate(116deg) brightness(103%) contrast(88%)';

  const BASECOLOR = GREEN;

  // 접속한 페이지에 따라 버튼 색상 변경
  useEffect(() => {
    const thisButton = document.querySelector(`#${data.page}`) as HTMLButtonElement;
    changeColor(thisButton);
  },[]);

  const changeColor = (target:HTMLButtonElement) => {
    const imgTag = target.firstElementChild as HTMLImageElement;
    const imgs:HTMLCollection = (target.parentElement as HTMLElement).children;

    for (const elem of imgs) {
      const imgFromElem = elem.firstElementChild as HTMLImageElement;
      const pFromElem = elem.lastElementChild as HTMLParagraphElement;
      let color;
      if(imgFromElem == imgTag){
        color = BASECOLOR;
      }
      else {
        color = BLACK;
      }
      imgFromElem.style.filter = color;
      pFromElem.style.filter = color;
    }
  }

  // 선택한 메뉴로 이동
  const selectMenu = (e:BaseSyntheticEvent) => {
    // changeColor(e.currentTarget);
    const nextPage:string = e.currentTarget.getAttribute("id");
    if(nextPage === data.page) return;

    console.log(`move to ${nextPage}`);
    switch(nextPage){
      case "home":
        router.push("/");
        break;
      case "game":
        router.push("/");
        break;
      case "study":
        router.push("/");
        break;
      case "community":
        router.push("/");
        break;
      case "my":
        router.push("/my");
        break;
      default:
    }
  };

  return (
    <footer id='navigate' className="flex items-center justify-between p-4">
      <button id='study' className='tab' onClick={selectMenu}>
        <Image   className='img' src={studyImage} alt="금융 학습"/>
        <p className='tabName'>금융 학습</p>
      </button>
      <button id='game' className='tab' onClick={selectMenu}>
        <Image className='img' src={gameImage} alt="투자 게임"/>
        <p className='tabName'>투자 게임</p>
      </button>
      <button id='home' className='tab' onClick={selectMenu}>
        <Image className='img' src={homeImage} alt="Home"/>
        <p className='tabName'>Home</p>
      </button>
      <button id='community' className='tab' onClick={selectMenu}>
        <Image className='img' src={communityImage} alt="커뮤니티"/>
        <p className='tabName'>커뮤니티</p>
      </button>
      <button id='my' className='tab' onClick={selectMenu}>
        <Image className='img' src={myImage} alt="My"/>
        <p className='tabName'>My</p>
      </button>
    </footer>
  );
}