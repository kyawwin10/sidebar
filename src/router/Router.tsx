import DefaultLayout from '@/layouts/DefaultLayout';
import DashboardView from '@/modules/dashboard/DashboardView';
import ProductsView from '@/modules/products/ProductsView';
import LoginView from '@/modules/auth/LoginView';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import DeliveryView from '@/modules/delivery/DeliveryView';
import UserView from '@/modules/user/UserView';
import CategoryViex from '@/modules/category/CategoryViex';
import DeliveryLayout from '@/layouts/DeliveryLayout';

const Router = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element:<DefaultLayout />,
      children: [
        { path: '', element: <DashboardView /> },
        { path: 'products', element: <ProductsView /> },
        {path: 'delivery', element: <DeliveryView />},
        {path: 'user', element: <UserView />},
        {path: 'category', element: <CategoryViex />},
      ],
    },
    {
      path: '/login',
      element: <LoginView />,
    },
    {
      path: '/deliverylayout',
      element: <DeliveryLayout />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
