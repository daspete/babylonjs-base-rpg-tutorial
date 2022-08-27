export class LevelBasedMaxValueStatType {
    constructor(settings, level = 1){
        this.base = settings.base
        this.multiplier = settings.multiplier || 1
        this.level = level

        this.value = this.MaxValue
    }

    set Level(value){
        const ratio = this.Value / this.MaxValue
        this.level = value
        this.Value = this.MaxValue * ratio
    }

    get Value(){
        return this.value
    }

    set Value(value){
        this.set(value)
    }

    change(value){
        this.value = Math.max(0, Math.min(this.MaxValue, this.value + value))
    }

    set(value){
        this.value = Math.max(0, Math.min(this.MaxValue, value))
    }

    get MaxValue(){
        return this.base + Math.pow(this.base, this.multiplier * (Math.sqrt(this.level * 0.25)))
    }
}