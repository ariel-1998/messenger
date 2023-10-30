import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./utils/reduxStore.ts";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRouter from "./components/AppRouter.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import UnreadMessagesProvider from "./contexts/UnreadMessagesProvider.tsx";
import SocketProvider from "./contexts/SocketProvider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppRouter />
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          autoClose={2000}
          theme={"colored"}
        />
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
