import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "14px",
              background: "#0f172a",
              color: "#f8fafc",
              padding: "12px 16px",
              fontSize: "0.95rem",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#0f172a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#0f172a",
              },
            },
          }}
        />
      </>
    </PersistGate>
  </Provider>
);
