import { Enchantment, EnchantmentType, EntityInventoryComponent, EquipmentSlot, ItemDurabilityComponent, ItemEnchantableComponent, ItemLockMode, ItemStack, Player, system, world } from "@minecraft/server";
import RawVoteRewards from "./data/rewards";
import Database from "./utils/database";

export interface ItemData {
    typeId: string;
    // equipmentSlot?: string; Donate please!!
    amount?: number;
    name?: string;
    lores?: string|string[];
    enchants?: Record<string, number>;
    durabilityDamage?: number;
    canDestroy?: string[];
    canPlaceOn?: string[];
    lockMode?: string;
    keepOnDeath?: boolean;
}

export interface RunCommands {
    actor?: string;
    commands: string|string[];
}

export class ItemData {}
export class RunCommands {}

export type VoteRawRewardsType = (ItemData|RunCommands)[]
export type VoteRewardsType = (ItemStack|RunCommands)[]

let memory_rawrewards: string = "";
let memory_rewards: VoteRewardsType = [];

namespace VoteRewards {

    export function getRawRewards(): VoteRawRewardsType {
        const data = Database.get("bedrockvote:rewards") ?? RawVoteRewards;
        return data;
    }

    export function setRewards(rewards: VoteRawRewardsType): void {
        if (!Array.isArray(rewards)) throw new Error("[BedrockVote] Invalid rewards!");
        
        rewards = rewards.filter((reward) => (reward instanceof ItemData) || (reward instanceof RunCommands));

        Database.set("bedrockvote:rewards", rewards);
    }

    export function getRewards(): VoteRewardsType {
        const rawrewards = getRawRewards();
        if (JSON.stringify(rawrewards) === memory_rawrewards) return memory_rewards;

        const newRewards = rawrewards.map((item) => {
            if (item.hasOwnProperty("commands")) return item;
            try {
                return toItemStack(item as ItemData);
            } catch(err) {
                console.warn(item);
            }
        }).filter(reward => reward) as VoteRewardsType;

        memory_rawrewards = JSON.stringify(rawrewards);
        memory_rewards = newRewards;

        return memory_rewards;
    }

    export function sendRewardsTo(player: Player) {
        const inventory = player.getComponent(EntityInventoryComponent.componentId);

        const rewards = getRewards();
        const container = inventory?.container;
        const dimension = player.dimension;

        return new Promise((resolve) => {
            system.run(() => {
                for (const item of rewards) {
                    if (item instanceof ItemStack) {
                        try {
                            if (!container) throw new Error();
                            
                            container.addItem(item);
                        } catch(err) {
                            dimension.spawnItem(item, player.location);
                        }
                    } else {
                        try {
                            for (const command of item.commands) {
                                if (item.actor === "server") dimension.runCommand(command);
                                else player.runCommand(command);
                            }
                        } catch(err) {}
                    }
                }

                resolve(true);
            });
        });
    }

    export function toItemStack(item: ItemData): ItemStack {
        try {
            const itemStack = new ItemStack(item.typeId, item.amount);

            if (item.name?.trim()) {
                itemStack.nameTag = item.name;
            }
            if (item.durabilityDamage && item.durabilityDamage > 0) {
                const component = itemStack.getComponent(ItemDurabilityComponent.componentId);

                if (component) component.damage = item.durabilityDamage
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
                            const enchant: Enchantment = {
                                type: enchType,
                                level: lvl,
                            };

                            if (component?.canAddEnchantment(enchant)) component.addEnchantment(enchant);
                        } catch(err) {}
                    });
                }
            }

            return itemStack;
        } catch(err) {
            throw new Error(`[BedrockVote] Invalid item data! "${item.typeId}"`);
        }
    }
}

export default VoteRewards;