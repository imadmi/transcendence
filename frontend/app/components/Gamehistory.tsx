'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User, MatchHistory } from '../AppContext';
import { RiPingPongLine } from 'react-icons/ri';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { GrGroup } from 'react-icons/gr';
import { FaUserFriends } from 'react-icons/fa';
import { GrAchievement } from 'react-icons/gr';
import { MdLeaderboard } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { CiLogout } from 'react-icons/ci';
import { usePathname } from 'next/navigation';
import { FaCircleDot } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegMinusSquare } from 'react-icons/fa';
import { FaRegSquarePlus } from 'react-icons/fa6';

export const Gamehistory = ({ intraId }: { intraId: string | undefined }) => {
	const [GameResult, setGameResult] = useState<MatchHistory[] | undefined>(
		undefined,
	);

	useEffect(() => {
		const Gamehistory = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/Gamehistory/${intraId}`,
					{
						credentials: 'include',
					},
				);
				const data = await response.json();
				if (!response.ok) {
					return;
				}

				if (data.success === false) {
					return;
				}
				setGameResult(data.Gamehistory);
			} catch (error) {
				console.log(error);
			}
		};
		Gamehistory();
	}, [intraId]);

	return (
		<div className="flex items-center justify-center text-gray-400 w-full mt-10 p-10 overflow-hidden">
			<div className="border border-gray-600 bg-[#292D39] bg-opacity-70 rounded-md w-full md:w-[700px] lg:w-[800px] h-[400px] p-4 ">
				<div className="mt-1 font-bold text-gray-300">GAME HISTORY</div>
				<div className="mt-5 border-b border-zinc-500 "></div>
				<div className="p-5 w-full h-[300px] overflow-x-hidden">
					{GameResult &&
						GameResult.toReversed().map((game: any, index: any) => {
							return (
								<div
									key={index}
									className="flex flex-row mb-3 bg-[#292D39] bg-opacity-80 items-center  rounded-md justify-center  w-full "
								>
									<div className="w-full p-2 flex flex-row justify-center ">
										<div className="w-1/3 flex flex-row items-center">
											<div className="">
												<img
													src={game.user1Avatar}
													className="ml-2  hidden md:inline w-10 h-10  rounded-full"
												></img>
											</div>
											<div className="text-gray-300 text-sm m-2">{game.user1Login}</div>
										</div>
										<div className="w-1/3 p-2 m-2 h-10 flex flex-col items-center justify-center">
											{intraId !== game.winnerId ? (
												<div className="text-gray-200 text-sm flex flex-row">
													<div className="text-gray-200 text-sm">{game.score[1]}&nbsp;</div>
													<FaRegSquarePlus size="20" className="text-green-500" />
													<div className="text-gray-200 text-sm">&nbsp;{game.score[0]}</div>
												</div>
											) : (
												<div className=" text-gray-200 text-sm flex flex-row">
													<div className="text-gray-200 text-sm">{game.score[1]}&nbsp;</div>
													<FaRegMinusSquare size="20" className="text-red-500" />
													<div className="text-gray-200 text-sm">&nbsp;{game.score[0]}</div>
												</div>
											)}
											<div className="text-xs mt-1">{game.matchDate.split('T')[0]}</div>
										</div>
										<div className="flex flex-row justify-end items-center w-1/3">
											<div className="text-gray-200 text-sm m-2">{game.user2Login}</div>
											<div className="">
												<img
													src={game.user2Avatar}
													className="mr-2 hidden md:inline w-10 h-10 rounded-full"
												></img>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};
