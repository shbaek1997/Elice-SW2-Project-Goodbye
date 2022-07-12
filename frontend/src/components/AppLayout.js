import React from 'react';

import Footer from './Footer';
import Header from './Header';

const AppLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default AppLayout;