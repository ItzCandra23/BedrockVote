# BedrockVote

![Icon](/images/BedrockVoteBannerLong.jpg)

**BedrockVote** is a server vote system for Dedicated Bedrock Server written by **ItzCandra23**. Gives reward to players that voting for your server on [MinecraftPocket-Servers.com](https://minecraftpocket-servers.com) or [Minecraft-MP.com](https://minecraft-mp.com). Optimized, Customizable, and Easy to use make this addon suitable for your server.

## Vote Commands

This addon can send rewards for players who voting this server and claim it with run `/vote` commands

- /vote - `Claim vote rewards`
- /vote claim - `Claim vote rewards`
- /vote info - `Send vote link`
- /vote version - `Version of BedrockVote`

## VoteAdmin Commands

This addon is Customizable and you can customize it with `/voteadmin` commands

- /voteadmin key - `Send vote server key`
- /voteadmin config - `Send BedrockVote configuration`
- /voteadmin rewards - `Send rewards configuration`
- /voteadmin key \<ServerKey\> - `Set vote server key`
- /voteadmin config \<Configuration\> - `Set BedrockVote configuration`
- /voteadmin rewards \<Rewards\> - `Set rewards configuration`

## Rewards

This addon have rewards system that give it to players when vote and claim the rewards. The rewards can be customize it with sending the new `Rewards` format with [*escaped JSON*](https://www.devtoolsdaily.com/json/escape) and run the command

- Type **Rewards** = List of `ItemData` or `RunCommand`
- `/voteadmin rewards <EscapedJSON of Rewards>`

### Type: ItemData

| Key                  | What it is            | Required? | Explanation                                                      |
| -------------------- | --------------------- | --------- | --------------------------------------------------------------------- |
| **typeId**           | Item ID (text)        | ✅ Yes     | The main ID of the Minecraft item (like `"minecraft:diamond_sword"`). |
| **amount**           | Number                | ❌ No      | How many of that item you get.                                        |
| **name**             | Text                  | ❌ No      | A custom name you can give to the item.                               |
| **lores**            | Text or list of texts | ❌ No      | Extra description lines under the item name.                          |
| **enchants**         | Enchant list          | ❌ No      | Special powers added to the item (e.g., Sharpness 5).                 |
| **durabilityDamage** | Number                | ❌ No      | How much the item has been used (wear and tear).                      |
| **canDestroy**       | List of block IDs     | ❌ No      | Which blocks the item can break in Adventure mode.                    |
| **canPlaceOn**       | List of block IDs     | ❌ No      | Which blocks the item can be placed on in Adventure mode.             |
| **lockMode**         | Text                  | ❌ No      | Prevents moving or changing the item (like a locked slot).            |
| **keepOnDeath**      | True/False            | ❌ No      | If true, you keep the item after dying.                               |

### Type: RunCommand

| Key         | What it is       | Required? | Explanation                                                   |
| ----------- | ---------------- | --------- | ------------------------------------------------------------------ |
| **actor**   | Who runs it      | ❌ No     | Who will execute the command (for example `player` or `server`).   |
| **commands**| Command(s)       | ✅ Yes    | The command or list of commands to run. Can be one or multiple.    |

### Rewards Example

Here some Rewards example

```json
[
    {
        "typeId": "iron_sword",
        "amount": 1,
        "name": "Special Sword",
        "enchants": {
            "unbreaking": 3,
            "sharpness": 5
        },
        "lores": [
            "This sword very nice for cutting a cheesecake",
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
        "name": "",
        "lores": "Thank you for your vote!"
    },
    {
        "commands": "effect @s jump_boost 120"
    }
    {
        "actor": "server",
        "commands": "effect {player} speed 120"
    }
]
```

### Command Example

Example command for update the vote rewards

```
/voteadmin rewards "[{\"typeId\":\"iron_sword\",\"amount\":1,\"name\":\"Special Sword\",\"enchants\":{\"unbreaking\":3,\"sharpness\": 5},\"lores\":[\"This sword very nice for cutting a cheesecake\",\"Thank you for your vote!\"]},{\"typeId\":\"bread\",\"amount\":10,\"lores\":\"Thank you for your vote!\"},{\"typeId\":\"diamond\",\"lores\":\"Thank you for your vote!\"},{\"commands\":\"effect @s jump_boost 120\"},{\"actor\":\"server\",\"commands\":\"effect {player} speed 120\"}]"
```

## Configuration

This addon have configuration that you can customize the messages, vote server, and much more. With sending the new `Configuration` format with [*escaped JSON*](https://www.devtoolsdaily.com/json/escape) and send it with running the command, your configuration is now updated

- `/voteadmin config <EscapedJSON of Configuration>`

### Configuration Example

Example of server vote configuration

```ts
{
    // Server Key that you can get from minecraft servers website
    "serverKey": "r8e62bgNiEiKCRVaHeAO5XULJi5yqeHeND0",

    // Automaticly send message every a few seconds
    "broadcast": {
        "enable": true,
        "message": "§7==== === §bVOTE {server.name} §r§7=== ====§r\n§aVote this server and get some rewards!\n§7 - §e{server.url}",
        "run_interval": 300
    },

    // Messages that used for response the vote commands
    "commandResponse": {
        "info": "§aVote {server.name} and get some rewards!\n§7 - §e{server.url}",
        "claimed": "§aYou already voted today!",
        "notvoted": "§cYou haven't voted for this server yet.§r\n§7Vote §b{server.name}§7 at §e{server.url}"
    },

    // Messages that sended when player claim the rewards
    "onClaim": {
        "broadcast": "§b{player} §aclaimed some rewards for voting this server! §e/vote§a for more info.",
        "message": "§aVote rewards claimed! Thank you for voting this server!",
        "sound": "random.levelup"
    },

    // Urls for sending vote request that you can get it from MinecraftPocket-Servers.com or Minecraft-MP.com
    "urls": {
        "checkvoted": "https://minecraftpocket-servers.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}",
        "setvoted": "https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}",
        "detailserver": "https://minecraftpocket-servers.com/api/?object=servers&element=detail&key={ServerKey}"
    }
}
```

### Command Example

Example command for update the server vote configuration

```
/voteadmin config "{\"serverKey\":\"r8e62bgNiEiKCRVaHeAO5XULJi5yqeHeND0\",\"broadcast\":{\"enable\":true,\"message\":\"§7==== === §bVOTE {server.name} §r§7=== ====§r\\n§aVote this server and get some rewards!\\n§7 - §e{server.url}\",\"run_interval\":300},\"commandResponse\":{\"info\":\"§aVote {server.name} and get some rewards!\\n§7 - §e{server.url}\",\"claimed\":\"§aYou already voted today!\",\"notvoted\":\"§cYou haven't voted for this server yet.§r\\n§7Vote §b{server.name}§7 at §e{server.url}\"},\"onClaim\":{\"broadcast\":\"§b{player} §aclaimed some rewards for voting this server! §e/vote§a for more info.\",\"message\":\"§aVote rewards claimed! Thank you for voting this server!\",\"sound\":\"random.levelup\"},\"urls\":{\"checkvoted\":\"https://minecraftpocket-servers.com/api/?object=votes&element=claim&key={ServerKey}&username={Username}\",\"setvoted\":\"https://minecraftpocket-servers.com/api/?action=post&object=votes&element=claim&key={ServerKey}&username={Username}\",\"detailserver\":\"https://minecraftpocket-servers.com/api/?object=servers&element=detail&key={ServerKey}\"}}"
```

## Changelogs

- ### **BedrockVote v1.0**

    - Add Realtime Vote System
    - Add Configuration in Game Editor
    - Add Reward Items in Game Editor

- ### **BedrockVote v1.1**

    - Fix ConfigUI

- ### **BedrockVote v2.0**

    - Update Bedrock 1.21.100
    - New system 2.0
    - More Optimazed
    - More Performance

## HEREE

- Editor: https://candra-web.vercel.app/projects
- Source: https://github.com/ItzCandra23/BedrockVote
- Discord: https://discord.gg/naRZ8tE3yC
- Author: **[ItzCandra23](https://discordapp.com/users/822266948607148042)**

- License: **MIT License**
