import { getNewsList } from '@/app/_libs/microcms';
import { NEWS_LIST_LIMIT } from '@/app/_constants';
import Pagination from '@/app/_components/Pagination';
import ArticleList from '@/app/_components/NewsList';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export async function generateStaticParams() {
  const { totalCount } = await getNewsList();
  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const paths = range(1, Math.ceil(totalCount / NEWS_LIST_LIMIT)).map((repo) => ({
    current: repo.toString(),
  }));

  return [...paths];
}

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);
  const data = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (current - 1),
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath="/news" />
    </>
  );
}