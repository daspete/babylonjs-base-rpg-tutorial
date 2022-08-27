import { CreateBox } from "babylonjs"
import { Agent } from "../../navigation/Agent"

export class BaseEntity extends Agent {
    constructor(game, position, agentSettings){
        super(game, position, agentSettings)

        this.mesh = CreateBox(crypto.randomUUID(), { width: 0.5, height: 0.5, depth: 1 }, game.scene)
        this.mesh.position.y = 0.25
        this.mesh.parent = this.transform
    }
    
}