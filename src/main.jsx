import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoPage } from './pages/DemoPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AuthWrapper } from './components/auth-context.jsx';
import { App } from './pages/App.jsx';
import MockDashboardPage from './pages/MockDashboard.jsx';
import UserListPage from './pages/User/UserListPage.jsx';
import UserDetailPage from './pages/User/UserDetailPage.jsx';
import WineListPage from './pages/Wine/WineListPage.jsx';
import { WineCateListPage } from './pages/WineCategory/WineCateListPage.jsx';
import { RoomListPage } from './pages/Room/RoomListPage.jsx';
import { IORequestListPage } from './pages/IORequest/IORequestListPage.jsx';

import TaskHome from './pages/Task/TaskHome.jsx';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage.jsx';
import { CreateWinePage } from './pages/Wine/CreateWinePage.jsx';
import { DetailWinePage } from './pages/Wine/DetailWinePage.jsx';
import UpdateWinePage from './pages/Wine/UpdateWinePage.jsx';

import UserImportRequest from './pages/User/UserImportRequest.jsx';
import UserManageCategory from './pages/User/UserManageCategory.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/reset-password",
    element: <ResetPasswordPage></ResetPasswordPage>,
    errorElement: <ErrorPage />
  },

  {
    path: "/app",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MockDashboardPage />
      },
      {
        path: 'demo',
        element: <DemoPage />
      },
      {
        path: 'users',
        element: <UserListPage />
      },
      {
        path: 'tasks',
        element: <TaskHome />
      },
      {
        path: 'profile',
        element: <UserDetailPage />
      },
      {
        path: 'wines',
        element: <WineListPage />
      },
      {

        path: 'winecates',
        element: <UserManageCategory />

      },
      {
        path: 'rooms',
        element: <RoomListPage />
      },
      {
        path: 'io-requests',
        element: <IORequestListPage />,
      },
      {

        path: 'create-wine',
        element: <CreateWinePage />,
      },
      {
        path: 'wines/:wineId',
        element: <DetailWinePage />,
      },
      {
        path: 'update-wine/:wineId',
        element: <UpdateWinePage />,
      }
      

       
      {
        path: "import_request",
        element: <UserImportRequest />
      },

    ],
  },
]);


// Render the application
createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);
