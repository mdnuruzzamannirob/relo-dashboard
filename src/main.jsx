import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import router from "./app/router";
import { store } from "./store/store";
import "./index.css";
import AuthInitializer from "./layouts/AuthInitializer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthInitializer>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors
        theme="light"
        duration={3000}
        expand
        swipeDirections={["bottom", "top", "left", "right"]}
      />
    </AuthInitializer>
  </Provider>,
);
