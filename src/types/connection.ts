import { SupportedDatabases } from './global';

export type ConnectionOptions = {
  name: SupportedDatabases;
  host: string;
  user: string;
  database: string;
  password: string;
  maxConnection?: number;
  timeouts?: {
    idle?: number;

    connection?: number;
  };
};
