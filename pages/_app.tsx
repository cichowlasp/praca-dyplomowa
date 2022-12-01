import React from 'react';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider, EmotionCache } from '@emotion/react';
import lightThemeOptions from '../styles/Themes/lightThemeOptions';
import createEmotionCache from '../utils/createEmotionCache';
import Head from 'next/head';
import Nav from '../components/Navbar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const clientSideEmotionCache = createEmotionCache();
const lightTheme = createTheme(lightThemeOptions);

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
	session: Session;
}

const MyApp: React.FC<MyAppProps> = ({
	Component,
	session,
	pageProps,
	emotionCache = clientSideEmotionCache,
}) => {
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>PWR</title>
				<meta
					name='viewport'
					content='initial-scale=1, width=device-width'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<ThemeProvider theme={lightTheme}>
					<CssBaseline />
					<SessionProvider session={session}>
						<Nav />
						<Component {...pageProps} />
					</SessionProvider>
				</ThemeProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

export default MyApp;
