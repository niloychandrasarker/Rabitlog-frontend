import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Routes/Homepage.jsx";
import PostListPage from "./Routes/PostListPage.jsx";
import SinglePostPage from "./Routes/SinglePostPage.jsx";
import Write from "./Routes/Write.jsx";
import LoginPage from "./Routes/LoginPage.jsx";
import RegisterPage from "./Routes/RegisterPage.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import TrendingPage from "./Routes/TrendingPage.jsx";
import PopularPage from "./Routes/PopularPage.jsx";
import AboutPage from "./Routes/AboutPage.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/trending",
        element: <TrendingPage />,
      },
      {
        path: "/popular",
        element: <PopularPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
