import { RouterProvider as ReactRouterProvider, createBrowserRouter } from "react-router-dom"
import BaseLayout from "../layouts/BaseLayout"
import Home from "../pages/Home"
import Error from "../pages/Error"
import Form from "../pages/Form"
import GlobalNotification from "../components/organism/GlobalNotification"

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }, 
      {
        path: "form",
        element: <Form />
      },
    ]
  }, {
    path: "*",
    element: <Error />
  }
])

const RouterProvider = () => {
  return (
    <>
      <ReactRouterProvider router={router} />
      <GlobalNotification />
    </>
  )
}

export default RouterProvider