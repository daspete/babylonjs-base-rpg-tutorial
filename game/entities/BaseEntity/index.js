import { CreateBox } from "babylonjs"
import { StateMachine } from "yuka"
import { Agent } from "../../navigation/Agent"

export class BaseEntity extends Agent {
    constructor(game, settings){
        super(game, settings)

        this.huntTarget = null
        this.attackRate = 0.5
        this.lastAttackTime = 0

        this.stateMachine = new StateMachine(this)
    }

    async update(deltaTime){
        await super.update(deltaTime)

        this.stateMachine.update()
    }

    rotate(deltaTime){
        if(!this.huntTarget){
            return super.rotate(deltaTime)
        }

        this.transform.lookAt(this.huntTarget.transform.position)
    }
    
}