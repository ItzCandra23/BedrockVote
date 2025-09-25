import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, system } from "@minecraft/server";
import VoteRequest, { VoteStatus } from "./request";
import BedrockVote from "./bedrockvote";
import VoteConfiguration from "./configuration";
import VoteRewards from "./rewards";
system.beforeEvents.startup.subscribe((ev) => {
    const customCommand = ev.customCommandRegistry;
    customCommand.registerEnum("vote", [
        "info",
        "claim",
        "version"
    ]);
    customCommand.registerEnum("voteadmin", [
        "key",
        "config",
        "rewards"
    ]);
    customCommand.registerCommand({
        name: "bedrockvote:vote",
        description: "Shows the link to vote for the server.",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            {
                name: "vote",
                type: CustomCommandParamType.Enum,
            }
        ]
    }, (o, arg) => {
        const player = o.sourceEntity;
        if (!(player instanceof Player))
            return { status: CustomCommandStatus.Failure };
        if (arg === "info")
            BedrockVote.sendInfoMessage(player);
        else if (arg === "version")
            BedrockVote.sendVersionMessage(player);
        else if (arg === "claim")
            BedrockVote.claimVote(player);
        else
            (async () => {
                const status = await VoteRequest.checkVoteStatus(player.name);
                if (status === VoteStatus.NotFound)
                    return BedrockVote.sendInfoMessage(player);
                if (status === VoteStatus.Claimed)
                    return BedrockVote.sendClaimedMessage(player);
                BedrockVote.claimVote(player, true);
            })();
        return { status: CustomCommandStatus.Success };
    });
    customCommand.registerCommand({
        name: "bedrockvote:voteadmin",
        description: "Vote configuration commands.",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "voteadmin",
                type: CustomCommandParamType.Enum,
            }
        ],
        optionalParameters: [
            {
                name: "value",
                type: CustomCommandParamType.String,
            }
        ]
    }, (o, key, value) => {
        if (key === "key") {
            if (value) {
                VoteConfiguration.setServerKey(value);
                return {
                    status: CustomCommandStatus.Success,
                    message: `[BedrockVote] Set server key: "${value.trim()}"`,
                };
            }
            const data = VoteConfiguration.getServerKey();
            return {
                status: CustomCommandStatus.Success,
                message: `Server key: "${data}"`,
            };
        }
        if (key === "config") {
            if (value) {
                try {
                    const data = JSON.parse(value);
                    VoteConfiguration.setConfiguration(data);
                    return {
                        status: CustomCommandStatus.Success,
                        message: `[BedrockVote] Configuration updated!`,
                    };
                }
                catch (err) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: err.message
                    };
                }
            }
            const data = VoteConfiguration.getConfiguration();
            return {
                status: CustomCommandStatus.Success,
                message: `Configuration: ${JSON.stringify(data, undefined, 4)}`,
            };
        }
        if (key === "rewards") {
            if (value) {
                try {
                    const data = JSON.parse(value);
                    VoteRewards.setRewards(data);
                    return {
                        status: CustomCommandStatus.Success,
                        message: `[BedrockVote] Rewards updated!`,
                    };
                }
                catch (err) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: err.message
                    };
                }
            }
            const data = VoteRewards.getRawRewards();
            return {
                status: CustomCommandStatus.Success,
                message: `Rewards: ${JSON.stringify(data, undefined, 4)}`,
            };
        }
        return { status: CustomCommandStatus.Success };
    });
});
