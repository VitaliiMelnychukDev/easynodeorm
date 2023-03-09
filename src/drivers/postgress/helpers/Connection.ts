import { ConnectionOptions } from '../../../types/connection';
import PostgresConnectionParams from '../types/connection';
import {
  defaultConnectionCount,
  defaultTimeout,
} from '../../../consts/connection';

export default class ConnectionHelper {
  static mapToConnectionObject(
    options: ConnectionOptions,
  ): PostgresConnectionParams {
    return {
      host: options.host,
      user: options.user,
      database: options.database,
      password: options.password,
      max: options.maxConnection || defaultConnectionCount,
      idleTimeoutMillis: options?.timeouts?.idle || defaultTimeout.idle,
      connectionTimeoutMillis:
        options?.timeouts?.connection || defaultTimeout.connection,
    };
  }
}
