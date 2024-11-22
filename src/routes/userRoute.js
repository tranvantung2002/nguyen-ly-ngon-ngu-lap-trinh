import { Navigate, Route, Routes } from "react-router-dom";
import MenuBar from "../layout/menuBar";
import LibraryView from "../container/LibraryView";


const UserRoute = () => {

  const routes = [
    { path: "/appconfig", component: <LibraryView /> },
    { path: "/", component: <LibraryView /> },
  ]
  return (
    <Routes>
      <Route element={<MenuBar />}>
        {
          routes.map((item, key) => (
            <Route element={item.component} path={item.path} key={key} />
          ))
        }
      </Route>
    </Routes>
  )
}

export default UserRoute;
