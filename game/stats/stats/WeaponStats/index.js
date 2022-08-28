import { merge } from "lodash"
import { LevelBasedStatType } from "../../stattypes/LevelBasedStatType"
import { LevelBasedRatioStatType } from "../../stattypes/LevelBasedRatioStatType"
import { BaseStats } from "../BaseStats"

export class WeaponStats extends BaseStats {
    constructor(weapon, level = 1, initialStats){
        super(level, initialStats)

        this.weapon = weapon

        this.initialStats = merge({
            range: { type: LevelBasedStatType, base: 3, multiplier: 1.015 },
            rate: { type: LevelBasedRatioStatType, base: 1.1, multiplier: 1.04, ratio: 1.14 },
            damage: { type: LevelBasedStatType, base: 10, multiplier: 1.015 }
        }, initialStats)

        this.init()
    }
}