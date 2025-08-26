import DefaultLayout from '@/layouts/DefaultLayout';
import DashboardView from '@/modules/dashboard/DashboardView';
import ProductsView from '@/modules/products/ProductsView';
// import DeliveryView from '@/modules/delivery/DeliveryView';
// import UsersView from '@/modules/users/UsersView';
// import CategoryView from '@/modules/category/CategoryView';
import LoginView from '@/modules/auth/LoginView';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface TokenPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  exp: number;
}

const Router = () => {
  const token = localStorage.getItem('token');
  let role: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        // Token expired
        localStorage.removeItem('token');
        role = null;
      }
    } catch (err) {
      console.error('Token decode error:', err);
      localStorage.removeItem('token');
      role = null;
    }
  }



  const router = createBrowserRouter([
    {
      path: '/',
	  element: token && role === 'Admin' ? <DefaultLayout /> : <Navigate to="/login" replace />,
      children: [
        { path: '', element: <DashboardView /> },
        { path: 'products', element: <ProductsView /> },
        // { path: 'delivery', element: <DeliveryView /> },
        // { path: 'users', element: <UsersView /> },
        // { path: 'category', element: <CategoryView /> },
      ],
    },
    {
      path: '/login',
      element: token && role === 'Admin' ? <Navigate to="/" replace /> : <LoginView />,
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
