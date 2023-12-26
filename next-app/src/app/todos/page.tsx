// import {
//   QueryClient,
//   dehydrate,
//   DehydratedState,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
import Link from 'next/link';
import { getTodos } from '@/api';
import { Refresher } from '@/components/refresher';
import { Todos } from '@/components/todos';

export default async function TodosPage() {
  const todos = await getTodos();
  return <Todos todos={todos} />;
}
