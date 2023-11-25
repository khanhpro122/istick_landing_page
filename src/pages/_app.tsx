/* eslint-disable @next/next/no-sync-scripts */
// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import App, { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { NextPage } from 'next';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import 'react-quill/dist/quill.snow.css'

// Config
import getConfig from 'next/config';

// Translates
import i18n from '@/locales/i18n';

// Styles
import '@/styles/globals.css';
import '@/styles/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import PageChange from '@/components/PageChange/PageChange.js';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CookiesProvider } from 'react-cookie';
import Script from 'next/script';
import { AuthProvider } from '@/context';

Router.events.on('routeChangeStart', (url) => {
  document.body.classList.add('body-page-transition');
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById('page-transition')
  );
});
Router.events.on('routeChangeComplete', () => {
  let elem = document.getElementById('page-transition');
  if (elem) {
    ReactDOM.unmountComponentAtNode(elem);
  }
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  let elem = document.getElementById('page-transition');
  if (elem) {
    ReactDOM.unmountComponentAtNode(elem);
  }
  document.body.classList.remove('body-page-transition');
});

interface CustomAppProps extends AppProps {
  Component: React.ComponentType<any> & {
    layout?: React.ComponentType;
  };
}

const MyApp: NextPage<CustomAppProps> = ({ Component, pageProps:{ session, ...pageProps } }) => {
  const Layout =
    Component.layout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>);
  // query
  const [queryClient] = React.useState(() => new QueryClient());

  // get apikey
  const { publicRuntimeConfig } = getConfig();
  const apiKey = publicRuntimeConfig && publicRuntimeConfig.API_KEY_MAP;
  const apiKeyAnalytis = publicRuntimeConfig && publicRuntimeConfig.API_KEY_GG_ANALYTIS;

  return (
    <React.Fragment>
      <Script strategy="lazyOnload" async src={`https://www.googletagmanager.com/gtag/js?${apiKeyAnalytis}`} />
      <Script strategy="lazyOnload" id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-K3X13WVSTR', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1, shrink-to-fit=no'
            />
            <script src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}></script>
            <script src="https://accounts.google.com/gsi/client?hl=en" async defer></script>
          </Head>
          <Layout>
            <ErrorBoundary>
              <AuthProvider>
                <Component {...pageProps} />
              </AuthProvider>
            </ErrorBoundary>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </I18nextProvider>
    </React.Fragment>
  );
};

export default MyApp;
