export class LevelBasedRatioStatType {
    constructor(settings, level = 1){
        this.base = settings.base
        this.multiplier = settings.multiplier || 1
        this.ratio = settings.ratio || 1
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
        return this.ratio / (this.base * Math.pow(this.multiplier, this.level) + this.modification)
    }
}