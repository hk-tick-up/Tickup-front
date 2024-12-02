import { ReactNode } from "react";
import LinkTo from "./linkTo";

export default function LinkToBracket({href, innerContents}:{href:string, innerContents:ReactNode}){
  return (
    <LinkTo href={href} innerContents={
      <div className="flex justify-between items-center">
        {innerContents}
        <img className="w-2 h-3" src="/images/linkTo/rightAngleBracket.png" alt="bracket"/>
      </div>
    }/>

  )
}