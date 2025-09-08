import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { updateTodo } from "../redux/todoSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function EditTodoScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = route.params;
  const todo = useSelector((state: RootState) =>
    state.todo.todos.find(t => t.id === id)
  );

  const [title, setTitle] = useState(todo?.title || "");

  const handleSave = () => {
    if (!title.trim()) return;
    dispatch(updateTodo({ id, title: title.trim() }));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Todo</Text>
        <View style={{ width: 26 }} /> {/* Spacer for alignment */}
      </View>

      {/* Input */}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Update your todo..."
        placeholderTextColor="#777"
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.saveBtn]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
  },
  cancelBtn: {
    backgroundColor: "#444",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
