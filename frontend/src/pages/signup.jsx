import { css } from '@emotion/react';

export default function Signup() {
    return (
        <main css={mainWrapper}>
            <section css={sectionWrapper}>
                <div css={headerWrapper}>
                    <h2>회원가입</h2>
                </div>
                <div css={inputWrapper}>
                    <input type="text" placeholder="이메일" name="email" />
                    <input type="text" placeholder="이름" name="fullname" />
                    <input
                        type="text"
                        placeholder="생년월일"
                        name="dateofbirth"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        name="passwordConfirmation"
                    />

                    <span>
                        <input type="checkbox" />
                        약관에 동의합니다.
                    </span>
                </div>
                <div css={buttonWrapper}>
                    <input type="submit" value="회원가입" />
                    <input type="button" value="취소" />
                </div>
            </section>
        </main>
    );
}

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

    & > span {
        margin: 10px 0 30px 0;
        float: left;
    }
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
