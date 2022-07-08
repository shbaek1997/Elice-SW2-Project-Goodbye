import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';

import Link from 'next/link';

import {
    Button,
    Container,
    Form,
    Nav,
    Navbar,
    NavDropdown,
    Offcanvas
} from 'react-bootstrap';



const navButtonStyle = css`
    border: none;
    color: #3E606F;
    background-color: #D1DBBD;
    &:hover {
        background-color: #91AA9D;
    }
`

const navBtnGroupStyle = css`
    flex-grow: 2;
    margin: 0 50px;
    Button:first-of-type {
      margin-right: 20px;  
    }
`

const navStyle = css`
    flex-grow: 3;
`

const formStyle = css`
    flex-grow: 3;
`

const navBarStyle = css`
    width: calc(100% - 100px);
`

const logoStyle = css`
    width: 100px;
    color: #3E606F;
`

const menuStyle = css`
    padding: 0.5rem;  
    color: rgba(0,0,0,.55);                                                          
`       



const NavBar = () => {
    const [isLogIn, setIsLogIn] = useState(false);

    return (
        <>
            <Navbar bg="light" expand="md" className="mb-3">
                <Container fluid>
                    <Navbar.Brand><Link href="/"><a css={logoStyle}>GoodBye</a></Link></Navbar.Brand>
                    {/* <Link href="/"><a>GoodBye</a></Link> */}
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-md`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                        css={navBarStyle}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                                GoodBye
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="pe-3" css={navStyle}>
                                <Link href="/my_will"><a css={menuStyle}>유언장 작성 / 확인</a></Link>
                                <Link href="/#action2" ><a css={menuStyle}>나의 장례식</a></Link>
                                <Link href="/#action3" ><a css={menuStyle}>부고 작성</a></Link>
                                {/* <Nav.Link href="my_will">유언장 작성 / 확인</Nav.Link>
                                <Nav.Link href="#action2">나의 장례식</Nav.Link>
                                <Nav.Link href="#action3">부고 작성</Nav.Link> */}
                            </Nav>
                            <Form className="d-flex" css={formStyle}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button css={navButtonStyle} variant="outline-success">Search</Button>
                            </Form>
                            {!isLogIn ?
                                  <div css={navBtnGroupStyle} >
                                      <Button css={navButtonStyle}>로그인</Button>
                                      <Button css={navButtonStyle}>회원가입</Button>
                                  </div>
                                : <div css={navBtnGroupStyle} >
                                    <Button css={navButtonStyle}>로그아웃</Button>
                                  </div> }
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar;