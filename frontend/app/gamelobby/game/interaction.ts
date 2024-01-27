'use cleint';
import { Direction } from '@/interfaces';
import { mouseMove, movePaddle } from '@/app/gamelobby/GlobalRedux/features';
import { MutableRefObject } from 'react';
import { Dispatch } from 'redux';

const updateDirection = (
	newDirection: Direction,
	dispatch: Dispatch<AnyAction>,
	currentDirection: MutableRefObject<Direction>,
) => {
	if (newDirection !== currentDirection.current) {
		dispatch(movePaddle({ direction: newDirection }));
		currentDirection.current = newDirection;
	}
};

export const handleKeyDown = (
	dispatch: Dispatch<AnyAction>,
	currentDirection: MutableRefObject<Direction>,
	e: KeyboardEvent,
) => {
	let newDirection: Direction;

	switch (e.key) {
		case 'w':
			newDirection = Direction.UP;
			break;
		case 's':
			newDirection = Direction.DOWN;
			break;
		default:
			return;
	}

	// Call updateDirection with individual arguments
	updateDirection(newDirection, dispatch, currentDirection);
};

export const handleKeyUp = (
	dispatch: Dispatch<AnyAction>,
	currentDirection: MutableRefObject<Direction>,
	e: KeyboardEvent,
) => {
	if (
		(e.key === 'w' && currentDirection.current === Direction.UP) ||
		(e.key === 's' && currentDirection.current === Direction.DOWN)
	) {
		// Call updateDirection with individual arguments
		updateDirection(Direction.STOPPED, dispatch, currentDirection);
	}
};

export const handleMouseMove = (
	dispatch: Dispatch<AnyAction>,
	e: MouseEvent,
	canvasRef: React.RefObject<HTMLDivElement>,
) => {
	if (canvasRef.current) {
		const canvasBounds = canvasRef.current.getBoundingClientRect();
		const relativeYPos = e.clientY - canvasBounds.top;

		console.log('relativeYPos: ', relativeYPos);

		dispatch(mouseMove({ yPos: relativeYPos }));
	}
};
