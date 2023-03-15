import { isSelect, Select } from '../types/select';
import { isSubQueryWithAlias, Table } from '../types/table';
import { isRequiredAlias, RequiredAlias } from '../types/base';
import {
  AggregationColumn,
  Column,
  DistinctColumn,
  isAggregationColumn,
  isDistinctColumn,
} from '../types/column';
import {
  Between,
  ColumnCondition,
  Condition,
  ConditionValues,
  DefaultTypeOrSubQuery,
  InConditionValue,
  isBetween,
  isDefaultType,
  isDefaultTypeOrSubQuery,
  isLogicalWhere,
  LogicalOperator,
  LogicalWhere,
  SupportedConditionOperators,
  Where,
} from '../types/where';
import QueryBuilderHelper from '../helpers/QueryBuilderHelper';
import WrongSelectQuery from '../../error/WrongSelectQuery';
import { AllowedTypesToMakeQueryWith } from '../../types/global';
import { Order, OrderBy } from '../types/order';
import { Join, JoinVariant } from '../types/join';
import SelectBuilder from '../types/builders/SelectBuilder';
import { fromStatement } from '../consts/sqlStatements';

class BaseSelectBuilder implements SelectBuilder {
  public distinctStatement = 'DISTINCT';
  public selectStatement = 'SELECT';
  public fromStatement = fromStatement;
  public whereStatement = 'WHERE';
  public groupByStatement = 'GROUP BY';
  public havingStatement = 'HAVING';
  public limitStatement = 'LIMIT';
  public offsetStatement = 'OFFSET';
  public orderByStatement = 'ORDER BY';

  getAliasPart(alias: string): string {
    return alias ? `AS ${alias}` : '';
  }
  getRequiredAlias(aliesObj: RequiredAlias): string {
    if (!aliesObj.name) {
      throw new WrongSelectQuery(
        'Select Query: column ot table name can not be empty',
      );
    }

    return `${aliesObj.name} ${this.getAliasPart(aliesObj.alias)}`;
  }
  getTableName(table: Table): string {
    if (isSubQueryWithAlias(table)) {
      const tableQuery = this.getSelectSql(table.subQuery);

      return `(${tableQuery}) AS ${table.alias}`;
    }

    if (isRequiredAlias(table)) {
      return this.getRequiredAlias(table);
    }

    if (!table) {
      throw new WrongSelectQuery('Select Query: table name can not be empty');
    }

    return table;
  }

  getDistinctColumn(distinctColumn: DistinctColumn): string {
    const distinctSql = distinctColumn.distinct ? this.distinctStatement : '';

    return `${distinctSql} ${distinctColumn.name} ${this.getAliasPart(
      distinctColumn.alias,
    )}`;
  }

  getColumnWithAggregationMethod(aggregationColumn: AggregationColumn): string {
    if (!aggregationColumn.aggregationMethod) {
      throw new WrongSelectQuery(
        'Select Query: aggregationMethod can not be empty',
      );
    }

    return `${aggregationColumn.aggregationMethod}(${
      aggregationColumn.name
    }) ${this.getAliasPart(aggregationColumn.alias)}`;
  }

  getColumn(column: Column): string {
    if (isDistinctColumn(column)) {
      return this.getDistinctColumn(column);
    }

    if (isAggregationColumn(column)) {
      return this.getColumnWithAggregationMethod(column);
    }

    if (isRequiredAlias(column)) {
      return this.getRequiredAlias(column);
    }

    if (!column) {
      throw new WrongSelectQuery('Select Query: column name can not be empty');
    }

    return column;
  }

  getColumns(columns?: Column[]): string {
    if (!columns || !columns.length) {
      return '*';
    }

    return columns.map((column) => this.getColumn(column)).join(', ');
  }
  getSQLLogicalOperator(operator: LogicalOperator): string {
    switch (operator) {
      case LogicalOperator.And:
        return 'AND';
      case LogicalOperator.Not:
        return 'NOT';
      case LogicalOperator.Or:
        return 'OR';
    }
  }

