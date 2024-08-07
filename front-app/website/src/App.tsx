import './App.css';
import { 
  createBrowserRouter,
  RouterProvider
 } from 'react-router-dom';

import React from 'react';

const Home = React.lazy(() => import("./pages/home"))
const ProductDetails = React.lazy(() => import("./pages/product-details"))

function App() {

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/products/", element: <ProductDetails /> },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App;
