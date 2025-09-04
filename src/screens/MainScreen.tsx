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
  updateTodo,
  setFilter,
  fetchTodos,
} from "../redux/todoSlice";
import { MaterialIcons as Icon } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MainScreen() {
  const { todos, filter, loading } = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch<AppDispatch>();

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [sortBy, setSortBy] = useState<"ID" | "Recent">("ID");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  // Filter, search, and sort todos
  const filteredTodos = useMemo(() => {
    let list = todos;

    if (filter === "Completed") list = list.filter(t => t.completed);
    else if (filter === "Pending") list = list.filter(t => !t.completed);

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

  const handleUpdate = (id: string) => {
    if (!editText.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(updateTodo({ id, title: editText.trim() }));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteTodo(id));
  };

  if (loading)
    return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, justifyContent: "center" }} />;

  const renderItem = ({ item }: { item: typeof todos[0] }) => (
    <View style={styles.todoRow}>
      {editingId === item.id ? (
        <>
          <TextInput style={styles.editInput} value={editText} onChangeText={setEditText} />
          <TouchableOpacity onPress={() => handleUpdate(item.id)}>
            <Icon name="check-circle" size={26} color="#4CAF50" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.todoText, item.completed && styles.completed]}
              onPress={() => dispatch(toggleTodo(item.id))}
            >
              {item.title}
            </Text>
            <Text style={styles.subText}>
              Created: {new Date(item.created_at).toLocaleString()} | Updated: {new Date(item.updated_at).toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => { setEditingId(item.id); setEditText(item.title); }}>
            <Icon name="edit" size={22} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="delete" size={22} color="#F44336" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

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

      {/* Filter & Sort Buttons */}
      <View style={styles.filterRow}>
        {["All", "Pending", "Completed"].map(f => (
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
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Todo counts */}
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
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 10,
  },
  todoText: { flex: 1, color: "#fff", fontSize: 16 },
  subText: { fontSize: 11, color: "#AAA", marginTop: 2 },
  completed: { textDecorationLine: "line-through", color: "#888" },
  editInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#2A2A2A",
    color: "#fff",
    borderRadius: 10,
    marginRight: 8,
  },
  countText: { color: "#fff", marginTop: 10, fontWeight: "bold", textAlign: "center" },
});
