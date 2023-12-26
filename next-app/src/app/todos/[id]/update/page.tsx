import { getTodo } from '@/api';
import { UpdateTodo } from '@/components/update-todo';

export default async function UpdateTodoPage({
  params,
}: {
  params: { id: string };
}) {
  const todo = await getTodo(Number(params.id));
  return <UpdateTodo todo={todo} />;
}
