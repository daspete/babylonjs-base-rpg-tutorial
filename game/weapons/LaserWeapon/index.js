import { BaseWeapon } from "../BaseWeapon"

export class LaserWeapon extends BaseWeapon {
    constructor(game, owner, initialSettings){
        super(game, owner, initialSettings)
    }

    async createBullet(){
        const currentDamage = this.stats.get('damage')

        this.owner.huntTarget.getHit(this.owner, currentDamage)
        
        if(this.owner.huntTarget.isDead){
            this.owner.huntTarget = null
        }
    }
}