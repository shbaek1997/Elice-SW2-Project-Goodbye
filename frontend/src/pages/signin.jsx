import { css } from '@emotion/react';

const SignIn = () => {
	return (
		<main css={mainWrapper}>
			<section css={sectionWrapper}>
				<div css={headerWrapper}>
					<h2>로그인</h2>
				</div>
				<div css={inputWrapper}>
					<input type="text" placeholder="이메일" name="email" />
					<input
						type="password"
						placeholder="비밀번호"
						name="password"
					/>
				</div>
				<div css={forgetWrapper}>비밀번호 찾기</div>
				<div css={buttonWrapper}>
					<input type="submit" value="로그인" />
					<input type="button" value="구글로그인" />
				</div>
			</section>
		</main>
	);
};

const mainWrapper = css`
	display: flex;
	justify-content: center;
	width: 100%;
	height: 85vh;
`;

const sectionWrapper = css`
	width: 20em;
	margin: auto;
`;

const headerWrapper = css`
	width: 30%;
	margin: 0 auto;
`;

const inputWrapper = css`
    display: flex;
    flex-direction: column;
    width: 100%
    line-height: 3rem;

    & > input {
        background: transparent;
        border: none;
        border-bottom: solid 1px #193441;
        line-height: 1.5rem;
        margin: 10px 0;
        
    }
`;

const forgetWrapper = css`
	text-align: right;
	color: #91aa9d;
	margin: 10px 0px 50px;
`;

const buttonWrapper = css`
	width: 100%;

	& > input[type='submit'] {
		margin-right: 2%;
		background-color: #3e606f;
	}

	& > input {
		background-color: #91aa9d;
		color: white;
		border: none;
		width: 49%;
		padding: 10px;
	}
`;

export default SignIn;
