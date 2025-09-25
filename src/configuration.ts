import RawVoteConfiguration from "./data/config";
import Database from "./utils/database";

export interface Configuration {
    serverKey: string;
    broadcast: {
        message: string;
        run_interval: number;
        enable: boolean;
    };
    commandResponse: {
        info: string;
        claimed: string;
        notvoted: string;
    };
    // onVoted: {
    //     broadcast: string;
    //     message: string;
    //     sound: string;
    //     autoclaim: boolean;
    //     enable: boolean;
    // };
    onClaim: {
        broadcast: string;
        message: string;
        sound: string;
    };
    urls: {
        checkvoted: string;
        setvoted: string;
        detailserver: string;
    };
}

let config: Configuration = RawVoteConfiguration;

export class Configuration {}

namespace VoteConfiguration {

    export function updateConfiguration(): void {
        const data = Database.get("bedrockvote:configuration") || RawVoteConfiguration;
        config = data;
    }

    export function getConfiguration(): Configuration {
        return config;
    }

    export function setConfiguration(config: any): void {
        if (!(config instanceof Configuration)) throw new Error("[BedrockVote] Invalid configuration!");

        Database.set("bedrockvote:configuration", config);
        updateConfiguration();
    }

    export function getServerKey(): string {
        return config.serverKey;
    }

    export function setServerKey(key: string): void {
        if (!key.trim()) throw new Error("[BedrockVote] Invalid server key!");

        config.serverKey = key.trim();

        Database.set("bedrockvote:configuration", config);
    }
}

export default VoteConfiguration;