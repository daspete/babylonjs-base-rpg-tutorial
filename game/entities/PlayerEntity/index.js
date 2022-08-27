import { CreateBox, PointerEventTypes, TransformNode } from "babylonjs"
import { BaseEntity } from "../BaseEntity"

export class PlayerEntity extends BaseEntity {
    constructor(game, position, agentSettings){
        super(game, position, agentSettings)

        this.graphics = new TransformNode()
        this.graphics.parent = this.transform

        this.bodyMesh = CreateBox(crypto.randomUUID(), { width: 0.25, height: 0.25, depth: 1 }, this.game.scene)
        this.bodyMesh.position.y = 0
        this.bodyMesh.parent = this.graphics

        this.game.scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === PointerEventTypes.POINTERDOWN){
                // right click
                if(pointerInfo.event.button === 2){
                    if(pointerInfo.pickInfo?.pickedMesh){
                        return this.setDestination(pointerInfo.pickInfo.pickedPoint)
                    }
                }
            }
        })
    }
}