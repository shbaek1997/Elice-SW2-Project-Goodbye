import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import axios from 'axios';
const Accept = () => {
	const router = useRouter();
	const [urlToken, setUrlToken] = useState('');

	const sendConfirmation = useCallback(() => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');

		axios
			.patch(
				`/api/auth/${userId}/confirmation?token=${urlToken}`,
				{ userId, urlToken },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				alert(
					'성공적으로 생사여부를 판단해 줄 신뢰하는 사람으로 확정했습니다.',
				);
				Router.replace('/');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	useEffect(() => {
		if (!router.isReady) return;
		if (router.query.token) {
			setUrlToken(router.query.token);
		}
	}, [router.isReady]);

	return (
		<AppLayout>
			<div css={mainWrapper}>
				<section css={sectionWrapper}>
					<h1>
						확정하시면 생사여부 변경을 하실 수 있고 사망시 유언장을
						전송됩니다.
					</h1>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button onClick={sendConfirmation}>확정</Button>
					</div>
				</section>
			</div>
		</AppLayout>
	);
};

export default Accept;

const mainWrapper = css`
	display: flex;
	justify-content: center;
	width: 100%;
	// height: 85vh;
	margin: 10em auto; //추가
`;

const sectionWrapper = css`
	// width: 25em; //longer than signin
	// margin: auto;
`;
