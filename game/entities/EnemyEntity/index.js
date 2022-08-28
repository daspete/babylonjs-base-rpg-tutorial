import { Color3, Vector3, CreateBox, CreateSphere, StandardMaterial, TransformNode } from "babylonjs"
import { merge } from "lodash"
import { EntityStats } from "../../stats/stats/EntityStats"
import { BaseEntity } from "../BaseEntity"
import { HuntState } from "./states/HuntState"
import { IdleState } from "./states/IdleState"
import { MoveState } from "./states/MoveState"

export class EnemyEntity extends BaseEntity {
    constructor(game, settings){
        super(game, settings)

        const statSettings = merge({
            speed: { base: 1.2 }
        }, settings.stats)

        this.stats = new EntityStats(this, settings.level || 1, statSettings)

        this.updateMaxSpeed(this.stats.get('speed'))

        this.graphics = new TransformNode()
        this.graphics.parent = this.transform
        
        this.bodyMesh = CreateBox(crypto.randomUUID(), { width: 0.25, height: 0.25, depth: 1 }, this.game.scene)
        this.bodyMesh.material = new StandardMaterial(crypto.randomUUID(), this.game.scene)
        this.bodyMesh.material.diffuseColor = new Color3(1, 0, 0)
        this.bodyMesh.position.y = 0
        this.bodyMesh.parent = this.graphics
        this.bodyMesh.isPickable = false

        this.pickableMesh = CreateSphere(crypto.randomUUID(), { diameter: 1 }, this.game.scene)
        this.pickableMesh.parent = this.transform
        this.pickableMesh.isPickable = true
        this.pickableMesh.visibility = 0
        this.pickableMesh.entity = this

        this.stateMachine.add('idle', new IdleState())
        this.stateMachine.add('move', new MoveState())
        this.stateMachine.add('hunt', new HuntState())

        this.stateMachine.changeTo('idle')
    }

    async update(deltaTime){
        await super.update(deltaTime)

        // when we are already hunting an enemy, we don't hunt another one
        if(this.stateMachine.currentState instanceof HuntState) return
        // when we are moving, we don't abort the movement
        if(this.stateMachine.currentState instanceof MoveState) return
        
        if(!this.game.player) return

        const distanceToPlayer = Vector3.Distance(this.transform.position, this.game.player.transform.position)
        if(distanceToPlayer < 5){
            this.setHuntTarget(this.game.player)
        }
    }

    setHuntTarget(entity){
        this.huntTarget = entity
        this.stateMachine.changeTo('hunt')
    }
}