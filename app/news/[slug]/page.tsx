import { Metadata } from 'next';
import { getNewsDetail, getNewsList } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import styles from './page.module.css';
import ButtonLink from '@/app/_components/ButtonLink';

// ページのPropsの型定義を修正
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const { contents } = await getNewsList();

  const paths = contents.map((news) => {
    return {
      slug: news.id,
    };
  });

  return [...paths];
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await getNewsDetail(params.slug, {
    draftKey: searchParams.dk as string,
  });

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url || ''],
    },
    alternates: {
      canonical: `/news/${params.slug}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const data = await getNewsDetail(params.slug, {
    draftKey: searchParams.dk as string,
  });
  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
