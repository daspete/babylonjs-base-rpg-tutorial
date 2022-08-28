import { Color3, Vector3, CreateBox, PointerEventTypes, StandardMaterial, TransformNode } from "babylonjs"
import { merge } from "lodash"
import { EntityStats } from "../../stats/stats/EntityStats"
import { BaseEntity } from "../BaseEntity"
import { HuntState } from "./states/HuntState"
import { IdleState } from "./states/IdleState"
import { MoveState } from "./states/MoveState"

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
                        return this.moveToPosition(pointerInfo.pickInfo.pickedPoint)
                    }

                    if(pointerInfo.pickInfo?.pickedMesh?.entity){
                        return this.setHuntTarget(pointerInfo.pickInfo.pickedMesh.entity)
                    }
                }
            }
        })

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
        
        const nearEnemy = this.findNearEnemy()
        if(!nearEnemy) return

        this.setHuntTarget(nearEnemy)
    }

    moveToPosition(position){
        // when we want a new move position, we have to forget about the hunt target
        this.huntTarget = null

        this.setDestination(position)
        this.stateMachine.changeTo('move')
    }

    setHuntTarget(entity){
        this.huntTarget = entity
        this.stateMachine.changeTo('hunt')
    }

    attack(){
        if(!this.huntTarget) return

        const currentTime = this.game.time.getElapsed()
        if(this.lastAttackTime + this.attackRate > currentTime) return
        this.lastAttackTime = currentTime
        
        console.log('attack target', this.huntTarget)
    }

    findNearEnemy(){
        return this.game.enemyEntities
            // first, we sort every enemy by the distance to the player
            .sort((entityA, entityB) => {
                const entityADistance = Vector3.Distance(this.transform.position, entityA.transform.position)
                const entityBDistance = Vector3.Distance(this.transform.position, entityB.transform.position)

                return entityADistance - entityBDistance
            })
            // then, we find the first enemy which is close enough to the player
            .find((entity) => {
                return Vector3.Distance(this.transform.position, entity.transform.position) < 5
            })
    }

}