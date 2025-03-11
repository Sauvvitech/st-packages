import { Logger } from 'traceability';

export const serviceLogInfoHandler = (
  message: string,
  event?: {
    eventName: string;
    eventData?: Object;
  },
): void => {
  Logger.info(message, event);
};
