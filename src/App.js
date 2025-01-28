import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
        path: '/',
        element: <HomePage></HomePage>
  }
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App;