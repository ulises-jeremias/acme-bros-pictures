import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import { createProject } from 'app/actions/projects';

import ProjectCreate from './ProjectCreateFormContainer';

const showErrorToast = (message = '') => (
  toast({
    type: 'negative',
    icon: 'x',
    title: 'Error',
    description: message,
    animation: 'bounce',
    time: 5000,
  })
);

const ProjectContainer = (props) => {
  const { translate } = props;

  const { error } = useSelector((state) => state.projects, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const onSubmit = async (values) => dispatch(createProject(values));

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded>
        <ProjectCreate
          onSubmit={onSubmit}
          translate={(name, ...args) => translate(`projects:${name}`, ...args)}
        />
      </Segment>
    </>
  );
};

ProjectContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default ProjectContainer;
