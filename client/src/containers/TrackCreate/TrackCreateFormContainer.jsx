import React, { useEffect } from 'react';
import { reduxForm } from 'redux-form';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import TrackCreate from 'app/components/Tracks/Form';
import { fetchSongs } from 'app/actions/songs';

const ConnectedTrackForm = reduxForm({
  form: 'trackCreateForm',
})(TrackCreate);

const TrackCreateContainer = (props) => {
  const { songs } = useSelector((state) => state.songs, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSongs());
  }, []);

  return <ConnectedTrackForm songs={songs} {...props} />;
};

export default TrackCreateContainer;
