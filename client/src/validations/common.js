import {
  required as requiredValidator,
  length as lengthValidator,
  date as dateValidator,
  numericality as numericalityValidator,
} from 'redux-form-validators';

import i18next from 'i18next';

const messages = {};

i18next.loadNamespaces('common', () => {
  messages.required = () => i18next.t('common:validators.messages.required');
  messages.maximum = (max) => i18next.t('common:validators.messages.maximum', { max });
  messages.minimum = (min) => i18next.t('common:validators.messages.minimum', { min });
  messages.date = (format) => i18next.t('common:validators.messages.date', { format });
  messages.numericality = () => i18next.t('common:validators.messages.numericality');
  messages.confirmation = (field) => i18next.t('common:validators.messages.confirmation', { field });
});

export const required = (opt) => requiredValidator({
  message: messages.required(),
  ...opt,
});

export const maximum = (max = 255, opt) => lengthValidator({
  message: messages.maximum(max),
  max,
  ...opt,
});

export const minimum = (min = 255, opt) => lengthValidator({
  message: messages.minimum(min),
  min,
  ...opt,
});

export const date = (format = 'dd/mm/yyyy', opt) => dateValidator({
  message: messages.date(format),
  format,
  ...opt,
});

export const numericality = (opt) => numericalityValidator({
  message: messages.numericality(),
  ...opt,
});

export const confirmation = (field) => (value, allValues) => (
  value !== allValues[0][field]
    ? messages.confirmation(field)
    : undefined
);
