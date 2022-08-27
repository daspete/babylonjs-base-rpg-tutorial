import { TransformNode, Vector3 } from "babylonjs"
import { merge } from "lodash"

export class Agent {
    constructor(game, startPosition = Vector3.Zero(), agentSettings){
        this.game = game
        this.navmesh = this.game.navmesh

        this.agentSettings = merge({
            radius: 0.5,
            height: 1,
            rotationSpeed: 15,
            maxAcceleration: 8,
            maxSpeed: 1,
            collisionQueryRange: 1.5,
            pathOptimizationRange: 1.25,
            separationWeight: 1
        }, agentSettings)

        console.log(this.agentSettings)

        this.agentSettings.maxAcceleration = this.agentSettings.maxSpeed * 8

        this.transform = new TransformNode()
        this.transform.agent = this

        const position = this.navmesh.getClosestPoint(startPosition.clone())
        this.destination = position.clone()
        this.agentIndex = this.navmesh.addAgent(position, this.agentSettings, this.transform)

        this.updateAgent = () => {
            this.update(this.game.time.getDelta())
        }

        this.game.scene.onBeforeRenderObservable.add(this.updateAgent)
    }

    async update(deltaTime){
        this.rotate(deltaTime)
    }

    rotate(deltaTime){
        const velocity = this.navmesh.getAgentVelocity(this.agentIndex)
        if(velocity < 0.1) return

        const desiredRotation = Math.atan2(velocity.x, velocity.z)

        this.transform.rotation.y += (desiredRotation - this.transform.rotation.y) * this.agentSettings.rotationSpeed * deltaTime
    }

    setDestination(position, teleport = false){
        this.destination = this.navmesh.getClosestPoint(position.clone())
        
        if(teleport){
            return this.navmesh.teleportAgent(this.agentIndex, position)
        }

        this.navmesh.setAgentDestination(this.agentIndex, this.destination)
    }


    async destroy(){
        this.navmesh.removeAgent(this.agentIndex)
        this.transform.dispose()
        this.game.scene.onBeforeRenderObservable.remove(this.updateAgent)
    }
}