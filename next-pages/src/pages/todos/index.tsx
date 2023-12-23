import {
  QueryClient,
  dehydrate,
  DehydratedState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { deleteTodo, getTodos } from '@/api';
import { Refresher } from "@/components/refresher";

export const getServerSideProps = (async () => {
  const queryClient = new QueryClient();
  try {
    const data = await queryClient.prefetchQuery({
      queryKey: ['todos'],
      queryFn: getTodos,
    });
  } catch (e) {
    console.log('get todos error ', e);
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
}) satisfies GetServerSideProps<{ dehydratedState: DehydratedState }>;

export default function Todos() {
  const queryClient = useQueryClient();
  const {
    data: todos,
    isLoading,
    isRefetching,
    isError,
  } = useQuery({ queryKey: ['todos'], queryFn: getTodos });

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    await queryClient.invalidateQueries({ queryKey: ['todos'] });
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error :(</div>;
    }

    return (
      <div className="relative">
        <ul>
          {(todos || []).map(({ id, name, done }) => (
            <li key={id} className="flex gap-3">
              <div>{id}</div>
              <div>{name}</div>
              <div>Done: {String(done)}</div>
              <div>
                <Link
                  href={`/todos/${id}/update`}
                  className="underline text-blue-500"
                >
                  Update
                </Link>
              </div>
              <div>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        {isRefetching && <Refresher />}
      </div>
    );
  };

  return (
    <div>
      <h1 className="flex gap-2">
        Todos{' '}
        <Link href="/todos/create" className="underline text-blue-500">
          Create
        </Link>
      </h1>
      {renderContent()}
    </div>
  );
}
