import { http, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import VoteConfiguration from "./configuration";

export enum VoteStatus {
    NotFound,
    Voted,
    Claimed,
}

namespace VoteRequest {

    let lastUpdate = 0;
    export let detail_server: any = {};

    export function serverKey(): string {
        return VoteConfiguration.getConfiguration().serverKey;
    }

    export async function checkVoteStatus(username: string): Promise<VoteStatus> {
        const config = VoteConfiguration.getConfiguration();
        
        try {
            const query = config.urls.checkvoted.replace("{ServerKey}", config.serverKey).replace("{Username}", username);
            const result = await http.get(query);

            if (result.body === "1") return VoteStatus.Voted;
            if (result.body === "2") return VoteStatus.Claimed;
        } catch(err) {}

        return VoteStatus.NotFound;
    }

    export async function setVoteClaimed(username: string): Promise<boolean> {
        const config = VoteConfiguration.getConfiguration();
        
        try {
            const query = config.urls.setvoted.replace("{ServerKey}", config.serverKey).replace("{Username}", username);
            const req = new HttpRequest(query);

            req.method = HttpRequestMethod.POST;

            const result = await http.request(req);

            if (result.body === "1") return true;
        } catch(err) {}

        return false;
    }

    export async function server(): Promise<any> {
        const now = Date.now();

        if (now - lastUpdate >= 30_000) {
            const newDetailServer = await requestDetailServer();

            lastUpdate = now;
            if (newDetailServer) detail_server = newDetailServer;
        }

        return detail_server;
    }

    export async function requestDetailServer(): Promise<any> {
        const config = VoteConfiguration.getConfiguration();
        
        try {
            const query = config.urls.detailserver.replace("{ServerKey}", config.serverKey);
            const result = await http.get(query);
            if (result.status !== 200) throw new Error();

            return JSON.parse(result.body);
        } catch(err) {}

        return {};
    }
}

export default VoteRequest;