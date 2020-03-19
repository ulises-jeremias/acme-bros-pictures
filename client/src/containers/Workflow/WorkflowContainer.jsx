import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Segment,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import { fetchWorkflow } from 'app/actions/workflows';
import { useParams } from 'react-router';

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

const WorkflowContainer = (props) => {
  const { translate } = props;

  const { error, workflow, isFetching } = useSelector((state) => state.workflows, shallowEqual);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchWorkflow(id));
  }, []);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  console.log(translate, workflow);

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded loading={isFetching} />
    </>
  );
};

WorkflowContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default WorkflowContainer;
