import React from 'react';
import Head from 'next/head';

import wrapper from '../store/configureStore';

function MyApp({ Component }) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<link rel="shortcut icon" href="#" />
				<title>GoodBye</title>
			</Head>
			<Component />
		</>
	);
}

export default wrapper.withRedux(MyApp);
