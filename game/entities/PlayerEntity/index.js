import { Color3, CreateBox, PointerEventTypes, StandardMaterial, TransformNode } from "babylonjs"
import { merge } from "lodash"
import { EntityStats } from "../../stats/stats/EntityStats"
import { BaseEntity } from "../BaseEntity"

export class PlayerEntity extends BaseEntity {
    constructor(game, settings){
        super(game, settings)

        const statSettings = merge({
            speed: { base: 1.5 }
        }, settings.stats)

        this.stats = new EntityStats(this, settings.level || 1, statSettings)

        this.updateMaxSpeed(this.stats.get('speed'))

        this.graphics = new TransformNode()
        this.graphics.parent = this.transform

        this.bodyMesh = CreateBox(crypto.randomUUID(), { width: 0.25, height: 0.25, depth: 1 }, this.game.scene)
        this.bodyMesh.material = new StandardMaterial(crypto.randomUUID(), this.game.scene)
        this.bodyMesh.material.diffuseColor = new Color3(0, 1, 0)
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