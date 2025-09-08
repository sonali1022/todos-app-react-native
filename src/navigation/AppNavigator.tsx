import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/MainScreen";
import AddTodoScreen from "../screens/AddTodoScreen";
import EditTodoScreen from "../screens/EditTodoScreen"; // we’ll create this in step 2

export type RootStackParamList = {
  Main: undefined;
  AddTodo: undefined;
  EditTodo: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} />
        <Stack.Screen name="EditTodo" component={EditTodoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
