import { EnchantmentType, EntityInventoryComponent, ItemDurabilityComponent, ItemEnchantableComponent, ItemLockMode, ItemStack, system } from "@minecraft/server";
import RawVoteRewards from "./data/rewards";
import Database from "./utils/database";
export class ItemData {
}
export class RunCommands {
}
let memory_rawrewards = "";
let memory_rewards = [];
var VoteRewards;
(function (VoteRewards) {
    function getRawRewards() {
        const data = Database.get("bedrockvote:rewards") ?? RawVoteRewards;
        return data;
    }
    VoteRewards.getRawRewards = getRawRewards;
    function setRewards(rewards) {
        if (!Array.isArray(rewards))
            throw new Error("[BedrockVote] Invalid rewards!");
        rewards = rewards.filter((reward) => (reward instanceof ItemData) || (reward instanceof RunCommands));
        Database.set("bedrockvote:rewards", rewards);
    }
    VoteRewards.setRewards = setRewards;
    function getRewards() {
        const rawrewards = getRawRewards();
        if (JSON.stringify(rawrewards) === memory_rawrewards)
            return memory_rewards;
        const newRewards = rawrewards.map((item) => {
            if (item.hasOwnProperty("commands"))
                return item;
            try {
                return toItemStack(item);
            }
            catch (err) {
                console.warn(item);
            }
        }).filter(reward => reward);
        memory_rawrewards = JSON.stringify(rawrewards);
        memory_rewards = newRewards;
        return memory_rewards;
    }
    VoteRewards.getRewards = getRewards;
    function sendRewardsTo(player) {
        const inventory = player.getComponent(EntityInventoryComponent.componentId);
        const rewards = getRewards();
        const container = inventory?.container;
        const dimension = player.dimension;
        return new Promise((resolve) => {
            system.run(() => {
                for (const item of rewards) {
                    if (item instanceof ItemStack) {
                        try {
                            if (!container)
                                throw new Error();
                            container.addItem(item);
                        }
                        catch (err) {
                            dimension.spawnItem(item, player.location);
                        }
                    }
                    else {
                        try {
                            for (const command of item.commands) {
                                if (item.actor === "server")
                                    dimension.runCommand(command);
                                else
                                    player.runCommand(command);
                            }
                        }
                        catch (err) { }
                    }
                }
                resolve(true);
            });
        });
    }
    VoteRewards.sendRewardsTo = sendRewardsTo;
    function toItemStack(item) {
        try {
            const itemStack = new ItemStack(item.typeId, item.amount);
            if (item.name?.trim()) {
                itemStack.nameTag = item.name;
            }
            if (item.durabilityDamage && item.durabilityDamage > 0) {
                const component = itemStack.getComponent(ItemDurabilityComponent.componentId);
                if (component)
                    component.damage = item.durabilityDamage;
            }
            if (item.keepOnDeath) {
                itemStack.keepOnDeath = true;
            }
            if (item.lockMode === "slot") {
                itemStack.lockMode = ItemLockMode.slot;
            }
            if (item.lockMode === "inventory") {
                itemStack.lockMode = ItemLockMode.inventory;
            }
            if (item.canPlaceOn?.length) {
                itemStack.setCanPlaceOn(item.canPlaceOn);
            }
            if (item.canDestroy?.length) {
                itemStack.setCanDestroy(item.canDestroy);
            }
            if (Array.isArray(item.lores)) {
                itemStack.setLore(item.lores);
            }
            else if (item.lores?.trim()) {
                itemStack.setLore([item.lores]);
            }
            if (item.enchants) {
                const component = itemStack.getComponent(ItemEnchantableComponent.componentId);
                if (component) {
                    const rawenchants = Object.entries(item.enchants);
                    rawenchants.forEach(([enchId, lvl]) => {
                        try {
                            const enchType = new EnchantmentType(enchId);
                            const enchant = {
                                type: enchType,
                                level: lvl,
                            };
                            if (component?.canAddEnchantment(enchant))
                                component.addEnchantment(enchant);
                        }
                        catch (err) { }
                    });
                }
            }
            return itemStack;
        }
        catch (err) {
            throw new Error(`[BedrockVote] Invalid item data! "${item.typeId}"`);
        }
    }
    VoteRewards.toItemStack = toItemStack;
})(VoteRewards || (VoteRewards = {}));
export default VoteRewards;
