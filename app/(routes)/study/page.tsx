import TodayWord from "@/app/components/search/todayWord"
import Search from "../../components/search/search"
import TodayQuiz from "@/app/components/search/todayQuiz";
import MoveToQuiz from "@/app/components/search/moveToQuiz";

export default function StudyMainpage() {
  return(
    <div>
      <Search/>
      <TodayWord/>
      <TodayQuiz/>
      <MoveToQuiz/>
    </div>
  );
}