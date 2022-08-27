import { Color3, RecastJSPlugin, StandardMaterial } from "babylonjs"
import { merge } from "lodash"

export class Navmesh {
    constructor(game, navmeshSettings){
        this.game = game
        this.recast = null
        this.crowd = null
        this.meshes = []
        this.navmeshVisualization = null

        this.navmeshSettings = merge({
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 70,
            walkableHeight: 1,
            walkableClimb: 1,
            walkableRadius: 2,
            maxEdgeLen: 12,
            maxSimplificationError: 1.3,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
            borderSize: 1,
            tileSize: 20
        }, navmeshSettings)
    }

    async start(){
        if(typeof Recast == 'function'){
            await Recast()
        }

        this.createNavmesh()
    }

    async update(deltaTime){}

    addMesh(mesh){
        this.meshes.push(mesh)
    }

    addAgent(position, agentSettings, transform){
        return this.crowd.addAgent(position, agentSettings, transform)
    }

    removeAgent(agentIndex){
        this.crowd.removeAgent(agentIndex)
    }

    setAgentDestination(agentIndex, destination){
        this.crowd.agentGoto(agentIndex, destination)
    }

    teleportAgent(agentIndex, position){
        this.crowd.agentTeleport(agentIndex, position)
    }

    getAgentVelocity(agentIndex){
        return this.crowd.getAgentVelocity(agentIndex)
    }

    getClosestPoint(position){
        return this.recast.getClosestPoint(position)
    }

    async createNavmesh(){
        if(this.recast) this.recast.dispose()

        this.recast = new RecastJSPlugin()
        this.recast.createNavMesh(this.meshes, this.navmeshSettings)

        this.crowd = this.recast.createCrowd(500, 1, this.game.scene)

        if(this.game.debug){
            this.drawNavmesh()
        }
    }

    async drawNavmesh(){
        if(this.navmeshVisualization) this.navmeshVisualization.dispose()

        this.navmeshVisualization = this.recast.createDebugNavMesh(this.game.scene)
        this.navmeshVisualization.material = new StandardMaterial(crypto.randomUUID(), this.game.scene)
        this.navmeshVisualization.material.diffuseColor = new Color3(0, 1, 0)
        this.navmeshVisualization.material.alpha = 0.2
    }
}