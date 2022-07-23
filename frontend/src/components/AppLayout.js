import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import 'antd/dist/antd.css';
import Footer from './Footer';
import Header from './Header';
import useMousePosition from './UseMousePosition';

const AppLayout = ({ children }) => {
	const [ref, left, top] = useMousePosition();

	useEffect(() => {
		//console.log(left);
	}, [left, top]);

	return (
		<Wrapper ref={ref}>
			<Header />
			{children}
			<Footer />
			<Cursor left={left} top={top} />
		</Wrapper>
	);
};

export default AppLayout;

const Wrapper = styled.div`
	z-index: 2;
	min-height: 100vh;
	position: relative;
	padding-bottom: 200px;
	font-family: 'Noto Sans KR', sans-serif;
	background-color: #fff;
`;

const Cursor = styled.div`
	z-index: -1;
	position: absolute;
	top: ${(props) => props.top}px;
	left: ${(props) => props.left}px;
	width: 150px;
	height: 150px;
	border-radius: 75em;
	filter: blur(1em);
	background-color: #e8e8e8;
	transform: translate(-50%, -50%);
`;
