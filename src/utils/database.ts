import { system, world } from "@minecraft/server";

namespace Database {
    
    export function set<T = any>(name: string, data?: T): void {
        // return new Promise((resolve) => {
        //     system.run(() => {
                if (data === undefined || data === null) world.setDynamicProperty(name);
                else world.setDynamicProperty(name, JSON.stringify(data));
        //         resolve();
        //     });
        // });
    }

    export function get<T = any>(name: string): T|undefined {
        try {
            const data = world.getDynamicProperty(name);
            if (typeof data !== "string") return undefined;
            return JSON.parse(data);
        } catch(err) { return undefined }
    }

    export function has(name: string): boolean {
        try {
            const data = world.getDynamicProperty(name);
            if (data === undefined) return false;
            else return true;
        } catch(err) { return false }
    }

    export function forEach(callback: (name: string, value: any, index: number, array: [string, any][]) => void): void {
        enteries().forEach((v, i, arr) => {
            callback(v[0], v[1], i, arr);
        });
    }
    
    export function keys(): string[] {
        try {
            return world.getDynamicPropertyIds();
        } catch(err) { return [] }
    }

    export function values(): any[] {
        let _values: any[] = [];

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
        } catch(err) {}

        return _values;
    }

    export function enteries(): [string, any][] {
        try {
            return world.getDynamicPropertyIds().map((v) => {
                const data = world.getDynamicProperty(v);
                if (data === undefined) return [v, undefined];
                const jsonData = JSON.parse(data.toString());
                return [v, jsonData];
            });
        } catch(err) { return [] }
    }

    export function size(): number {
        try {
            return world.getDynamicPropertyIds().length;
        } catch(err) { return 0 }
    }
}

export default Database;