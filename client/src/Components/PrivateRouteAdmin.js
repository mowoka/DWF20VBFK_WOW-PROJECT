import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import LoadingComponent from "./Loading/LoadingComponent";
import { AppContext } from "../Context/globalContext";

const PrivateRouteAdmin = ({ component: Component, ...rest }) => {
  const [state] = useContext(AppContext);
  const { isLogin, isLoading, user } = state;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoading ? (
          <LoadingComponent />
        ) : isLogin && user.role == "ADMIN" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRouteAdmin;
