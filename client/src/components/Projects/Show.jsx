import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import moment from 'moment-timezone';
import {
  Icon,
  Table,
  Button,
} from 'semantic-ui-react';
import { WatchingButton as Watching } from 'app/components/Watching';
import {
  NOT_WATCHING,
  RELEASES_ONLY,
  WATCHING,
  IGNORING,

  RUNNING,

  STATUS_COLORS,
  STATUS_ICONS,
} from 'app/config/enums';

const Project = (props) => {
  const { translate, project: { watching, data: project } } = props;
  const { push } = useHistory();

  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="8">
            {project.name}
            <Watching circular inverted watching={watching} floated="right" size="mini" />
            <Button
              onClick={() => push(`/projects/${project.id}/tracks/create`)}
              circular
              color="green"
              icon="plus"
              inverted
              size="mini"
              floated="right"
            />
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>{translate('track.song.title')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.song.author')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.startTime')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.endTime')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.songStartTime')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.songEndTime')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('track.workflowStatus.title')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {(project.tracks).map((track, i) => {
          const { workflow } = track;
          const hasWorkflow = !!workflow.id;

          return (
            <Table.Row key={`track-${i + 1}`}>
              <Table.Cell>
                <Icon name="music" color="grey" />
                {track.song.title}
              </Table.Cell>
              <Table.Cell>
                <Icon name="user" color="grey" />
                {track.song.author}
              </Table.Cell>
              <Table.Cell>{moment(track.startTime, 'hh:mm:ss').format('hh:mm:ss')}</Table.Cell>
              <Table.Cell>{moment(track.endTime, 'hh:mm:ss').format('hh:mm:ss')}</Table.Cell>
              <Table.Cell>{moment(track.songStartTime, 'hh:mm:ss').format('hh:mm:ss')}</Table.Cell>
              <Table.Cell>{moment(track.songEndTime, 'hh:mm:ss').format('hh:mm:ss')}</Table.Cell>
              <Table.Cell>
                {hasWorkflow ? (
                  <Button
                    onClick={() => push(`/workflows/${workflow.id}`)}
                    color={STATUS_COLORS[workflow.status]}
                    size="small"
                    basic
                  >
                    <span>
                      <Icon
                        loading={workflow.status === RUNNING}
                        name={STATUS_ICONS[workflow.status]}
                      />
                      {translate(`track.workflowStatus.status.${workflow.status}`)}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => push(`/tracks/${track.id}/workflow/create`)}
                    color="grey"
                    size="small"
                    basic
                  >
                    <span>
                      <Icon name="plus" />
                      {translate('track.workflowStatus.status.unknown')}
                    </span>
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.Cell>
            <Icon name="users" color="pink" />
            {translate('project.employees', { count: _.size(project.projectEmployees) })}
          </Table.Cell>
          <Table.Cell>
            <Icon name="music" color="blue" />
            {translate('project.tracks', { count: _.size(project.tracks) })}
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

Project.propTypes = {
  translate: PropTypes.func.isRequired,
  project: PropTypes.shape({
    watching: PropTypes.oneOf([NOT_WATCHING, RELEASES_ONLY, WATCHING, IGNORING]),
    data: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default Project;
