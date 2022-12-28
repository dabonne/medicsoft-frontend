import React from "react";

export const routes = [
    {
      path: "/",
      roles: [],
      permissions: [],
      element: React.lazy(() => import("../Login")),
      
    },
    {
      path: "/dashboard/",
      roles: ["login"],
      permissions: [],
      element: React.lazy(() => import("../Dashboard")),
      childrens: [
        {
          roles: ["login"],
          path: "/dashboard/",
          element: React.lazy(() => import("../pages/Home")),
        },
        {
          roles: ["login"],
          path: "/dashboard/employe",
          element: React.lazy(() => import("../pages/Employe")),
        },
        {
          roles: ["login"],
          path: "/dashboard/rendez-vous",
          element: React.lazy(() => import("../pages/Meet")),
        },
        {
          roles: ["login"],
          path: "/dashboard/agenda",
          element: React.lazy(() => import("../pages/Notebook")),
        },
        {
          roles: ["login"],
          path: "/dashboard/patient",
          element: React.lazy(() => import("../pages/Patient")),
        },
        {
          roles: ["login"],
          path: "/dashboard/employe",
          element: React.lazy(() => import("../pages/NotebookGard")),
        },
        {
          path: "/dashboard/employe",
          element: React.lazy(() => import("../pages/Settings")),
        },
      ],
    },
    
  ];