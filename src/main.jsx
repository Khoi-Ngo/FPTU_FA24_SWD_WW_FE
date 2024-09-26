import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { DemoPage } from './pages/DemoPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AuthWrapper } from './components/auth-context.jsx';
import { AuthRoutes } from './components/AuthRoutes.jsx';
import { App } from './pages/App.jsx';

//config browser route region
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/app",
    element:
      // <AuthRoutes>
      <App />
    // </AuthRoutes>,
    ,
    errorElement: <ErrorPage />,
    children: ([

    ]),
  },

]);

//end region


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)