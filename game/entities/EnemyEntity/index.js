import { Color3, CreateBox, StandardMaterial, TransformNode } from "babylonjs"
import { Vector3 } from "yuka"
import { EntityStats } from "../../stats/stats/EntityStats"
import { BaseEntity } from "../BaseEntity"

export class EnemyEntity extends BaseEntity {
    constructor(game, position, agentSettings){
        super(game, position, agentSettings)

        this.stats = new EntityStats(this, 1, {
            speed: { base: 1.2 }
        })

        this.updateMaxSpeed(this.stats.get('speed'))

        this.graphics = new TransformNode()
        this.graphics.parent = this.transform
        
        this.bodyMesh = CreateBox(crypto.randomUUID(), { width: 0.25, height: 0.25, depth: 1 }, this.game.scene)
        this.bodyMesh.material = new StandardMaterial(crypto.randomUUID(), this.game.scene)
        this.bodyMesh.material.diffuseColor = new Color3(1, 0, 0)
        this.bodyMesh.position.y = 0
        this.bodyMesh.parent = this.graphics

        this.start()
    }

    start(){
        this.setRandomDestination()
    }

    setRandomDestination(){
        this.setDestination(new Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50))

        setTimeout(() => {
            this.setRandomDestination()
        }, 4000 + Math.random() * 2000)
    }
}