  getSQLOperatorByOperation(operation: SupportedConditionOperators): string {
    switch (operation) {
      case 'equal':
        return '=';
      case 'notEqual':
        return '<>';
      case 'greaterThan':
        return '>';
      case 'greaterThanEqual':
        return '>=';
      case 'lowerThan':
        return '<';
      case 'lowerThanEqual':
        return '<=';
      case 'is':
        return 'IS';
      case 'like':
        return 'LIKE';
      case 'between':
        return 'BETWEEN';
      case 'in':
        return 'IN';
      default:
        throw new WrongSelectQuery(
          `Select Query: operator ${operation} is not supported`,
        );
    }
  }

  getConditionValue(value: DefaultTypeOrSubQuery): AllowedTypesToMakeQueryWith {
    return isSelect(value)
      ? `(${this.getSelectSql(value)})`
      : QueryBuilderHelper.prepareValue(value);
  }

  getSimpleCondition(
    column: string,
    conditionMark: string,
    value: DefaultTypeOrSubQuery,
  ): string {
    return `${column} ${conditionMark} ${this.getConditionValue(value)}`;
  }

  getBetweenCondition(
    column: string,
    conditionMark: string,
    value: Between,
  ): string {
    return `${column} ${conditionMark} ${this.getConditionValue(
      value.lower,
    )} AND ${this.getConditionValue(value.upper)}`;
  }

  getInCondition(
    column: string,
    conditionMark: string,
    value: InConditionValue,
  ): string {
    if (isSelect(value)) {
      return this.getSimpleCondition(column, conditionMark, value);
    }

    return `${column} ${conditionMark} ${QueryBuilderHelper.getEnumValuesQuery(
      value,
    )}`;
  }

  getSingleCondition<T extends SupportedConditionOperators>(
    column: string,
    operation: T,
    values: ConditionValues[T],
  ): string {
    const sqlOperator = this.getSQLOperatorByOperation(operation);

    if (isDefaultTypeOrSubQuery(values)) {
      return this.getSimpleCondition(column, sqlOperator, values);
    }

    if (isBetween(values)) {
      return this.getBetweenCondition(column, sqlOperator, values);
    }

    if (Array.isArray(values) && !values.length) {
      throw new WrongSelectQuery(
        'Select Query: In operator can not have empty array.',
      );
    }

    return this.getInCondition(column, sqlOperator, values);
  }

  getConditions(
    column: string,
    conditions: Condition,
    logicalOperatorToConnect = LogicalOperator.And,
  ): string {
    const operations = Object.keys(conditions);

    const conditionsSql = operations
      .map((operation) => {
        return this.getSingleCondition(
          column,
          operation as SupportedConditionOperators,
          conditions[operation],
        );
      })
      .join(` ${this.getSQLLogicalOperator(logicalOperatorToConnect)} `);

    return operations.length > 1 ? `(${conditionsSql})` : conditionsSql;
  }

  getColumnConditions(
    columnConditions: ColumnCondition<string>,
    logicalOperatorToConnect = LogicalOperator.And,
  ): string {
    const columnNames = Object.keys(columnConditions);
    const equalMark = this.getSQLOperatorByOperation('equal');

    const columnConditionsSql = columnNames.map((columnName) => {
      const columnValue = columnConditions[columnName];

      if (isDefaultType(columnValue)) {
        return this.getSimpleCondition(columnName, equalMark, columnValue);
      }

      return this.getConditions(columnName, columnValue);
    });

    const connectedColumnConditionsSql = columnConditionsSql.join(
      ` ${this.getSQLLogicalOperator(logicalOperatorToConnect)} `,
    );

    return columnConditionsSql.length > 1
      ? `(${connectedColumnConditionsSql})`
      : connectedColumnConditionsSql;
  }

  getWhereConditions(condition: Where<string>): string {
    return isLogicalWhere(condition)
      ? this.getLogicalWhere(condition)
      : this.getColumnConditions(condition);
  }
  getLogicalWhere(logicalWhere: LogicalWhere<string>): string {
    const logicalPartsOperatorConnector =
      logicalWhere.logicalOperator === LogicalOperator.Not
        ? LogicalOperator.And
        : logicalWhere.logicalOperator;

    const logicalParts = logicalWhere.conditions.map((condition) => {
      return this.getWhereConditions(condition);
    });

    const connectedLogicalParts = logicalParts.join(
      ` ${this.getSQLLogicalOperator(logicalPartsOperatorConnector)} `,
    );

    const wrappedConditionParts = `(${connectedLogicalParts})`;

    return logicalWhere.logicalOperator === LogicalOperator.Not
      ? `${this.getSQLLogicalOperator(
          logicalWhere.logicalOperator,
        )} ${wrappedConditionParts}`
      : wrappedConditionParts;
  }

