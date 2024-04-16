import { ThirdwebProvider } from '@thirdweb-dev/react';
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<ThirdwebProvider activeChain={PolygonAmoyTestnet} clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}>
			<div className='bg-amber-100 h-screen'>
				<div className='text-lg bg-amber-200 border round px-4 py-2'>Built using Next.js, Metamask, Remix, Thirdweb.js, Web3.js, Tailwind</div>
				<Component {...pageProps} />
			</div>
		</ThirdwebProvider>
	);
}
export default MyApp;
