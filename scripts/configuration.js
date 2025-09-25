import RawVoteConfiguration from "./data/config";
import Database from "./utils/database";
let config = RawVoteConfiguration;
export class Configuration {
}
var VoteConfiguration;
(function (VoteConfiguration) {
    function updateConfiguration() {
        const data = Database.get("bedrockvote:configuration") || RawVoteConfiguration;
        config = data;
    }
    VoteConfiguration.updateConfiguration = updateConfiguration;
    function getConfiguration() {
        return config;
    }
    VoteConfiguration.getConfiguration = getConfiguration;
    function setConfiguration(config) {
        if (!(config instanceof Configuration))
            throw new Error("[BedrockVote] Invalid configuration!");
        Database.set("bedrockvote:configuration", config);
        updateConfiguration();
    }
    VoteConfiguration.setConfiguration = setConfiguration;
    function getServerKey() {
        return config.serverKey;
    }
    VoteConfiguration.getServerKey = getServerKey;
    function setServerKey(key) {
        if (!key.trim())
            throw new Error("[BedrockVote] Invalid server key!");
        config.serverKey = key.trim();
        Database.set("bedrockvote:configuration", config);
    }
    VoteConfiguration.setServerKey = setServerKey;
})(VoteConfiguration || (VoteConfiguration = {}));
export default VoteConfiguration;
