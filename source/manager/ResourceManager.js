export class ResourceManager {

    constructor() {
        this._data = {};
    }

    async loadTable(name, url) {

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('get text error');
        }
        const text = await response.text();

        const parseResult = await new Promise((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                encoding: "UTF-8",
                complete: (results) => resolve(results),
                error: (err) => reject(err)
            });
        });

        const t = {};
        parseResult.data.forEach(row => {
            if (row.key) {
                const key = row.key;
                // delete row.key;
                t[key] = row;
            }
        });

        this._data[name] = t;
        return t;
    }

    getData(tableName, key){
        if (!this._data[tableName]) {
            throw new Error(`table [${tableName}] not exist`);
        }

        const table = this._data[tableName];

        if (!table[key]) {
            throw new Error(`key [${key}] not exist in table [${tableName}]`);
        }

        return table[key];
    }

    getTable(tableName){
        if (!this._data[tableName]) {
            throw new Error(`table [${tableName}] not exist`);
        }

        return  this._data[tableName];
    }
}