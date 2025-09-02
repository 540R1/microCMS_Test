import { Metadata } from 'next';
import { getNewsDetail, getNewsList } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import styles from './page.module.css';
import ButtonLink from '@/app/_components/ButtonLink';

type Props = {
  params: { slug: string };
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

// @ts-ignore
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getNewsDetail(params.slug);

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

// @ts-ignore
export default async function Page({ params }: Props) {
  const data = await getNewsDetail(params.slug);
  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}