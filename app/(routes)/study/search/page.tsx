'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";

export default function searchResult(){
  const searchParams = useSearchParams();
  // const data = JSON.parse(router.query.data as string);
  const singleParam = searchParams.get('data');

  useEffect(()=>{
    console.log(JSON.parse(singleParam as string));
    
  });

  // const renderContent = () => {
  //   switch (data[0]) {
  //     case "keyword":
  //       return <div></div>;
  //     case "category":
  //       return <div></div>;
  //     default:
  //       return null;
  //     }
  // }

  return (
    <>
      renderContent()
      <br/>
      {singleParam}
    </>
  );
}