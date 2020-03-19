import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import {
  Segment,
} from 'semantic-ui-react';

import { createWorkflow } from 'app/actions/workflows';
import { fetchTrack } from 'app/actions/tracks';

import ProjectCreate from './WorkflowCreateFormContainer';

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

  const { error } = useSelector((state) => state.workflows, shallowEqual);
  const { error: tracksError, track } = useSelector((state) => state.tracks, shallowEqual);
  const { id: trackId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTrack(trackId));
  }, []);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const onSubmit = async (values) => dispatch(createWorkflow({ ...values, trackId }));

  if (tracksError) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded>
        <ProjectCreate
          onSubmit={onSubmit}
          track={track}
          translate={(name, ...args) => translate(`workflows:${name}`, ...args)}
        />
      </Segment>
    </>
  );
};

ProjectContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default ProjectContainer;
