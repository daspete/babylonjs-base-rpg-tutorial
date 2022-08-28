export class BaseStats {
    constructor(level = 1, initialStats){
        this.level = level
        this.initialStats = initialStats

        this.stats = {}
    }

    init(){
        Object.keys(this.initialStats).forEach((statKey) => {
            const statValue = this.initialStats[statKey]
            this.stats[statKey] = new statValue.type(statValue, this.level)
        })
    }

    change(statKey, value){
        this.stats[statKey].change(value)
    }

    set(statKey, value){
        this.stats[statKey].set(value)
    }

    get(statKey){
        return this.stats[statKey].Value
    }

    get Level(){
        return this.level
    }

    set Level(value){
        this.level = value
        
        Object.keys(this.stats).forEach((statKey) => {
            this.stats[statKey].Level = value
        })
    }

    get Stats(){
        const stats = {}

        Object.keys(this.stats).forEach((statKey) => {
            stats[statKey] = this.stats[statKey].Value
        })

        return stats
    }
}