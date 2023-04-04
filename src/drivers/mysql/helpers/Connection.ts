import { ConnectionOptions } from '../../../types/connection';
import MySqlConnectionParams from '../types/connection';
import { defaultConnectionCount } from '../../../consts/connection';

export default class ConnectionHelper {
  static mapToConnectionObject(
    options: ConnectionOptions,
  ): MySqlConnectionParams {
    return {
      host: options.host,
      user: options.user,
      database: options.database,
      password: options.password,
      connectionLimit: options.maxConnection || defaultConnectionCount,
      multipleStatements: true,
    };
  }
}
