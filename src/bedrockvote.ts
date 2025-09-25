import { Player, system, world } from "@minecraft/server";
import VoteRequest, { VoteStatus } from "./request";
import VoteRewards from "./rewards";
import VoteConfiguration from "./configuration";

const claim_proccess = new Map<string, true>();

namespace BedrockVote {

    export function sendInfoMessage(player: Player) {
        const config = VoteConfiguration.getConfiguration();
        player.sendMessage(formatText(config.commandResponse.info, player.name))
    }

    export function sendClaimedMessage(player: Player) {
        const config = VoteConfiguration.getConfiguration();
        player.sendMessage(formatText(config.commandResponse.claimed, player.name))
    }

    export function sendVersionMessage(player: Player) {
        player.sendMessage(`§aName: §fBedrockVote\n§aVersion: §f2.0.0\n§aAuthor: §fItzCandra23\n§aLicense: §fMIT License\n§aSource: §ehttps://github.com/ItzCandra23/BedrockVote\n§aWebsite: §bhttps://candra-web.vercel.app/projects`);
    }

    // export function onPlayerVote(player: Player) {
    //     const config = VoteConfiguration.getConfiguration();

    //     if (config.onVoted.broadcast) world.sendMessage(formatText(config.onVoted.broadcast, player.name));
    //     if (config.onVoted.message) player.sendMessage(formatText(config.onVoted.message, player.name));
    //     if (config.onVoted.sound) player.playSound(config.onVoted.sound);

    //     if (config.onVoted.autoclaim) claimVote(player, true);
    // }

    export async function claimVote(player: Player, force: boolean = false) {
        if (claim_proccess.has(player.name)) return;

        const config = VoteConfiguration.getConfiguration();
        const status = force ? VoteStatus.Voted : (await VoteRequest.checkVoteStatus(player.name));

        if (status === VoteStatus.NotFound) return player.sendMessage(formatText(config.commandResponse.notvoted, player.name));
        if (status === VoteStatus.Claimed) return player.sendMessage(formatText(config.commandResponse.claimed, player.name));

        try {
            claim_proccess.set(player.name, true);

            const response = await VoteRequest.setVoteClaimed(player.name);
            if (!response) return player.sendMessage(formatText(config.commandResponse.notvoted, player.name));

            await sendReward(player);
        } 
        catch(err) {} 
        finally {
            claim_proccess.delete(player.name);
        }
    }

    export async function sendReward(player: Player): Promise<boolean> {
        const config = VoteConfiguration.getConfiguration();

        try {
            await VoteRewards.sendRewardsTo(player);

            if (config.onClaim.broadcast) world.sendMessage(formatText(config.onClaim.broadcast, player.name));
            if (config.onClaim.message) player.sendMessage(formatText(config.onClaim.message, player.name));
            if (config.onClaim.sound) player.playSound(config.onClaim.sound);

            return true;
        } catch(err) {
            return false;
        }
    }

    export function formatText(text: string, player?: string): string {
        const detailServer = VoteRequest.detail_server;
        let result = text;

        if (player) result = result.replaceAll(`{player}`, player);

        for (const [key, value] of Object.entries(detailServer) as [string, any][]) {
            result = result.replaceAll(`{server.${key}}`, value);
        }
        
        return result;
    }

    // export function interval() {
    //     for (const player of world.getAllPlayers()) {
            
    //     }
    // }
}

export default BedrockVote;

world.afterEvents.worldLoad.subscribe(() => {
    const config = VoteConfiguration.getConfiguration();

    if (config.broadcast.enable) {
        system.runInterval(() => {
            world.sendMessage(BedrockVote.formatText(config.broadcast.message));
        }, config.broadcast.run_interval * 20);
    }
});