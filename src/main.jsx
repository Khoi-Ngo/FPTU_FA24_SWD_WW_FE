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
import { IORequestDetailListPage } from './pages/IORequest/IORequestDetailListPage.jsx';
import UserImportRequest from './pages/User/UserImportRequest.jsx';
import UserManageCategory from './pages/User/UserManageCategory.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
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
        path: 'iorequests',
        element: <IORequestListPage />,
      },
      {
        path: 'iodetail', // TODO replace id later
        element: <IORequestDetailListPage />
      },
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
