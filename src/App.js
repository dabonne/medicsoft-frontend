import "./App.css";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useContext } from "react";
import { AppContext } from "./services/context";
import { routes } from "./services/routes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;

  const createRoute = ({ element, childrens, roles = [], ...route }) => {
    const Component = element
    element = roles.length > 0 ? <ProtectedRoute isAllowed={user.isAuth} redirectPath= "/"><Dashboard /></ProtectedRoute> : <Component />;
    return (
      
      <Route key={route.path} {...route} element={element}>
        {childrens && childrens.map(createRoute)}
      </Route>
    );
  };
  return (
    <div className="row">
      <Routes>
        <Route path="/" element={<Login />} />
        {
          user.isAuth ? (
            <Route path="/dashboard/*" element={<ProtectedRoute isAllowed={user.isAuth} redirectPath= "/"><Dashboard /></ProtectedRoute>} />
          ) : (
            <Route path="/*" element={<Login />} />
          )
        }
      </Routes>
    </div>
  );
}

export default App;
