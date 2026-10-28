import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import { Navigate } from "react-router-dom";
import { authRoutes } from "../features/Authentication/routes";
import { BlogEditor } from "../components";

export const routes = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    ...authRoutes,
    {
      index: true,
      element:<BlogEditor/>
      //element: <Navigate to="/auth" replace/>,
    },
  ]
}])
