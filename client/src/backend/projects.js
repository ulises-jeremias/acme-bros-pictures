import _ from 'underscore';
import { request } from 'app/lib/request';
import {
  TODO,
  RUNNING,
  SUCCESS,
  FAILED,
} from 'app/config/enums';

export const fetchProjects = (token) => request({
  url: '/projects',
}, token);

export const fetchProject = (id, token) => request({
  url: `/projects/${id}`,
}, token)
  .then(({ status, data }) => {
    const { watching, project } = data;
    const omit = [
      '__projectEmployees__',
      '__tracks__',
      '__has_projectEmployees__',
      '__has_tracks__',
    ];

    const tracks = _.map(project.projectTracks || [], (track) => {
      const workflow = track.workflow || { id: null, __tasks__: [] };
      workflow.tasks = workflow.__tasks__ || [];

      const { tasks } = workflow;

      if (tasks.find((task) => task.status === FAILED)) {
        workflow.status = FAILED;
      } else if (tasks.find((task) => task.status === RUNNING)) {
        workflow.status = RUNNING;
      } else if (tasks.find((task) => task.status === TODO)) {
        workflow.status = TODO;
      } else if (tasks.find((task) => task.status === SUCCESS)) {
        workflow.status = SUCCESS;
      } else {
        workflow.status = TODO;
      }

      return {
        ..._.omit(track, '__song__, __workflow__'),
        song: track.__song__,
        workflow: workflow || {},
      };
    });

    const nextData = {
      watching,
      project: {
        ..._.omit(project, ...omit),
        projectEmployees: project.__projectEmployees__ || [],
        tracks,
      },
    };

    return { status, data: nextData };
  });

export const createProject = (data, token) => request({
  url: '/projects',
  method: 'POST',
  data,
}, token);

export default {
  fetchProjects,
  fetchProject,
  createProject,
};
