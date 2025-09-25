import { world } from "@minecraft/server";
var Database;
(function (Database) {
    function set(name, data) {
        // return new Promise((resolve) => {
        //     system.run(() => {
        if (data === undefined || data === null)
            world.setDynamicProperty(name);
        else
            world.setDynamicProperty(name, JSON.stringify(data));
        //         resolve();
        //     });
        // });
    }
    Database.set = set;
    function get(name) {
        try {
            const data = world.getDynamicProperty(name);
            if (typeof data !== "string")
                return undefined;
            return JSON.parse(data);
        }
        catch (err) {
            return undefined;
        }
    }
    Database.get = get;
    function has(name) {
        try {
            const data = world.getDynamicProperty(name);
            if (data === undefined)
                return false;
            else
                return true;
        }
        catch (err) {
            return false;
        }
    }
    Database.has = has;
    function forEach(callback) {
        enteries().forEach((v, i, arr) => {
            callback(v[0], v[1], i, arr);
        });
    }
    Database.forEach = forEach;
    function keys() {
        try {
            return world.getDynamicPropertyIds();
        }
        catch (err) {
            return [];
        }
    }
    Database.keys = keys;
    function values() {
        let _values = [];
        try {
            world.getDynamicPropertyIds().forEach((v) => {
                const data = world.getDynamicProperty(v);
                if (data === undefined) {
                    _values.push(undefined);
                    return;
                }
                const jsonData = JSON.parse(data.toString());
                _values.push(jsonData);
            });
        }
        catch (err) { }
        return _values;
    }
    Database.values = values;
    function enteries() {
        try {
            return world.getDynamicPropertyIds().map((v) => {
                const data = world.getDynamicProperty(v);
                if (data === undefined)
                    return [v, undefined];
                const jsonData = JSON.parse(data.toString());
                return [v, jsonData];
            });
        }
        catch (err) {
            return [];
        }
    }
    Database.enteries = enteries;
    function size() {
        try {
            return world.getDynamicPropertyIds().length;
        }
        catch (err) {
            return 0;
        }
    }
    Database.size = size;
})(Database || (Database = {}));
export default Database;
