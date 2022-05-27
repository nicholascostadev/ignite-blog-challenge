import { PrismicRichText, PrismicText } from '@prismicio/react';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  let totalWords = 0;
  let estimatedReadingTime = 0;
  post.data.content.forEach(content => {
    content.body.forEach(item => {
      item.text.split(' ').forEach(word => {
        totalWords++;
      });
    });
  });

  estimatedReadingTime = Math.ceil(totalWords / 200);

  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <Image
          className={styles.banner}
          src={post.data.banner.url}
          width=""
          height=""
        />
        <div className={styles.postContainer}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <div>
              <FiCalendar />
              <p>
                {format(new Date(parseISO(post.first_publication_date)), 'PP', {
                  locale: ptBR,
                }).toString()}
              </p>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock />
              <p>{estimatedReadingTime} min</p>
            </div>
          </div>
          {post.data.content.map(content => (
            <div className={styles.postContent}>
              <h2>{content.heading}</h2>
              <PrismicRichText field={content.body as []} />
            </div>
          ))}
          <PrismicRichText field={post.data.content as []} />
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const routes = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths: routes,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});

  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: { post },
    redirect: 60 * 30,
  };
};
