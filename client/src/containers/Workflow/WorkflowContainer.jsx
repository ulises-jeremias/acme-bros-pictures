import _ from 'underscore';
import moment from 'moment-timezone';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import PropTypes from 'prop-types';
import {
  Card,
  Grid,
  Icon,
  Image,
  Segment,
  Divider,
} from 'semantic-ui-react';
import {
  TODO,
  RUNNING,
  SUCCESS,
  FAILED,

  STATUS_COLORS,
  STATUS_ICONS,
} from 'app/config/enums';
import { fetchWorkflow, createTask } from 'app/actions/workflows';
import TaskFormContainer from './TaskFormContainer';

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

  const onSubmit = (values) => dispatch(createTask({ ...values, workflowId: id }));

  const { tasks } = workflow;
  const todo = _.filter(tasks, (task) => task.status === TODO);
  const running = _.filter(tasks, (task) => task.status === RUNNING);
  const done = _.filter(tasks, (task) => [SUCCESS, FAILED].includes(task.status));

  const colums = [todo, running, done];

  return (
    <>
      <SemanticToastContainer className="toast" />
      <Segment padded loading={isFetching} style={{ height: '100%' }}>
        <TaskFormContainer
          translate={(name, ...args) => translate(`workflows:task.${name}`, ...args)}
          onSubmit={onSubmit}
        />

        <Divider hidden />
        <Divider hidden />

        <Grid columns={3}>
          {colums.map(((columnTasks, i) => (
            <Grid.Column key={`column-${i + 1}`}>
              <Segment placeholder style={{ minHeight: '100%' }}>
                <Card.Group itemsPerRow={1}>
                  {columnTasks.map((task, j) => (
                    <Card key={`task-${j + 1}`}>
                      <Card.Content>
                        <Image floated="right">
                          <Icon
                            loading={task.status === RUNNING}
                            name={STATUS_ICONS[task.status]}
                            color={STATUS_COLORS[task.status]}
                          />
                        </Image>
                        <Card.Header>{task.description}</Card.Header>
                        <Card.Meta>
                          <span>{moment(task.createdAt).fromNow()}</span>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              </Segment>
            </Grid.Column>
          )))}
        </Grid>
      </Segment>
    </>
  );
};

WorkflowContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default WorkflowContainer;
