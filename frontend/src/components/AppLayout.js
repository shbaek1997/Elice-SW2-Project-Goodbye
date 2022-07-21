import React from 'react';
import styled from '@emotion/styled';
import 'antd/dist/antd.css';
import Footer from './Footer';
import Header from './Header';

const AppLayout = ({ children }) => {
	return (
		<Wrapper>
			<Header />
			{children}
			<Footer />
		</Wrapper>
	);
};

export default AppLayout;

const Wrapper = styled.div`
	min-height: 100vh;
	position: relative;
	padding-bottom: 200px;
	font-family: 'Noto Sans KR', sans-serif;
`;
