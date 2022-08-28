import { Vector3 } from "babylonjs"
import { State } from "yuka"

export class HuntState extends State {
    enter(owner){}

    execute(owner){
        // when we haven't got a hunt target any more, we get back to idle state
        if(!owner.huntTarget){
            return owner.stateMachine.changeTo('idle')
        }

        // when we have arrived our hunt target, we get back to idle state
        if(Vector3.Distance(owner.transform.position, owner.huntTarget.transform.position) <= 3){
            owner.setDestination(owner.transform.position)
            return owner.attack()
            // return owner.stateMachine.changeTo('idle')
        }

        // when our hunt target is too far away, we get back to idle state
        if(Vector3.Distance(owner.transform.position, owner.huntTarget.transform.position) > 5){
            owner.huntTarget = null
            return owner.stateMachine.changeTo('idle')
        }   
        
        // we hunt our target
        owner.setDestination(owner.huntTarget.transform.position)
    }

    exit(owner){}
}