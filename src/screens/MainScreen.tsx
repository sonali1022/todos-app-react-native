import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  fetchTodos,
} from "../redux/todoSlice";
import TodoItem from "../components/TodoItem";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MainScreen() {
  const { todos, filter, loading } = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const [newTodo, setNewTodo] = useState("");
  const [sortBy, setSortBy] = useState<"ID" | "Recent">("ID");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  // Filter, search, and sort todos
  const filteredTodos = useMemo(() => {
    let list = todos;

    if (filter === "Completed") list = list.filter(t => t.completed);
    else if (filter === "Active") list = list.filter(t => !t.completed);

    if (search.trim()) {
      list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }

    return [...list].sort((a, b) => {
      if (sortBy === "Recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return Number(a.id) - Number(b.id);
    });
  }, [todos, filter, sortBy, search]);

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(addTodo({ title: newTodo.trim() }));
    setNewTodo("");
  };

  const handleToggle = (id: string) => dispatch(toggleTodo(id));
  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteTodo(id));
  };

  if (loading)
    return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, justifyContent: "center" }} />;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search todos..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      {/* Add Todo */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo..."
          placeholderTextColor="#777"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={!newTodo.trim()}>
          <Icon name="add-circle" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Filter & Sort */}
      <View style={styles.filterRow}>
        {["All", "Active", "Completed"].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => dispatch(setFilter(f as any))}
            style={[styles.filterBtn, filter === f && styles.activeBtn]}
          >
            <Text style={styles.filterText}>{f}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setSortBy(sortBy === "ID" ? "Recent" : "ID")}
          style={[styles.filterBtn, styles.sortBtn]}
        >
          <Icon name="sort" size={18} color="#fff" />
          <Text style={styles.filterText}> {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => handleToggle(item.id)}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => navigation.navigate("EditTodo", { id: item.id })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Counts */}
      <Text style={styles.countText}>
        Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#121212" },
  searchInput: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
  },
  addBtn: { justifyContent: "center", alignItems: "center" },
  filterRow: { flexDirection: "row", marginBottom: 12, flexWrap: "wrap" },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  sortBtn: { backgroundColor: "#333" },
  activeBtn: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  filterText: { color: "#fff", fontWeight: "600" },
  countText: { color: "#fff", marginTop: 10, fontWeight: "bold", textAlign: "center" },
});
