import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Todo } from "../types/todo";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        {todo.completed && <Ionicons name="checkmark" size={16} color="#000" />}
      </TouchableOpacity>
      <Text style={[styles.text, todo.completed && styles.done]}>{todo.title}</Text>
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  text: { color: "#fff", flex: 1, marginHorizontal: 10 },
  done: { textDecorationLine: "line-through", color: "#777" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
});
