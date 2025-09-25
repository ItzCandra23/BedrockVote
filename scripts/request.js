import { http, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import VoteConfiguration from "./configuration";
export var VoteStatus;
(function (VoteStatus) {
    VoteStatus[VoteStatus["NotFound"] = 0] = "NotFound";
    VoteStatus[VoteStatus["Voted"] = 1] = "Voted";
    VoteStatus[VoteStatus["Claimed"] = 2] = "Claimed";
})(VoteStatus || (VoteStatus = {}));
var VoteRequest;
(function (VoteRequest) {
    let lastUpdate = 0;
    VoteRequest.detail_server = {};
    function serverKey() {
        return VoteConfiguration.getConfiguration().serverKey;
    }
    VoteRequest.serverKey = serverKey;
    async function checkVoteStatus(username) {
        const config = VoteConfiguration.getConfiguration();
        try {
            const query = config.urls.checkvoted.replace("{ServerKey}", config.serverKey).replace("{Username}", username);
            const result = await http.get(query);
            if (result.body === "1")
                return VoteStatus.Voted;
            if (result.body === "2")
                return VoteStatus.Claimed;
        }
        catch (err) { }
        return VoteStatus.NotFound;
    }
    VoteRequest.checkVoteStatus = checkVoteStatus;
    async function setVoteClaimed(username) {
        const config = VoteConfiguration.getConfiguration();
        try {
            const query = config.urls.setvoted.replace("{ServerKey}", config.serverKey).replace("{Username}", username);
            const req = new HttpRequest(query);
            req.method = HttpRequestMethod.POST;
            const result = await http.request(req);
            if (result.body === "1")
                return true;
        }
        catch (err) { }
        return false;
    }
    VoteRequest.setVoteClaimed = setVoteClaimed;
    async function server() {
        const now = Date.now();
        if (now - lastUpdate >= 30_000) {
            const newDetailServer = await requestDetailServer();
            lastUpdate = now;
            if (newDetailServer)
                VoteRequest.detail_server = newDetailServer;
        }
        return VoteRequest.detail_server;
    }
    VoteRequest.server = server;
    async function requestDetailServer() {
        const config = VoteConfiguration.getConfiguration();
        try {
            const query = config.urls.detailserver.replace("{ServerKey}", config.serverKey);
            const result = await http.get(query);
            if (result.status !== 200)
                throw new Error();
            return JSON.parse(result.body);
        }
        catch (err) { }
        return {};
    }
    VoteRequest.requestDetailServer = requestDetailServer;
})(VoteRequest || (VoteRequest = {}));
export default VoteRequest;
