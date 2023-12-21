import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteTodo, getTodos } from '@/api';
import { Todo } from '@/types/todos';

export const getServerSideProps = (async () => {
  const todos: Todo[] = await getTodos();
  return { props: { todos } };
}) satisfies GetServerSideProps<{ todos: Todo[] }>;

export default function Todos({
  todos,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    router.reload();
  };

  return (
    <div>
      <h1 className="flex gap-2">
        Todos{' '}
        <Link href="/todos/create" className="underline text-blue-500">
          Create
        </Link>
      </h1>
      <ul>
        {todos.map(({ id, name, done }) => (
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
    </div>
  );
}
