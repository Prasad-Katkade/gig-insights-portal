import React from 'react'
import { useRoutes,Navigate } from "react-router";
import Home from './pages/Home';
import GigHome from './pages/GigHome';
import PolicyHome from './pages/PolicyHome';


const Routes = () => {
  return useRoutes([
    {
      path: "/",
      children: [
        { path: "", element: <Navigate to="/Home" replace /> },
        {
          path: "/Home",
          element: <Home />,
        },
        {
          path: "/Gigworkers",
          element: <GigHome />,
        },
        {
            path: "/Policymakers",
            element: <PolicyHome />,
          },
      ],
    },
  ]);

}

export default Routes