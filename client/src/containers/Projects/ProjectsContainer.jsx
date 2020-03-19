import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import Projects from 'app/components/Projects/List';
import { fetchProjects } from 'app/actions/projects';

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

const ProjectsContainer = (props) => {
  const { translate } = props;
  const { error, projects, isFetching } = useSelector((state) => state.projects, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded loading={isFetching}>
        <Projects
          projects={projects}
          translate={(name, ...args) => translate(`projects:${name}`, ...args)}
        />
      </Segment>
    </>
  );
};

ProjectsContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default ProjectsContainer;
