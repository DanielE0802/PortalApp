import { Request } from 'express';

/**
 * Extended Express Request interface with application-specific properties.
 */
export interface AppRequest extends Request {
  requestId?: string;
  token?: string;
}
