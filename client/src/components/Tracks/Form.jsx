import _ from 'underscore';
import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Button,
  Divider,
} from 'semantic-ui-react';
import { renderTimeInput, renderSelect } from 'app/components/Form';
import { required } from 'app/validations/common';

const TrackForm = (props) => {
  const {
    translate,
    handleSubmit,
    onSubmit,
    submitting,
    songs,
  } = props;

  const songToText = (song) => `Name: ${song.title} Author: ${song.name || '-'}`;

  const songsOptions = _.map(songs, (song) => ({
    text: songToText(song),
    value: song,
    icon: 'music',
  }));

  const [options, setOptions] = useState(songsOptions);

  const handleAddition = (e, { value }) => {
    const [title, author] = value.split(';');
    const song = { title, author: author || '-' };
    setOptions([{ text: songToText(song), value: song, icon: 'music' }, ...options]);
  };

  return (
    <>
      <Header as="h1" color="orange" textAlign="left">
        {translate('create.title')}
      </Header>

      <Divider hidden />
      <Divider hidden />

      <Form size="tiny" onSubmit={handleSubmit(onSubmit)}>
        <Field
          component={renderSelect}
          required
          name="song"
          label={translate('create.song.label')}
          placeholder={translate('create.song.placeholder')}
          inputProps={{
            allowAdditions: true,
            clearable: true,
            onAddItem: handleAddition,
          }}
          options={options}
          validate={[required()]}
        />
        <Form.Group widths={4}>
          <Field
            component={renderTimeInput}
            required
            name="startTime"
            label={translate('create.startTime.label')}
            placeholder={translate('create.startTime.placeholder')}
            validate={[required()]}
          />
          <Field
            component={renderTimeInput}
            required
            name="endTime"
            label={translate('create.endTime.label')}
            placeholder={translate('create.endTime.placeholder')}
            validate={[required()]}
          />
          <Field
            component={renderTimeInput}
            required
            name="songStartTime"
            label={translate('create.songStartTime.label')}
            placeholder={translate('create.songStartTime.placeholder')}
            validate={[required()]}
          />
          <Field
            component={renderTimeInput}
            required
            name="songEndTime"
            label={translate('create.songEndTime.label')}
            placeholder={translate('create.songEndTime.placeholder')}
            validate={[required()]}
          />
        </Form.Group>

        <Divider hidden />

        <Button loading={submitting} color="orange" size="large" fluid>
          {translate('create.sendButton')}
        </Button>
      </Form>
    </>
  );
};

TrackForm.propTypes = {
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  songs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
  })).isRequired,
};

export default TrackForm;
