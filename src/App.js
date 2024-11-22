import './App.css';
import { BrowserRouter, Routes } from "react-router-dom";
import UserRoute from "./routes/userRoute";
import { QueryClient, QueryClientProvider } from "react-query";
import { notification } from "antd";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        onError: error => {
          console.log(error)
          notification.error({ message: error.data?.message || 'Có lỗi xảy ra vui lòng thử lại sau!' });
        }
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserRoute />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
