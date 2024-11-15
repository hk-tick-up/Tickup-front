import ByConsonants from "./byConsonants";
import ByKeyword from "./byKeyword";

export default function Search(){
  return(
    <div>
      Search
      <ByKeyword/>
      <ByConsonants/>
    </div>
  );
}