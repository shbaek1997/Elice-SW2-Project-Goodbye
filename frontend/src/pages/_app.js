import React from 'react';
import Router from "next/router";
import Head from 'next/head';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import wrapper from '../store/configureStore';

function MyApp({ Component }) {
	React.useEffect(() => {
		const start = () => {
			NProgress.start();
		};
		const end = () => {
			NProgress.done();
		};

		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);

		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);
	return (
		<>
			<React.Suspense fallback={<>loading</>}>
				<Head>
					<meta charSet="utf-8" />
					<link rel="shortcut icon" href="#" />
					<style>
					@import url('https://fonts.googleapis.com/css2?family=Cinzel&display=swap');
					</style>
					<title>GoodBye</title>
				</Head>
				<Component />
			</React.Suspense>
		</>
	);
}



export default wrapper.withRedux(MyApp);
