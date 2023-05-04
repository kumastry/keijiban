import { NextSeo } from "next-seo";
import Head from "next/head";

const keijibanHead = () => {
  return (
    <>

          {/*SEOは外部に設置する*/}
      {/*
      <Head>
        <title>kumastry keijiban</title>
        <meta name="description" content="本格的な掲示板　ただそれだけ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta charset="utf-8" />
        <meta property="og:title" content="kumastry keijiban" />
        <meta property="og:site_name" content="kumastry keijiban" />
        <meta
          property="og:description"
          content="本格的な掲示板　ただそれだけ"
        />
        <meta property="og:url" content="%PUBLIC_URL%" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="%PUBLIC_URL%/images/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
  </Head> */}

      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <NextSeo
        title="kumastry keijiban"
        description="本格的な掲示板、ただそれだけ"
      />
    </>
  );
};

export default keijibanHead;
