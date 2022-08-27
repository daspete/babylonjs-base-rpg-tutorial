import { CreateBox, PointerEventTypes, TransformNode } from "babylonjs"
import { EntityStats } from "../../stats/stats/EntityStats"
import { BaseEntity } from "../BaseEntity"

export class PlayerEntity extends BaseEntity {
    constructor(game, position, agentSettings){
        super(game, position, agentSettings)

        this.stats = new EntityStats(this, 1, {
            speed: { base: 1.5 }
        })

        this.updateMaxSpeed(this.stats.get('speed'))

        this.graphics = new TransformNode()
        this.graphics.parent = this.transform

        this.bodyMesh = CreateBox(crypto.randomUUID(), { width: 0.25, height: 0.25, depth: 1 }, this.game.scene)
        this.bodyMesh.position.y = 0
        this.bodyMesh.parent = this.graphics

        this.game.scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === PointerEventTypes.POINTERDOWN){
                // right click
                if(pointerInfo.event.button === 2){
                    if(pointerInfo.pickInfo?.pickedMesh?.id === 'ground'){
                        return this.setDestination(pointerInfo.pickInfo.pickedPoint)
                    }
                }
            }
        })
    }
}