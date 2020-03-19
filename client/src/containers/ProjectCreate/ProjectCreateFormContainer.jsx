import React, { useEffect } from 'react';
import { reduxForm } from 'redux-form';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import ProjectCreate from 'app/components/Projects/Form';
import { fetchUsers } from 'app/actions/users';

const ConnectedProjectForm = reduxForm({
  form: 'projectCreateForm',
})(ProjectCreate);

const ProjectCreateContainer = (props) => {
  const { users } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return <ConnectedProjectForm users={users} {...props} />;
};

export default ProjectCreateContainer;
