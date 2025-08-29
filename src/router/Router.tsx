import DefaultLayout from '@/layouts/DefaultLayout';
import DashboardView from '@/modules/dashboard/DashboardView';
import ProductsView from '@/modules/products/ProductsView';
import LoginView from '@/modules/auth/LoginView';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

const Router = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element:<DefaultLayout />,
      children: [
        { path: '', element: <DashboardView /> },
        { path: 'products', element: <ProductsView /> },
      ],
    },
    {
      path: '/login',
      element: <LoginView />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
