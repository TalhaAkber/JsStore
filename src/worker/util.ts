import { DATA_TYPE } from "./enums";
import { Table } from "./model/table";
import { promise } from "./business/helpers/promise";
import { IdbHelper } from "./business/idb_helper";
import { KeyStore, QueryExecutor } from "./index";
import { QueryHelper } from "./business/query_helper";

export class Util {
    static isNull(value) {
        if (value == null) {
            return true;
        } else {
            switch (typeof value) {
                case 'string': return value.length === 0;
                case 'number': return isNaN(value);
            }
        }
        return false;
    }

    static isNullOrEmpty(value) {
        return value == null || value.length === 0;
    }

    static isString(value) {
        return typeof value === DATA_TYPE.String;
    }

    static isArray(value) {
        return Array.isArray(value);
    }

    static isObject(value) {
        return typeof value === DATA_TYPE.Object;
    }

    static getObjectFirstKey(value) {
        for (const key in value) {
            return key;
        }
        return null;
    }

    /**
     *  get data type of supplied value
     * 
     * @static
     * @param {any} value 
     * @returns 
     * @memberof Util
     */
    static getType(value) {
        if (value == null) {
            return DATA_TYPE.Null;
        }
        const type = typeof value;
        switch (type) {
            case 'object':
                if (Array.isArray(value)) {
                    return DATA_TYPE.Array;
                }
                else if (value.getDate && value.getTime) {
                    return DATA_TYPE.DateTime;
                }
            default:
                return type;
        }
    }

    static getAutoIncrementValues(table: Table): Promise<{ [columnName: string]: number }> {

        const autoIncColumns = table.columns.filter((col) => {
            return col.autoIncrement;
        });
        return promise((resolve, reject) => {
            Promise.all(autoIncColumns.map(column => {
                const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${table.name}_${column.name}_Value`;
                return KeyStore.get(autoIncrementKey);
            })).then(results => {
                const autoIncValues = {};
                for (var i = 0; i < autoIncColumns.length; i++) {
                    autoIncValues[autoIncColumns[i].name] = results[i];
                }
                resolve(autoIncValues);
            }).catch(reject);
        });
    }

    static setAutoIncrementValue(table: Table, autoIncrementValue: object) {
        const keys = Object.keys(autoIncrementValue);
        return Promise.all(keys.map((columnName) => {
            const autoIncrementKey = `JsStore_${IdbHelper.activeDb.name}_${table.name}_${columnName}_Value`;
            const value = autoIncrementValue[columnName];
            if (QueryExecutor.isTransactionQuery === true) {
                QueryHelper.autoIncrementValues[table.name][columnName] = value
            }
            return KeyStore.set(
                autoIncrementKey,
                value
            )
        }));
    }

}