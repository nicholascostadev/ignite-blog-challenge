import '../styles/globals.scss';
import * as prismic from '@prismicio/client';
import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import { AppProps } from 'next/app';
import Link from 'next/link';

import { linkResolver, repositoryName } from '../../prismicio';

const endpoint = prismic.getEndpoint(repositoryName);
const client = prismic.createClient(endpoint);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PrismicProvider
      client={client}
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      {' '}
      <PrismicPreview repositoryName={repositoryName}>
        <Component {...pageProps} />
      </PrismicPreview>
    </PrismicProvider>
  );
}

export default MyApp;
