'use client';

import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react"

type User = ({
  id:string,
  password:string,
  nickname:string,
  age:number,
  gender:string,
  job:string
})

export default function MyInfo(){
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>({id:"",password:"",nickname:"",age:0,gender:"",job:""});

  const getUserInfo = () => {
    //localhost
    axios.get("http://localhost:8000/api/v1/users/userinfo",
      {headers: {Authorization: `Bearer ${sessionStorage.getItem("bearer")}`}}
    ).then(response => {
      console.log(response.data);
      setUser({
        id:response.data.id,
        password:"",
        nickname:response.data.nickname,
        age:response.data.age,
        gender:response.data.gender,
        job:response.data.job
      })

    }).catch(error => {
      console.error(error);
    });
  }

  const onSubmitPassword = (e:BaseSyntheticEvent) => {
    e.preventDefault();
    // axios password
    const formElement = e.target.closest('form');
    axios.post("http://localhost:8000/api/v1/users/verifypassword",
      {password: formElement.password.value}, 
      {headers: {Authorization: `Bearer ${sessionStorage.getItem("bearer")}`}}
    ).then(response => {
      console.log(response);
      setAuthenticated(response.data);

      getUserInfo();
    }).catch(error =>{
      console.error(error);
    });
  }

  const onInfoSubmit = (e:BaseSyntheticEvent) => {
    e.preventDefault();

    const formElement = e.target.closest('form');
    const data = {
      nickname: formElement.nickname.value,
      password: formElement.password.value
    };
    console.log(data);

    axios.put("http://localhost:8000/api/v1/users/userinfo", data,
      {headers:{Authorization:`Bearer ${sessionStorage.getItem("bearer")}`}}
    )
    .then(response => {
      console.log(response.data);

      alert("정보가 수정되었습니다.");

      // My 화면으로 리다이렉트
      router.push('/my');  // 페이지 이동
    })
    .catch(error => {
      console.error(error);
    });
  }

  const blankHandler = () => {
    // value를 지정한 Controlled Component는 onChange 핸들러를 필요로 한다.
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      password: e.target.value, // 변경된 password 값 반영
    }));
  };
  
  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      nickname: e.target.value, // 변경된 nickname 값 반영
    }));
  };

  return (
    <div className="px-5 w-full">
      MyInfo
      비밀번호 확인 / 카톡 인증 후 수정 가능
      {
        authenticated ?
          <div className="flex flex-col items-center">
            <div className="border border-black p-2 w-2/3 max-w-xl min-w-xs">
              <form onSubmit={onInfoSubmit} className="flex flex-col items-center space-y-2 w-full">
                <div className="w-full px-2">
                  <label htmlFor="userId" className="inline-block w-20 text-right pr-2">ID</label>
                  <input value={user.id} id="userId" type="text" placeholder=" user id" className="border border-black w-full max-w-52" onChange={blankHandler} disabled/>
                </div>
                <div className="w-full px-2">
                  <label htmlFor="password" className="inline-block w-20 text-right pr-2">password</label>
                  <input value={user.password} id="password" type="password" placeholder=" password" className="border border-black w-full max-w-52" onChange={onPasswordChange}/>
                </div>
                <div className="w-full px-2">
                  <label htmlFor="nickname" className="inline-block w-20 text-right pr-2">nickname</label>
                  <input value={user.nickname} id="nickname" type="text" placeholder=" nickname" className="border border-black w-full max-w-52" onChange={onNicknameChange}/>
                </div>
                <div className="w-full px-2">
                  <label htmlFor="age" className="inline-block w-20 text-right pr-2">age</label>
                  <input value={user.age} id="age" type="number" className="border border-black w-full max-w-52" max={200} min={0} onChange={blankHandler} disabled/>
                </div>
                <div className="w-full px-2">
                  <label htmlFor="gender" className="inline-block w-20 text-right pr-2">gender</label>
                  <select id="gender" className="border border-black w-full max-w-52" onChange={blankHandler} disabled>
                    <option value="" disabled>성별</option>
                    <option value="MALE">남자</option>
                    <option value="FEMALE">여자</option>
                  </select>
                </div>
                <div className="w-full px-2">
                  <label htmlFor="job" className="inline-block w-20 text-right pr-2">job</label>
                  <input value={user.job} id="job" type="text" placeholder=" job" className="border border-black w-full max-w-52" onChange={blankHandler} disabled/>
                </div>
                <button type="submit" title="정보 수정" value="정보 수정" className="border border-black m-2 p-2">정보 수정</button>
                <div>
                  <p>* ID는 변경할 수 없습니다.</p>
                  <p>* 나이, 성별, 직업을 변경하시려면 문의를 남겨 주세요.</p>
                </div>
              </form>
            </div>
          </div>
        : <div className="flex flex-col items-center">
            <p>인증 후 정보를 수정할 수 있습니다.</p>
            <form onSubmit={onSubmitPassword} className="border border-black p-2 flex flex-col items-center w-2/3 max-w-xl min-w-xs">
              <div>
                <label htmlFor="password" className="pr-2">비밀번호</label>
                <input type="password" id="password" placeholder="비밀번호" className="border border-black"/>
              </div>
              <button type="submit" title="입력" className="bg-[#EEF2F5] rounded-[15px] px-[15px] py-[10px] mt-2">정보 수정하기</button>
            </form>
          </div>
      }
    </div>
  )
}