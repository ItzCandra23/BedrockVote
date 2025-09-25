import { system, world } from "@minecraft/server";
import VoteRequest, { VoteStatus } from "./request";
import VoteRewards from "./rewards";
import VoteConfiguration from "./configuration";
const claim_proccess = new Map();
var BedrockVote;
(function (BedrockVote) {
    function sendInfoMessage(player) {
        const config = VoteConfiguration.getConfiguration();
        player.sendMessage(formatText(config.commandResponse.info, player.name));
    }
    BedrockVote.sendInfoMessage = sendInfoMessage;
    function sendClaimedMessage(player) {
        const config = VoteConfiguration.getConfiguration();
        player.sendMessage(formatText(config.commandResponse.claimed, player.name));
    }
    BedrockVote.sendClaimedMessage = sendClaimedMessage;
    function sendVersionMessage(player) {
        player.sendMessage(`§aName: §fBedrockVote\n§aVersion: §f2.0.0\n§aAuthor: §fItzCandra23\n§aLicense: §fMIT License\n§aSource: §ehttps://github.com/ItzCandra23/BedrockVote\n§aWebsite: §bhttps://candra-web.vercel.app/projects`);
    }
    BedrockVote.sendVersionMessage = sendVersionMessage;
    // export function onPlayerVote(player: Player) {
    //     const config = VoteConfiguration.getConfiguration();
    //     if (config.onVoted.broadcast) world.sendMessage(formatText(config.onVoted.broadcast, player.name));
    //     if (config.onVoted.message) player.sendMessage(formatText(config.onVoted.message, player.name));
    //     if (config.onVoted.sound) player.playSound(config.onVoted.sound);
    //     if (config.onVoted.autoclaim) claimVote(player, true);
    // }
    async function claimVote(player, force = false) {
        if (claim_proccess.has(player.name))
            return;
        const config = VoteConfiguration.getConfiguration();
        const status = force ? VoteStatus.Voted : (await VoteRequest.checkVoteStatus(player.name));
        if (status === VoteStatus.NotFound)
            return player.sendMessage(formatText(config.commandResponse.notvoted, player.name));
        if (status === VoteStatus.Claimed)
            return player.sendMessage(formatText(config.commandResponse.claimed, player.name));
        try {
            claim_proccess.set(player.name, true);
            const response = await VoteRequest.setVoteClaimed(player.name);
            if (!response)
                return player.sendMessage(formatText(config.commandResponse.notvoted, player.name));
            await sendReward(player);
        }
        catch (err) { }
        finally {
            claim_proccess.delete(player.name);
        }
    }
    BedrockVote.claimVote = claimVote;
    async function sendReward(player) {
        const config = VoteConfiguration.getConfiguration();
        try {
            await VoteRewards.sendRewardsTo(player);
            if (config.onClaim.broadcast)
                world.sendMessage(formatText(config.onClaim.broadcast, player.name));
            if (config.onClaim.message)
                player.sendMessage(formatText(config.onClaim.message, player.name));
            if (config.onClaim.sound)
                player.playSound(config.onClaim.sound);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    BedrockVote.sendReward = sendReward;
    function formatText(text, player) {
        const detailServer = VoteRequest.detail_server;
        let result = text;
        if (player)
            result = result.replaceAll(`{player}`, player);
        for (const [key, value] of Object.entries(detailServer)) {
            result = result.replaceAll(`{server.${key}}`, value);
        }
        return result;
    }
    BedrockVote.formatText = formatText;
    // export function interval() {
    //     for (const player of world.getAllPlayers()) {
    //     }
    // }
})(BedrockVote || (BedrockVote = {}));
export default BedrockVote;
world.afterEvents.worldLoad.subscribe(() => {
    const config = VoteConfiguration.getConfiguration();
    if (config.broadcast.enable) {
        system.runInterval(() => {
            world.sendMessage(BedrockVote.formatText(config.broadcast.message));
        }, config.broadcast.run_interval * 20);
    }
});
