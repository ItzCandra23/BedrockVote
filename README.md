# BedrockVote
**BedrockVote** is a reward plugin for Bedrock Server written by ItzCandra23. Gives reward to players that voted for your server on [MinecraftPocket-Servers.com](https://minecraftpocket-servers.com). And can customize the configuration and reward items easier in game.

## Vote Command
To get the Reward after vote, player can use command to claim reward but this command maybe no needed if Realtime Configuration actived
- **NPC:** `/scriptevent candra:vote vote`
- **Command:** `/scriptevent candra:vote vote <Player>`

## Reward
This addon can send a Reward Items after player vote or can send from specific command and you can edit this from in game easily with command
- **NPC:** `/scriptevent candra:vote reward`
- **Command:** `/scriptevent candra:vote reward <AdminName>`
```jsonc
[
    {
        "typeId": "iron_sword",
        "amount": 1,
        "nameTag": "Special Sword",
        "enchants": {
            "unbreaking": 3,
            "sharpness": 5
        },
        "lores": [
            "This sword very nice for kills chicken",
            "Thank you for your vote!"
        ]
    },
    {
        "typeId": "bread",
        "amount": 10,
        "lores": "Thank you for your vote!"
    },
    {
        "typeId": "diamond",
        "amount": 1,
        "nameTag": "",
        "lores": "Thank you for your vote!"
    }
]
```

## Configuration
This script addon have configuration that you can **edit it in game** with specific command
- **NPC:** `/scriptevent candra:vote config`
- **Command:** `/scriptevent candra:vote config <AdminName>`
```json
{
    // Server Key that you can get from the Website
    "serverKey": "r8e62bgNiEiKCRVaHeAO5XULJi5yqeHeND0",
    // Automaticly send a reward after player voting
    "realtime": true,
    // Send a messages after player vote this server
    "onClaim": {
        // Send message to all players
        "broadcast": "[BedrockVote] §e{player}§r§a has voted §b{server.name}§a and got a reward kit!\n§r§7Let's vote at §r{server.url}",
        // Send message to player that vote your server
        "message": "[BedrockVote] §aThank you for your voting!",
        // Send sound effect to player
        "sound": "note.pling"
    },
    // The error messages that sended to player from command
    "errClaim": {
        // Will be send if player use vote command for claim reward but not vote
        "notvoting": "§cYou haven't voted for this server yet.§r\n§7Vote §b{server.name}§7 at §e{server.url}",
        // Will be send if player use vote command and already claimed the reward
        "claimed": "§aYou have already voted today",
        // Error message from server connection or other reason
        "error": "§cError {status}"
    },
    // The urls that used for get or post a http request. {ServerKey} will be replace to serverKey from configuration and {Username} will be replace to player name.
    "urls": {
        "server": "https://minecraftpocket-servers.com/api/?object=servers&element=detail&key={ServerKey}",
        "checkvote": "https://minecraftpocket-servers.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}",
        "setvote": "https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}",
        "setvote_res": "1"
    }
}
```

## HEREE
- Links: **[[Download Here](https://adsafelink.com/7PnLWID)] [[Discord](https://discord.gg/zBvW9pb2Dz)]**
- Author: **[ItzCandra23](https://discordapp.com/users/822266948607148042)**
- License: **MIT License**
