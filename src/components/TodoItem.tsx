import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Todo } from "../types/todo";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.item} activeOpacity={0.7}>
      {/* Checkbox */}
      <View style={styles.checkbox}>
        {todo.completed && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
      </View>

      {/* Title */}
      <Text style={[styles.text, todo.completed && styles.done]}>
        {todo.title}
      </Text>

      {/* Actions (don’t trigger toggle) */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={{ marginRight: 10 }}
          onPressIn={e => e.stopPropagation()} // prevent row toggle
        >
          <Ionicons name="pencil" size={20} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          onPressIn={e => e.stopPropagation()} // prevent row toggle
        >
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 5,
    backgroundColor: "#111",
    borderRadius: 8,
  },
  text: { color: "#fff", flex: 1, marginHorizontal: 10, fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "#777" },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  actions: { flexDirection: "row", alignItems: "center" },
});
