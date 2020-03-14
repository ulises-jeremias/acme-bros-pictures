import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Redirect } from 'react-router';
import { Dimmer, Loader } from 'semantic-ui-react';
import { logout } from 'app/actions/auth';

const LogoutContainer = () => {
  const { isAuth, isFetching } = useSelector((state) => state.auth, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  if (!isAuth && !isFetching) {
    return <Redirect to="/login" />;
  }

  return (
    <Dimmer inverted active={isFetching}>
      <Loader />
    </Dimmer>
  );
};

export default LogoutContainer;
