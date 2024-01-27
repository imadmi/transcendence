'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User } from '../AppContext';
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

export const Sidebar = () => {
	const [RouterName, setRouterName] = useState('profile');
	const pathname = usePathname();

	const context = useAppContext();

	// console.log("isSidebarVisible", context.isSidebarVisible);
	//   useEffect(() => {
	//     context.setisSidebarVisible(window.innerWidth > 768);
	//   }, []);

	const getFriends = async () => {
		try {
			if (context.user?.intraId) {
				const response: any = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.user.intraId}/freindrequest`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					},
				);
				const data = await response.json();
				if (data.success === true && data.empty == false) {
					context.setnotif(true);
				}
				if (data.success === true && data.empty == true) {
					context.setnotif(false);
				}
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	const handleFriendshipRequest = () => {
		getFriends();
	};

	const listenForFriendships = () => {
		if (context.notifSocket !== null) {
			context.notifSocket.on('FriendShipRequest', handleFriendshipRequest);
		}
	};

	useEffect(() => {
		if (context.notifSocket) {
			listenForFriendships();
		}
	}, [context.user, context.notifSocket]);

	useEffect(() => {
		const segments = pathname.split('/');
		setRouterName(segments[1]);
	}, [pathname]);

	useEffect(() => {
		const checkJwtCookie = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
					{
						method: 'GET',
						credentials: 'include',
					},
				);
				var data: User = await response.json();

				if (data !== null) {
					context.setUser(data);
				}
			} catch (error: any) {
				const msg = 'Error during login' + error.message;
				toast.error(msg);
				console.error('Error during login:', error);
			}
		};
		checkJwtCookie();
	}, []);

	return (
		<div>
			{context.isSidebarVisible && (
				<div className="z-50 w-16 custom-height ">
					<div
						className={`transition-all duration-500 ease-in-out ${
							context.isSidebarVisible ? 'w-16 opacity-100' : 'w-0 opacity-0'
						}`}
					>
						<div className="relative custom-height bg-[#292D39] ">
							<div className="absolute buttom-0 left-0 bg-[#292D39]">
								<div className=" custom-height fixed text-black bg-[#292D39]">
									<ul className="list-none text-center justify-center items-center w-[64px] bg-[#292D39]">
										<div className="flex flex-col justify-between custom-height bg-[#292D39]">
											<div className="">
												<li className="">
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${context.user?.intraId}`}
														className={`${
															context.user === null
																? 'pointer-events-none'
																: 'pointer-events-auto'
														}
                    `}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<CgProfile
																size="30"
																className={`${
																	RouterName === 'profile'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8
                        `}
															/>
														</motion.div>
													</Link>
												</li>
												<li className="relative">
													<motion.div
														whileTap={{ scale: 0.8 }}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.01 }}
													>
														<Link
															href={`${process.env.NEXT_PUBLIC_API_URL}:3000/notif`}
														>
															<IoMdNotificationsOutline
																size="30"
																className={`${
																	RouterName === 'notif'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
															{context.notif && (
																<div className="absolute top-0 right-4 flex items-end">
																	<FaCircleDot
																		size="14"
																		className="text-red-600 opacity-80 animate-ping"
																	/>
																</div>
															)}
														</Link>
													</motion.div>
												</li>
												<li>
													<motion.div
														whileTap={{ scale: 0.8 }}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.01 }}
													>
														<Link
															href={`${process.env.NEXT_PUBLIC_API_URL}:3000/leaderboard`}
														>
															<MdLeaderboard
																size="30"
																className={`${
																	RouterName === 'leaderboard'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</Link>
													</motion.div>
												</li>
												<li>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/friends`}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<FaUserFriends
																size="30"
																className={`${
																	RouterName === 'friends'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
												<li>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels`}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<GrGroup
																size="30"
																className={`${
																	RouterName === 'channels'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
												<li>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat`}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<IoChatbubblesOutline
																size="30"
																className={`${
																	RouterName === 'chat'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
												<li>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby`}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<RiPingPongLine
																size="30"
																className={`${
																	RouterName === 'play'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
											</div>
											<div>
												<li
													onClick={() => console.log('cfsdfaf')}
													className=" "
												>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<CiLogout
																size="30"
																className={`text-slate-400 mx-auto m-8 hover:text-red-400`}
															/>
														</motion.div>
													</Link>
												</li>
											</div>
										</div>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};