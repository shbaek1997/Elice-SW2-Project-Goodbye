import { useCallback, useRef, useState } from 'react';

const useMousePosition = () => {
	// const [mousePosition, setMousePosition] = useState({
	// 	left: 0,
	// 	top: 0,
	// });

	const [left, setLeft] = useState(0);
	const [top, setTop] = useState(0);

	const handleMouseMove = useCallback(
		(e) => (
			// setMousePosition({
			// 	left: e.pageX,
			// 	top: e.pageY,
			// }),
			setLeft(e.pageX), setTop(e.pageY)
		),
	);

	const ref = useRef();

	const callbackRef = useCallback(
		(node) => {
			if (ref.current) {
				ref.current.removeEventListener('mousemove', handleMouseMove);
			}

			ref.current = node;

			if (ref.current) {
				ref.current.addEventListener('mousemove', handleMouseMove);
			}
		},
		[handleMouseMove],
	);

	return [callbackRef, left, top];
};

export default useMousePosition;
