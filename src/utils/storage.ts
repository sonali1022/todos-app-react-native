import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../types/todo";

const TODOS_KEY = "@todos";

export const saveTodos = async (todos: Todo[]) => {
  try {
    await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Failed to save todos", e);
  }
};

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const json = await AsyncStorage.getItem(TODOS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Failed to load todos", e);
    return [];
  }
};