  getWhereSql(where?: Where<string>): string {
    return where
      ? `${this.whereStatement} ${this.getWhereConditions(where)}`
      : '';
  }

  getHaving(where?: Where<string>): string {
    return where
      ? `${this.havingStatement} ${this.getWhereConditions(where)}`
      : '';
  }

  getGroupBy(columns?: string[]): string {
    if (!columns || !columns.length) return '';

    columns.forEach((column) => {
      if (column) {
        throw new WrongSelectQuery(
          'Select Query: group by can not have empty column',
        );
      }
    });

    return `${this.groupByStatement} ${columns.join(',')}`;
  }

  getLimit(limit?: number): string {
    if (!limit) return '';

    if (limit < 0 || !Number.isInteger(limit)) {
      throw new WrongSelectQuery(
        'Select Query: Limit should be positive integer',
      );
    }

    return `${this.limitStatement} ${limit}`;
  }

  getOffset(offset?: number): string {
    if (!offset) return '';

    if (offset < 0 || !Number.isInteger(offset)) {
      throw new WrongSelectQuery(
        'Select Query: Offset should be positive integer',
      );
    }

    return `${this.offsetStatement} ${offset}`;
  }

  getSqlOrder(order: Order): string {
    switch (order) {
      case Order.Asc:
        return 'ASC';
      case Order.Desc:
        return 'DESC';
    }
  }

  getOrderBy(orderByOptions?: OrderBy[]): string {
    if (!orderByOptions?.length) return '';

    const orderBySqlParts = orderByOptions.map((orderBy) => {
      if (!orderBy.column) {
        throw new WrongSelectQuery(
          'Select Query: order can not have empty column',
        );
      }

      const orderSql = orderBy.order ? this.getSqlOrder(orderBy.order) : '';

      return `${orderBy.column} ${orderSql}`;
    });

    return `${this.orderByStatement} ${orderBySqlParts.join(',')}`;
  }

  getSqlJoin(join: JoinVariant): string {
    switch (join) {
      case JoinVariant.Inner:
        return 'INNER JOIN';
      case JoinVariant.Left:
        return 'LEFT JOIN';
      case JoinVariant.Right:
        return 'RIGHT JOIN';
      case JoinVariant.FullOuter:
        return 'FULL OUTER JOIN';
    }
  }

  getJoins(joins: Join[]): string {
    if (!joins?.length) return '';

    return joins
      .map((join) => {
        if (!join.table || !join.on.column || !join.on.joinTableColumn) {
          throw new WrongSelectQuery(
            'Select Query: join can not have empty table, on.column or on.joinTableColumn values',
          );
        }

        return `${this.getSqlJoin(join.type)} ${this.getTableName(
          join.table,
        )} ON ${join.on.column} = ${join.on.joinTableColumn}`;
      })
      .join(' ');
  }

  validateSelectOptions(options: Select<string>): void {
    if (options.having && !options.groupBy?.length) {
      throw new WrongSelectQuery(
        'Select Query: Having part of select request can not work without groupBy. Please specify both.',
      );
    }
  }
  getSelectSql(options: Select<string>): string {
    this.validateSelectOptions(options);

    const tableNameSql = this.getTableName(options.table);
    const columnsSql = this.getColumns(options.columns);
    const joinsSql = this.getJoins(options.joins);
    const whereSql = this.getWhereSql(options.where);
    const groupBySql = this.getGroupBy(options.groupBy);
    const havingSql = this.getHaving(options.having);
    const orderBySql = this.getOrderBy(options.order);
    const limitSql = this.getLimit(options.limit);
    const offsetSql = this.getOffset(options.offset);

    return `${this.selectStatement} ${columnsSql} ${this.fromStatement} ${tableNameSql} ${joinsSql} ${whereSql} ${groupBySql} ${havingSql} ${orderBySql} ${limitSql} ${offsetSql}`;
  }
}

export default BaseSelectBuilder;
