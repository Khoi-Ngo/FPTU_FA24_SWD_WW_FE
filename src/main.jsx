import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { DemoPage } from './pages/DemoPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AuthWrapper } from './components/auth-context.jsx';
import { AuthRoutes } from './components/AuthRoutes.jsx';
import { App } from './pages/App.jsx';
import MockDashboardPage from './pages/MockDashboard.jsx';
import UserListPage from './pages/User/UserListPage.jsx';
import UserImportRequest from './pages/User/UserImportRequest.jsx';
import UserDetailPage from './pages/User/UserDetailPage.jsx';
//config browser route region
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/user/import",
    element: <UserImportRequest />,
    errorElement: <ErrorPage />,

  },
  {
    path: "/app",
    element:
      // <AuthRoutes>
      <App />
    // </AuthRoutes>
    ,
    errorElement: <ErrorPage />,
    children: ([

      {
        index: true,
        element: <MockDashboardPage></MockDashboardPage>
      },

      {
        path: 'demo',
        element: <DemoPage></DemoPage>
      },

      {
        path: 'users',
        element: <UserListPage></UserListPage>
      },
      {
        path: 'profile',
        element: <UserDetailPage></UserDetailPage>
      }
    ]),
  },

]);

//end region


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)