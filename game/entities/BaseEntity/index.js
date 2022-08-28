import { CreateBox } from "babylonjs"
import { StateMachine } from "yuka"
import { Agent } from "../../navigation/Agent"

export class BaseEntity extends Agent {
    constructor(game, settings){
        super(game, settings)

        this.isDead = false

        this.huntRadius = settings.huntRadius || 5
        this.stopHuntRadius = settings.stopHuntRadius || 8

        this.huntTarget = null

        this.weapon = null

        this.stateMachine = new StateMachine(this)
    }

    async update(deltaTime){
        if(this.isDead) return
        await super.update(deltaTime)

        this.stateMachine.update()
    }

    attack(){
        if(this.isDead) return
        
        if(this.weapon){
            this.weapon.update(this.game.time.getElapsed())
        }
    }

    getHit(from, damage){
        this.stats.change('health', -damage)

        if(this.stats.get('health') == 0){
            this.die()
        }
    }

    die(){
        if(this.isDead) return

        this.isDead = true
        this.destroy()
    }

    rotate(deltaTime){
        if(!this.huntTarget){
            return super.rotate(deltaTime)
        }

        this.transform.lookAt(this.huntTarget.transform.position)
    }

    equipWeapon(weapon){
        this.weapon = weapon
    }
    
}