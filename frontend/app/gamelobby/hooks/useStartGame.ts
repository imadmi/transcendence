'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { useEffect } from 'react';
import {
	ConnectionStatus,
	MatchmakingStatus,
	addToLobby,
	aiDifficulty,
	setConnectionStatus,
	setMatchmaking,
	setupAIMatch,
	startConnection,
} from '../GlobalRedux/features';
import { MatchType } from '@/interfaces';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const connection = useSelector((state: RootState) => state.connection);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);
	//! Modal shouldn't be fetched by using getElementById

	//* Connect user to socket server and start matchmaking
	const initSocketPushGame = (matchType: MatchType, inviteeID?: string) => {
		console.log('initSocketPushGame called');
		dispatch(startConnection());
		dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? handleAIMatch()
			: dispatch(addToLobby({ matchType, inviteeID })) && showModal();
	};

	//* User is connected to socket server and start matchmaking
	const pushToGame = (matchType: MatchType) => {
		showModal();
		if (connection.isInMatchmaking === MatchmakingStatus.SEARCHING) return null;
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
		dispatch(addToLobby(matchType));
	};

	const showModal = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.showModal();
	};

	const closeModal = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.close();
	};

	const handleAIMatch = () => {
		dispatch(setupAIMatch(gameConfig));
	};

	//* This useEffect hook will redirect the user to the game page
	//* if the isGameStarted state is true
	useEffect(() => {
		if (connection.isGameStarted) {
			closeModal();
			router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby/game`);
		}
	}, [connection.isGameStarted, router]);

	return {
		initSocketPushGame,
		pushToGame,
	};
};

export default useStartGame;
