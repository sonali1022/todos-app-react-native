import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/MainScreen";
import TodoListScreen from "../screens/TodoListScreen";

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
        <Stack.Screen name="AddTodo" component={TodoListScreen} />
        {/* You can add EditTodo later if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
