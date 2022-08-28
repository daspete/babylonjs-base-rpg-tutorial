import { merge } from "lodash"
import { LevelBasedMaxValueStatType } from "../../stattypes/LevelBasedMaxValueStatType"
import { LevelBasedStatType } from "../../stattypes/LevelBasedStatType"
import { BaseStats } from "../BaseStats"

export class EntityStats extends BaseStats {
    constructor(entity, level = 1, initialStats){
        super(level, initialStats)

        this.entity = entity

        this.initialStats = merge({
            health: { type: LevelBasedMaxValueStatType, base: 91, multiplier: 1.01 },
            speed: { type: LevelBasedStatType, base: 2, multiplier: 1.015 },
        }, initialStats)

        this.init()
    }
}