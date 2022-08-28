import { Vector3 } from "babylonjs"
import { State } from "yuka"

export class MoveState extends State {
    enter(owner){}

    execute(owner){
        // when we have arrived the destination point, we can get back to idle state
        if(Vector3.Distance(owner.transform.position, owner.destination) <= 0.15){
            owner.stateMachine.changeTo('idle')
        }
    }

    exit(owner){}
}