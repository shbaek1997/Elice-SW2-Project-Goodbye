import { css } from '@emotion/react';
import AppLayout from '../components/AppLayout';
import Image from 'next/image';

const WillDetail = () => {
	return (
		<AppLayout>
			<div css={adBoxStyle}>
				<div css={adContentStyle}>
					<h2>나의 유언장</h2>
				</div>
				<div css={imageStyle}>
					<Image
						src="https://images.unsplash.com/photo-1528752477378-485b46bedcde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdGFtZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
						alt="나의 유언장"
						layout="fill"
					/>
				</div>
			</div>
			<main css={mainWrapper}>
				<section css={willsectionWrapper}>
					<div css={headerWrapper}>
						<div>
							제목 <input type="text" name="title" />
						</div>
						<div>
							유언장을 보낼 사람 이메일{' '}
							<input type="button" value="선택" />
						</div>
						<div>
							유언장을 받을 사람 이메일{' '}
							<input type="button" value="선택" />
						</div>
					</div>
					<div css={letterWrapper}>
						<textarea
							name="content"
							placeholder="유언장을 자유롭게 작성해주세요."
						/>
					</div>
					<div css={buttonWrapper}>
						{/* <div>
                            <input type="button" value="취소" />
                            <input type="submit" value="생성" />
                        </div> */}
						<div>
							<input type="button" value="삭제" />
							<input type="submit" value="수정" />
						</div>
					</div>
				</section>
			</main>
		</AppLayout>
	);
};

const mainWrapper = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
`;
const willsectionWrapper = css`
	position: relative;
	min-width: 80vw;
	min-height: 150vh;
	border: 1px solid #d1dbb1;
	margin: 0 auto 5rem;
	padding: 5rem;
`;

const headerWrapper = css`
	width: 100%;
	margin: 0 auto;
	font-size: 1rem;

	& > div > input {
		background: transparent;
		border: none;
		border-bottom: solid 1px #193441;
		margin: 10px;
		:focus {
			outline: none;
		}
	}
`;

const letterWrapper = css`
	display: inline-block;
	box-sizing: border-box;
	width: 100%;
	height: 100vh;
	border: 1px solid #d1dbb1;
	margin: 1rem auto;
	padding: 5rem;
	background-color: #d1dbbd;

	& > textarea {
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		:focus {
			outline: none;
		}
	}
`;

const buttonWrapper = css`
	width: 100%;
	margin-top: 3rem;
	& > div > input[type='submit'] {
		margin-right: 2%;
		background-color: #3e606f;
	}

	& > div > input {
		float: right;
		background-color: #91aa9d;
		color: white;
		border: none;
		width: 5rem;
		padding: 10px;
		border-radius: 1rem;
	}
`;

const adBoxStyle = css`
	display: flex;
	width: 100%;
	height: 30rem;
	margin: 10rem 0;
	padding: 2rem;
	align-item: center;
	&:nth-of-type(even) {
		flex-direction: row-reverse;
	}
`;

const adContentStyle = css`
	width: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const imageStyle = css`
	position: relative;
	width: 50%;
	line-height: 10rem;
	background-color: silver;
`;
export default WillDetail;
