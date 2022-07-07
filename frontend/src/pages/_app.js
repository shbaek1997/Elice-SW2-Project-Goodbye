import React from "react";
import Head from "next/head";

function MyApp({ Component }) {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <link rel='shortcut icon' href='#' />
        <title>GoodBye</title>
      </Head>
      <Component />
    </>
  )
}

export default MyApp;
