export class LevelBasedStatType {
    constructor(settings, level = 1){
        this.base = settings.base
        this.multiplier = settings.multiplier
        this.level = level
        this.modification = 0
    }

    set Level(value){
        this.level = value
    }

    change(value){
        this.modification += value
    }

    get Value(){
        return Math.max(0, this.base + this.base * Math.pow(this.multiplier, this.level) + this.modification)
    }
}