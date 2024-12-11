import LinkToBracket from "../link-to/LinkToBracket";

const GameRules = () => {
  return (<>
    <LinkToBracket href="/" innerContents={
        <div className="flex items-center">
          <img src="/images/link-to/bulb.png" alt="icon"className="w-3.5 h-4"/>
          <p className="pl-2">게임 규칙 설명서</p>
        </div>
      }/>
    </>
  )
}

export default GameRules;