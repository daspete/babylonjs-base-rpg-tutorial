import { TransformNode, Vector3 } from "babylonjs"
import { merge } from "lodash"

export class Agent {
    constructor(game, settings){
        this.game = game
        this.navmesh = this.game.navmesh

        settings = merge({
            startPosition: Vector3.Zero(), 
            agentSettings: {}
        }, settings)

        this.agentSettings = merge({
            radius: 0.5,
            height: 1,
            rotationSpeed: 15,
            maxAcceleration: 8,
            maxSpeed: 1,
            collisionQueryRange: 1.5,
            pathOptimizationRange: 1.25,
            separationWeight: 1
        }, settings.agentSettings)

        this.agentSettings.maxAcceleration = this.agentSettings.maxSpeed * 8

        this.transform = new TransformNode()
        this.transform.agent = this

        const position = this.navmesh.getClosestPoint(settings.position.clone())
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

    updateMaxSpeed(value){
        this.agentSettings.maxSpeed = value
        this.agentSettings.maxAcceleration = value * 8

        this.navmesh.updateAgentParameters(this.agentIndex, this.agentSettings)
    }

    rotate(deltaTime){
        const velocity = this.navmesh.getAgentVelocity(this.agentIndex)

        if(velocity.length() < 0.3) return

        const desiredRotation = Math.atan2(velocity.x, velocity.z)
        const targetRotation = (desiredRotation - this.transform.rotation.y) * this.agentSettings.rotationSpeed * deltaTime

        this.transform.rotation.y += targetRotation
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