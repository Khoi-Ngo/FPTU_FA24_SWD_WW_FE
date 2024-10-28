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
import dayjs from 'dayjs';

import TaskHome from './pages/Task/TaskHome.jsx';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage.jsx';
import { CreateWinePage } from './pages/Wine/CreateWinePage.jsx';
import { DetailWinePage } from './pages/Wine/DetailWinePage.jsx';
import UpdateWinePage from './pages/Wine/UpdateWinePage.jsx';
import UserProfilePage from './pages/User/UserProfilePage.jsx';
import { UserDetailPage } from './components/User/UserDetailPage.jsx';
import { AuthRoutes } from './components/AuthRoutes.jsx';
import { NonStaffRoutes } from './components/NonStaffRoutes.jsx';
import { WineCateListPage } from './pages/WineCategory/WineCateListPage.jsx';
import RoomDetails from './pages/Room/RoomDetails/RoomDetails.jsx';
import { IORequestDetailsPage } from './pages/IORequest/IORequestDetailsPage.jsx';
import WineCateDetailsPage from './pages/WineCategory/WineCateDetailsPage.jsx';
import CheckRequestListPage from './pages/CheckRequest/CheckRequestListPage.jsx';
import { CreateCheckRequestPage } from './pages/CheckRequest/CreateCheckRequestPage.jsx';
import ViewDetailCheckRequestPage from './pages/CheckRequest/ViewDetailCheckRequestPage.jsx';

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
        path: 'io-requests/:id',
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

        path: 'wine-categories',
        element: <WineCateListPage />
      },
      {

        path: 'wine-categories/:id/wines',
        element: <WineCateDetailsPage />

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
        path: "check-requests",
        element: <CheckRequestListPage />
      },

      {
        path: "create-check-request",
        element: <CreateCheckRequestPage />
      },

      {
        path: "check-requests/:requestId",
        element: <ViewDetailCheckRequestPage />
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
