import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator";
import { ActivityIndicator } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" color="#007bff" />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
