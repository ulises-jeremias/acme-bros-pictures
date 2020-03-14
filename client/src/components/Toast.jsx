import React from 'react';
import { Message } from 'semantic-ui-react';

export default function Toast(props) {
  return <Message className="toast" {...props} />;
}
