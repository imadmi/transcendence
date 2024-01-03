// components/Chat.tsx
'use client';
import { BiConversation } from "react-icons/bi";
import { useEffect, useState, useRef, useContext, use } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { Room, useAppContext, User } from '../AppContext';
import PrivateRoom from './[roomId]/page';
import { Navbar, Sidebar } from '../profile/[intraId]/page';
import { Toaster } from 'react-hot-toast';
import { ImBubbles2 } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import Link from "next/link";


export async function getRooms(userId: string): Promise<Room[]> {
  const res = await fetch(`http://localhost:3001/chat/${userId}/privateRooms/`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  
  });
  const room = await res.json();
  return room;
}

export const FriendsCard = () => {
  const context = useAppContext();
  const users = context.friendsData.friends;
  const roomIdExtractor =(user1:string, user2:string) => {
    return parseInt(user1) > parseInt(user2)?user1+user2:user2+user1;
  }
  const creatRoomEvent = (user:User) => {
    context.setRecipientLogin(user.intraId);
    context.socket?.emit('createPrivateRoom', { user1:context.userData?.intraId, user2:user.intraId });
  }
  return (
    <div>
      {users.map((user:User, index:number) => (
          <Link
          onClick={()=>creatRoomEvent(user)}
          href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomIdExtractor(context.userData?.intraId, user.intraId)}`}
          key={index}
          >
        <div key={index} className="flex items-center text-xs p-3  my-1 hover:bg-gray-800 ">
          <div className="flex  flex-col space-y-2 text-white  max-w-xs mx-2 order-2 items-start">
            <div><span className='hidden sm:block'>{user?.login}</span></div>
            {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
          </div>
          <Image width={50} height={50} src={user.Avatar} alt="My profile" className="w-10 sm:w-10 h-10 sm:h-10 rounded-full" />
        </div>
          </Link>
      ))}
    </div>
  );
}
export const ConversationCard = ({room}:any) => {
  const context = useAppContext();
  const roomName = room.name;
  console.log(room);
  const user = context.friendsData.friends.find((user:User) => user.intraId === room.participantsIds[0]);
  return (
    <Link
    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomName}`}
    >
    <div onClick={()=>context.setRecipientLogin(user.intraId)} className="flex items-center p-3 text-xs  my-1 hover:bg-gray-800 ">
      <div className="flex  flex-col space-y-2 text-white  max-w-xs mx-2 order-2 items-start">
        <div><span className='hidden sm:block'>{user?.login}</span></div>
        {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
      </div>
      <Image width={50} height={50} src={user.Avatar} alt="My profile" className="w-10 sm:w-10 h-10 sm:h-10 rounded-full" />
    </div>
    </Link>
  );
}

const SearchStart = () => {
  return (
    <div className="flex items-center p-2 my-1 border-4">
      <input type='button' placeholder='find or start a new conversation' />
    </div>
  );
}
export const ConversationNotSelected = () => {
  return (
    <div className="flex  flex-1 flex-col items-center justify-center p-2 my-1  w-screen">
      <BiConversation className="h-40 w-40  " />
      <h1> no Conversation has been selected</h1>
    </div>
  );
}
export const PermissionDenied = () => {
  return (
    <div className="flex  flex-1 flex-col items-center justify-center p-2 my-1  w-screen">
      <CgDanger className="h-40 w-40  " />
      <h1> Permission Denied</h1>
    </div>
  );
}
export const Conversations = () => {
  const context = useAppContext();
  const [selected, setSelected] = useState<string>('messages');
  const activeRoom = Array.isArray(context.rooms)? context.rooms.map((room:Room) => {
    room.participantsIds = room.participantsIds.filter((id:string) => id !== context.userData?.intraId);
    return room;
  }):[];
  activeRoom.sort((a:Room, b:Room) => {
    return a.updated_at > b.updated_at ? -1 : 1;});
  const style = {borderBottom: "1px solid gray"};
  return (
    <div  className=" w-1/5 flex flex-col h-full p-4">
    {/* <SearchStart /> */}
      {/* <h1 className='text-center text-lg text-white hidden sm:block'>Conversations</h1> */}
      <div className='flex justify-center py-3'>
        <ImBubbles2
        style={selected === 'messages'?style:{}}
        onClick={()=>{
          selected !== 'messages' && setSelected('messages');
        }}
        className='h-8 w-1/3'
        />
        <MdGroups
        style={selected === 'channels'?style:{}}
         onClick={()=>{
          selected !== 'channels' && setSelected('channels');
        }}
        className='h-8 w-1/3' />
        <BsPersonLinesFill
        style={selected === 'onlineFriends'?style:{}}
         onClick={()=>{
          selected !== 'onlineFriends' && setSelected('onlineFriends');
        }}
        className='h-8 w-1/3 ' />
      </div>
      {
        selected === 'messages' &&
        <div>
        {activeRoom?.map((room:any, index:any) => (
          <ConversationCard key={index} room={room} />
          ))}
      </div>
        }
        {
        selected === 'onlineFriends' &&
        <FriendsCard />
        }
    </div>
  );
};

const ProfileInfo = () => {
  return (
    <div className="border w-1/5 xl:hidden">
      <h1>Profile Info</h1>
    </div>
  );
}
const Chat = () => {
  const context = useAppContext();
  let trigger = 1;
  useEffect(() => {
    const fetchDataAndSetupSocket = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const userData = await response.json();
        context.setUserData(userData);
        const response2 = await fetch(`http://localhost:3001/users/${userData.intraId}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const friends = await response2.json();
        const rooms = await getRooms(userData.intraId);
        context.setRooms(rooms);
        const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
        if (!context.socket) {
          const newSocket = io(chatNameSpace, {
            query: { userId: userData.intraId },
          });
          context.setSocket(newSocket);
        }
        context.setFriends(friends);
        if (context.recipientUserId && context.socket) {
          context.socket?.emit('createPrivateRoom', { user1:context.userData?.intraId, user2:context.recipientUserId });
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    };
    fetchDataAndSetupSocket();
    context.socket?.on('privateChat', () => {
      trigger++;
      fetchDataAndSetupSocket();
    })
    return () => {
      context.socket?.disconnect();
    };
  }, [context.socket, trigger]);
  // useEffect(() => {
  //   const rooms:Room[] = [];
  //   if (context.socket && context.recipientUserId){
  //     const roomId = parseInt(context.userData?.intraId) > parseInt(context.recipientUserId)?context.userData?.intraId+context.recipientUserId:context.recipientUserId+context.userData?.intraId;
  //     context.socket.on('privateChat',()=>{
        
  //     })
  //   }
  // } , [context.socket]);
  // console.log(context.rooms);
  return (
    <div className=" min-h-screen w-screen  bg-[#12141A]">
    <Navbar isProfileOwner={false} />
    <div className="flex ">
      {context.isSidebarVisible && (
        <div className="w-16 custom-height ">
          <div
            className={`transition-all duration-500 ease-in-out ${
              context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
      <div className="flex custom-height">
      <Conversations />
      {/* { context.recipientUserId && (parseInt(context.userData?.intraId) > parseInt(context.recipientUserId)
      ?<PrivateRoom  params={{roomId: context.userData?.intraId+context.recipientUserId}} />
      :<PrivateRoom  params={{roomId: context.recipientUserId + context.userData?.intraId}} />)} */}
      <ConversationNotSelected />
      {/* <ProfileInfo></ProfileInfo> */}
    </div>
      </div>
    </div>
    <Toaster />
  </div>
  );
};


export default Chat;