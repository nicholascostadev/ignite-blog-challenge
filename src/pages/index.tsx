import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { useAllPrismicDocumentsByType } from '@prismicio/react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination);
  const [hasNext, setHasNext] = useState(!!postsPagination.next_page);

  function loadNextPage(link: string) {
    fetch(link)
      .then(response => response.json())
      .then(data => {
        const newPosts = { ...posts };

        setPosts({
          ...newPosts,
          next_page: data.next_page,
          results: [...newPosts.results, ...data.results],
        });
        setHasNext(!!data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <div className={styles.homeHeader}>
        <Header />
      </div>
      <main className={styles.container}>
        <div className={styles.postsList}>
          {posts.results.map((post, index) => {
            return (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
                    <time>
                      {' '}
                      <FiCalendar className={styles.icons} />
                      {format(
                        new Date(parseISO(post.first_publication_date)),
                        'PP',
                        {
                          locale: ptBR,
                        }
                      ).toString()}
                    </time>
                    <p>
                      <FiUser className={styles.icons} />
                      {post.data.author}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
          {hasNext && (
            <div className={styles.button_container}>
              <button
                type="button"
                className={styles.showMore}
                onClick={() => loadNextPage(posts.next_page)}
              >
                Carregar mais posts
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2,
  });

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
    first_publication_date: post.first_publication_date,
  }));

  const postsPagination = { ...postsResponse };

  return {
    props: {
      postsPagination,
    },
  };
};
