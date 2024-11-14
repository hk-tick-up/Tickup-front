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

export default function BottomNav() {
  // CSS filter generator by Barrett Sonntag
  // #09D2CF
  // const MINT = 'invert(62%) sepia(98%) saturate(1682%) hue-rotate(132deg) brightness(99%) contrast(93%)';
  // #000000
  const BLACK = 'invert(0%) sepia(100%) saturate(0%) hue-rotate(7deg) brightness(95%) contrast(102%)';
  // #0F6A49
  const GREEN = 'invert(27%) sepia(18%) saturate(2802%) hue-rotate(116deg) brightness(103%) contrast(88%)';

  const BASECOLOR = GREEN;

  // 첫 실행 시 홈 버튼 색상 변경
  useEffect(() => {
    const homeButton = document.querySelector('#home') as HTMLElement;
    if (homeButton instanceof HTMLElement) {
      const imgFromElem = homeButton.firstElementChild as HTMLImageElement;
      const pFromElem = homeButton.lastElementChild as HTMLParagraphElement;

      if(homeButton !== null)
        imgFromElem.style.filter = BASECOLOR;
        pFromElem.style.filter = BASECOLOR;
    }
  },[]);

  // 색상 변경
  const selectMenu = (e:BaseSyntheticEvent) => {
    const imgTag = e.currentTarget.firstElementChild;
    const imgs = e.currentTarget.parentElement.children;

    for (const elem of imgs) {
      const imgFromElem = elem.firstElementChild;
      const pFromElem = elem.lastElementChild;
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
  };

  return (
    <footer id='navigate' className="flex items-center justify-between p-4">
      <button className='tab' onClick={selectMenu}>
        <Image   className='img' src={studyImage} alt="금융 학습"/>
        <p className='tabName'>금융 학습</p>
      </button>
      <button className='tab' onClick={selectMenu}>
        <Image className='img' src={gameImage} alt="투자 게임"/>
        <p className='tabName'>투자 게임</p>
      </button>
      <button id='home' className='tab' onClick={selectMenu}>
        <Image className='img' src={homeImage} alt="Home"/>
        <p className='tabName'>Home</p>
      </button>
      <button className='tab' onClick={selectMenu}>
        <Image className='img' src={communityImage} alt="커뮤니티"/>
        <p className='tabName'>커뮤니티</p>
      </button>
      <button className='tab' onClick={selectMenu}>
        <Image className='img' src={myImage} alt="My"/>
        <p className='tabName'>My</p>
      </button>
    </footer>
  );
}