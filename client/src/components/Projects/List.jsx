import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { WatchingIcon as Watching } from 'app/components/Watching';
import {
  NOT_WATCHING,
  RELEASES_ONLY,
  WATCHING,
  IGNORING,
} from 'app/config/enums';

const Projects = (props) => {
  const { projects } = props;

  return (
    <Card.Group itemsPerRow={3}>
      {projects.map(({ watching, employeesCount, project }, i) => (
        <Card key={`project-${i + 1}`} color="orange" as={Link} to={`/projects/${project.id}`}>
          <Card.Content>
            <Image floated="right"><Watching watching={watching} /></Image>
            <Card.Header>{project.name}</Card.Header>
            <Card.Meta>
              <span>{moment(project.createdAt).fromNow()}</span>
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <span>
              <Icon name="user" />
              {employeesCount}
            </span>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

Projects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    watching: PropTypes.oneOf([NOT_WATCHING, RELEASES_ONLY, WATCHING, IGNORING]),
    project: PropTypes.shape({}).isRequired,
  })).isRequired,
};

export default Projects;
