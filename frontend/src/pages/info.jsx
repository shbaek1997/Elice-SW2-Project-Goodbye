import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { css } from '@emotion/react';

const Accept = () => {
	return (
		<AppLayout>
			<div css={mainWrapper}>
				<section css={sectionWrapper}>
					<h1>Project GoodBye</h1>
					<div>
                        <p>유언장, 어떤 이미지가 떠오르시나요?<br/>
                            마지막에 대한 무거움, 갈등의 대상과 법적 효력의 딱딱함. 저희가 떠올린 이미지는 이러합니다.<br/>
                            조금 더 편안한 분위기로, 소중한 사람들에게 추억과 감정을 공유할 수 있는 서비스를 생각했습니다.<br/>
                        </p>
                        <p>마지막을 앞두지 않아도, 가족이 아닌 사람에게도, 언제든 누구에게든 편하게 글을 남길 수 있습니다.<br/>
                            고인이 된 이후에 작성된 유언장들은 이메일을 통해 수신자에게 전달됩니다.<br/>
                            남겨진 사람들은 추모 페이지를 통해 고인에 대한 그리움과 추억을 공유할 수 있어요.<br/>
                        </p>
                        <br/>
                        <h3>사용자는 유언장을 작성할 수 있습니다.</h3>
                        <p>
                            여러장의 유언장을 작성할 수 있고, 한 유언장을 여러명에게 전달 할 수 있습니다.<br/>
                            작성한 유언장의 내용과 수신자는 언제든지 수정 및 삭제가 가능합니다.
                        </p>
                        <h3>고인의 추모 공간이 마련됩니다.</h3>
                        <p>
                            고인이 생전에 서비스의 회원이었다면, 개별 추모 페이지가 생성됩니다.<br/>
                            고인으로부터 유언장을 전달받은 사람이라면 누구나 추모의 글을 남길 수 있습니다.<br/>
                            오랜 시간이 지나도 고인을 추억할 수 있도록 영구히 저장됩니다.<br/>
                        </p>
                        <h3>메일 기반 서비스입니다.</h3>
                        <p>
                            유저가 고인이 되면 유언장과 추모 페이지는 미리 지정한 수신자에게 이메일로 전송됩니다.<br/>
                            유저가 사망 처리를 맡길 유저를 이메일로 초대 및 등록할 수 있습니다. <br/>           
                        </p>
                        <p>
                            <a href="https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/wikis/%EA%B8%B0%ED%9A%8D">
                            기획 바로가기 </a>
                         | <a href="https://kdt-gitlab.elice.io/sw_track/class_02_seoul/web_project_2/team11/project-goodbye/-/blob/dev/server/swagger.yaml">
                            API 문서 바로가기</a>
                        </p>
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 70vw;

    & > h1 {
        font-weight: 600;
    }
`;
