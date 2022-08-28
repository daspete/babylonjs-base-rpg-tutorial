import { merge } from "lodash"
import { WeaponStats } from "../../stats/stats/WeaponStats"

export class BaseWeapon {
    constructor(game, owner, initialSettings){
        this.game = game
        this.owner = owner
        
        this.initialSettings = merge({
            level: 1,
            stats: {}
        }, initialSettings)

        this.stats = new WeaponStats(
            this,
            this.initialSettings.level,
            this.initialSettings.stats
        )

        this.lastAttackTime = 0
    }

    async update(deltaTime){
        if(!this.CanAttack) return

        const currentTime = this.game.time.getElapsed()
        if(this.lastAttackTime + this.stats.get('rate') > currentTime) return

        this.attack(deltaTime)
    }

    get CanAttack(){
        if(!this.owner) return false
        if(this.owner.isDead) return false

        if(!this.owner.huntTarget) return false
        if(this.owner.huntTarget.isDead) return false

        return true
    }

    async attack(deltaTime){
        if(!this.CanAttack) return

        this.lastAttackTime = this.game.time.getElapsed()

        this.createBullet()
    }

    async createBullet(){

    }
}