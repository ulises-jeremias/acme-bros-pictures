import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import Project from 'app/components/Projects/Show';
import { fetchProject } from 'app/actions/projects';

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

  const { error, project, isFetching } = useSelector((state) => state.projects, shallowEqual);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProject(id));
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
        <Project
          project={project}
          onRefresh={() => dispatch(fetchProject(id))}
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
