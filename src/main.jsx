import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { DemoPage } from './pages/DemoPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AuthWrapper } from './components/auth-context.jsx';
import { AuthRoutes } from './components/AuthRoutes.jsx';
import { HomePage } from './pages/HomePage.jsx';

//config browser route region
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "demo",
        // index: true,
        element: <DemoPage />
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/demo1",
    element:
      <AuthRoutes>
        <DemoPage />
      </AuthRoutes>
  },
]);

//end region


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)