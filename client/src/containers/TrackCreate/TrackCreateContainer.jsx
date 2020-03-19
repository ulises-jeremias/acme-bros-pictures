import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import {
  Segment,
} from 'semantic-ui-react';

import { createTrack } from 'app/actions/tracks';
import { fetchProject } from 'app/actions/projects';

import TrackCreate from './TrackCreateFormContainer';

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

const TrackContainer = (props) => {
  const { translate } = props;

  const { error } = useSelector((state) => state.tracks, shallowEqual);
  const { error: projectsError, project } = useSelector((state) => state.projects, shallowEqual);
  const { id: projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, []);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const onSubmit = async (values) => dispatch(createTrack({ ...values, projectId }));

  if (projectsError) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded>
        <TrackCreate
          onSubmit={onSubmit}
          project={project}
          translate={(name, ...args) => translate(`tracks:${name}`, ...args)}
        />
      </Segment>
    </>
  );
};

TrackContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default TrackContainer;
