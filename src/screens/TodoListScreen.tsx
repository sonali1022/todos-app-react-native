import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/todoSlice";
import { AppDispatch } from "../redux/store";

export default function TodoListScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addTodo({ title: title.trim() }));
    setTitle("");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.label}>Add a New Todo</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your todo..."
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={[styles.addBtn, !title.trim() && { opacity: 0.6 }]}
        onPress={handleAdd}
        disabled={!title.trim()}
      >
        <Text style={styles.addBtnText}>Add Todo</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
