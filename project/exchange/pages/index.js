import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const address = useAddress();
  useEffect(() => {
    if (address) router.replace("/exchange");
  }, [address]);

  return (
    <div>
      <Head>
        <title>Exchange PJC tokens</title>
      </Head>
      <div className="home__container">
        <h1>Sign in to exchange</h1>
        <ConnectWallet />
      </div>
    </div>
  );
}
