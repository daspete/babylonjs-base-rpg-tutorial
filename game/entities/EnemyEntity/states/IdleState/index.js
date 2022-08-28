import { Vector3 } from "babylonjs"
import { State } from "yuka"

export class IdleState extends State {
    enter(owner){}

    execute(owner){
        // when we are not at the destination point, we change our state to move
        if(Vector3.Distance(owner.transform.position, owner.destination) > 0.15){
            return owner.stateMachine.changeTo('move')
        }
    }

    exit(owner){}
}