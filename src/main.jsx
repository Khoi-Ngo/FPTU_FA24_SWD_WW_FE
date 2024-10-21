import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AuthWrapper } from './components/auth-context.jsx';
import { App } from './pages/App.jsx';
import MockDashboardPage from './pages/MockDashboard.jsx';
import UserListPage from './pages/User/UserListPage.jsx';
import WineListPage from './pages/Wine/WineListPage.jsx';
import { RoomListPage } from './pages/Room/RoomListPage.jsx';
import { IORequestListPage } from './pages/IORequest/IORequestListPage.jsx';

import TaskHome from './pages/Task/TaskHome.jsx';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage.jsx';
import { CreateWinePage } from './pages/Wine/CreateWinePage.jsx';
import { DetailWinePage } from './pages/Wine/DetailWinePage.jsx';
import UpdateWinePage from './pages/Wine/UpdateWinePage.jsx';

import UserImportRequest from './pages/User/UserImportRequest.jsx';
import UserManageCategory from './pages/User/UserManageCategory.jsx';
import UserProfilePage from './pages/User/UserProfilePage.jsx';
import { UserDetailPage } from './components/User/UserDetailPage.jsx';
import { AuthRoutes } from './components/AuthRoutes.jsx';
import { NonStaffRoutes } from './components/NonStaffRoutes.jsx';
import { WineCateListPage } from './pages/WineCategory/WineCateListPage.jsx';
import RoomDetails from './pages/Room/RoomDetails/RoomDetails.jsx';
import { CheckRequestListPage } from './pages/CheckRequest/CheckRequestListPage.jsx';
import { IORequestDetailsPage } from './pages/IORequest/IORequestDetailsPage.jsx';

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
    element:
      <AuthRoutes>
        <App />
      </AuthRoutes>
    ,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MockDashboardPage />
      },
      {
        path: 'iorequests/:id',
        element: <IORequestDetailsPage />,
      },
      {
        path: 'users',
        element:
          <NonStaffRoutes>
            <UserListPage />
          </NonStaffRoutes>
      },
      {
        path: 'users/:userId',
        element: <UserDetailPage />
      },

      {
        path: 'tasks',
        element: <TaskHome />
      },
      {
        path: 'profile',
        element: <UserProfilePage />
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

        path: 'wine-cates',
        element: <WineCateListPage />

      },
      {
        path: 'rooms',
        element: <RoomListPage />
      },
      {
        path: 'room-details/:roomId',
        element: <RoomDetails />
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
      },

      {
        path: "import_request",
        element: <UserImportRequest />
      },
      {
        path: "checkrequests",
        element: <CheckRequestListPage />
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
