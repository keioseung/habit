import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Navigation from '../components/Navigation';
import InstallPrompt from '../components/InstallPrompt';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <InstallPrompt />
    </>
  );
} 