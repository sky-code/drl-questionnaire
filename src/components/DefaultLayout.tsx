import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from '~/utils/user';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <UserProvider>
        <Head>
          <title>DRL Software Engineer Home Challenge</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={'container'}>
          <main>{children}</main>
        </div>
      </UserProvider>
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
};
