const RawVoteConfiguration = {
    "serverKey": "",
    "broadcast": {
        "enable": true,
        "message": "§7==== === §bVOTE {server.name} §r§7=== ====§r\n§aVote this server and get some rewards!\n§7 - §e{server.url}",
        "run_interval": 300
    },
    "commandResponse": {
        "info": "§aVote {server.name} and get some rewards!\n§7 - §e{server.url}",
        "claimed": "§aYou already voted today!",
        "notvoted": "§cYou haven't voted for this server yet.§r\n§7Vote §b{server.name}§7 at §e{server.url}"
    },
    "onClaim": {
        "broadcast": "§b{player} §aclaimed some rewards for voting this server! §e/vote§a for more info.",
        "message": "§aVote rewards claimed! Thank you for voting this server!",
        "sound": "random.levelup"
    },
    "urls": {
        "checkvoted": "https://minecraftpocket-servers.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}",
        "setvoted": "https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}",
        "detailserver": "https://minecraftpocket-servers.com/api/?object=servers&element=detail&key={ServerKey}"
    }
};
// const RawVoteConfiguration: Configuration = {
//     "serverKey": "",
//     "broadcast": {
//         "enable": true,
//         "message": "§7==== === §bVOTE {server1.name} §r§7=== ====§r\n§aVote this server and get some rewards!\n§7 - §e{server1.url}\n§7 - §e{server2.url}",
//         "run_interval": 300
//     },
//     "commandResponse": {
//         "urls": "§aServer urls:\n§7 - §e{server1.url}\n§7 - §e{server2.url}",
//         "claimed": "§aYou already voted today!\n§bRun §e/vote urls§b for server links"
//     },
//     "onVoted": {
//         "broadcast": "§b{player} §avoted this server! §e/vote§a for more info.",
//         "message": "§aThank you for voting this server! Use §e/vote§a to claim it!",
//         "sound": "random.orb",
//         "autoclaim": false,
//         "enable": true
//     },
//     "onClaim": {
//         "broadcast": "§b{player} §aclaimed some rewards for voting this server! §e/vote§a for more info.",
//         "message": "§aVote rewards claimed!",
//         "sound": "random.levelup"
//     },
//     "urls": [
//         {
//             "checkvoted": "https://minecraftpocket-servers.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}",
//             "setvoted": "https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}",
//             "detailserver": "https://minecraftpocket-servers.com/api/?object=servers&element=detail&key={ServerKey}"
//         },
//         {
//             "checkvoted": "https://minecraft-mp.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}",
//             "setvoted": "https://minecraft-mp.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}",
//             "detailserver": "https://minecraft-mp.com/api/?object=servers&element=detail&key={ServerKey}"
//         }
//     ]
// };
export default RawVoteConfiguration;
