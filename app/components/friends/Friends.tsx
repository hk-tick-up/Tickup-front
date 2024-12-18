/* eslint-disable @typescript-eslint/no-unused-vars */
import { logout } from "@/app/utils/logout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import Modal from "../Modal";

type friend = {
  id: string;
  nickname: string;
}

// 친구 목록
const Friends = () => {
  const BACKEND_USER_URL = process.env.NEXT_PUBLIC_BACKEND_USER_URL;

  const base_url = `${BACKEND_USER_URL}`;
  const [friends, setFriends] = useState<Array<friend>>([]);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileOwner, setProfileOwner] = useState<friend&{point: number}>({id:"-", nickname:"-", point:0});

  useEffect(()=>{
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.get(`${base_url}/friends`,header)
    .then(response => {
      setFriends(response.data);
    }).catch(error=>{
      console.error(error);
    })
  },[]);

  const deleteFriend = (e:BaseSyntheticEvent, friendId: string) => {
    e.preventDefault();
    const buttonElement: HTMLButtonElement = e.target;
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.delete(`${base_url}/friends/${friendId}`, header)
    .then(response => {
      console.log(response.data);
      buttonElement.innerText = "삭제 완료";
      buttonElement.disabled = true;
    }).catch(error => {
      console.error(error);
    })
  }

  const showFriendProfile = (e:BaseSyntheticEvent, userId:string) => {
    e.preventDefault();
    const header = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("bearer")}`
      }
    };
    axios.get(`${base_url}/profile/${userId}`, header)
    .then(response => {
      console.log(response.data);
      setProfileOwner(response.data);
      setIsProfileOpen(true);
    }).catch(error => {
      console.error(error);
    })
  }
  const onProfileClosed = () => {
    setIsProfileOpen(false);
  }

  return (
    <>
      <div title="친구 목록">
        <p>친구 목록</p>
        { friends.length > 0 ?
          friends.map((value, index)=>
          <div className="flex flex-row justify-between" key={index}>
            <button onClick={e => showFriendProfile(e, value.id)}>친구 닉네임: {value.nickname}</button>
            <button onClick={e => deleteFriend(e, value.id)}>친구 삭제</button>
          </div>
        ):<p>친구 요청을 보내 보세요</p>}
      </div>
      <Modal isOpen={isProfileOpen} onClose={onProfileClosed}>
        <div>
          <p>id: {profileOwner.id}</p>
          <p>nickname: {profileOwner.nickname}</p>
          <p>point: {profileOwner.point}</p>
        </div>
      </Modal>
    </>
  )
}

export default Friends;