
import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IoIosArrowBack,
         IoIosArrowForward
} from 'react-icons/io'; 


function getPageNumbers(currPage, pageCount) {
    const resultPages = [];
    resultPages.push(currPage);
    const paginationNum = pageCount >= 5 ? 5 : pageCount; 

    let idx = 1;

    // 5 미만의 숫자일 때 그 숫자까지만 페이지 네이션 되게 만들기
    while(resultPages.length < paginationNum) {
        if (currPage + idx <= pageCount) resultPages.push(currPage + idx);
        if (currPage - idx > 0) resultPages.unshift(currPage - idx);
        idx++;
    }
    return resultPages;
}


const Pagination = ({ currPage, pageCount, onClickPage }) => {
    return (
        <Container>
            <Button
                disabled={currPage === 1}
                onClick={() => onClickPage(currPage - 1)}
            >
                <IoIosArrowBack />
            </Button>
            {getPageNumbers(currPage, pageCount).map((page) => {
                return (
                    <Button
                        onClick={() => onClickPage(page)}
                        key={`pagination-button-${page}`}
                        active={currPage === page}
                    >
                        {page}
                    </Button>
                )
            })}
            <Button
                disabled={currPage === pageCount }
                onClick={() => onClickPage(currPage + 1)}
            >
                <IoIosArrowForward />
            </Button>
        </Container>
    )
}

export default Pagination;


const Container = styled.div`
    text-align: center;
    margin-top: 3rem;
    button:not(button:first-of-type) {
        margin-left: 1.5rem;
    }
`

const Button = styled.button`
    width: 2rem;
    height: 2rem;   
    border: none;
    color: #3E606F;
    background-color: #D1DBBD;
    &[disabled] {
        cursor: not-allowed;
    }
    ${props => props.active && css`
        background-color: #32606F;
        color: #F9FAFC;
    `}
`

// const ArrowButton = styled.button`
//     color: #3E606F;
//     background-color: #D1DBBD;
// `