'use server'

import { deleteTodo, createTodo, updateTodo } from "@/api";
import {revalidatePath} from "next/cache";

export const deleteTodoAction = async (formData: FormData)=> {
  const id = Number(formData.get('todo-id'));
  try {
    await deleteTodo(Number(id));
    revalidatePath('/todos');
  } catch (e) {
    console.log(`Delete todo ${id} Error`);
  }
}

export const createTodoAction = async (formData: FormData)=> {
  const name = formData.get('name') as string;
  try {
    await createTodo(name);
    revalidatePath('/todos');
  } catch (e) {
    console.log(`Create todo ${name} Error`);
  }
}

export const updateTodoAction = async (formData: FormData)=> {
  const id = Number(formData.get('todo-id'));
  const name = formData.get('name') as string;
  const done = Boolean(formData.get('done'));
  try {
    await updateTodo({ id, name, done });
    revalidatePath('/todos');
  } catch (e) {
    console.log(`Update todo ${name} Error`);
  }
}