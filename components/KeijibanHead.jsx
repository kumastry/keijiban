import { NextSeo } from "next-seo";
import Head from "next/head";

const keijibanHead = () => {
  return (
    <>
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
