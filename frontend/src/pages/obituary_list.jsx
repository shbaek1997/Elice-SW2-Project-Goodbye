import AppLayout from '../components/AppLayout';
import Image from 'next/image';
import Link from 'next/link';
import { css } from '@emotion/react';
import { Pagination, Empty } from 'antd';
import 'antd/dist/antd.css';
import { Button } from './../util/common_styles';
// import chrysanthemum from '/images/chrysanthemum.jpg';

const ObituaryList = () => {
	return (
		<AppLayout>
			<div css={titleImageStyle}>
				<p>부고 리스트</p>
			</div>
			<div css={listWrapper}>
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					imageStyle={{
						height: 60,
					}}
					description={
						<span>
							부고 내역이 없습니다. 간편하게 작성하고
							공유해보세요.
						</span>
					}
				>
					<Link href={'/obituary_detail'}>
						<Button type="primary" style={{ marginTop: '2em' }}>
							작성하기
						</Button>
					</Link>
				</Empty>
			</div>
			{/* <Pagination defaultCurrent={1} total={50} /> */}
		</AppLayout>
	);
};

export default ObituaryList;

const listWrapper = css`
	margin: 2rem;
	padding: 5rem;
`;
const titleImageStyle = css`
	position: relative;
	width: 100%;
	height: 300px;
	margin: 2rem 0;
	background-image: url('https://images.unsplash.com/photo-1618927483829-2d16941299e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1486&q=80');
	background-repeat: no-repeat;
	background-size: cover;
	text-align: center;

	& > p {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 1.5rem;
	}
`;
