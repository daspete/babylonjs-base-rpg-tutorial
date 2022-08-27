import {
    CreateBox,
    Engine,
    Scene,
    Vector3
} from 'babylonjs'

import {
    Time
} from 'yuka'
import { TopDownCamera } from './cameras/TopDownCamera'
import { BaseEntity } from './entities/BaseEntity'
import { Navmesh } from './navigation/Navmesh'
import { BaseWorld } from './worlds/BaseWorld'

export class Game {
    constructor(canvas, vue){
        this.canvas = canvas
        this.vue = vue

        this.debug = true

        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)
        this.time = new Time()

        this.navmesh = new Navmesh(this)
        this.camera = new TopDownCamera(this)
        this.world = new BaseWorld(this)
    }

    async start(){
        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        await this.camera.start()
        await this.world.start()
        
        await this.navmesh.start()
        await this.navmesh.createNavmesh()

        this.randomAgents = []

        for(let i = 0; i < 100; i++){
            let randomAgent = new BaseEntity(
                this, 
                new Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50),
                {
                    maxSpeed: Math.random() * 3 + 1
                }
            )
            this.randomAgents.push(randomAgent)
        }

        this.randomEntityMovement()

        this.engine.runRenderLoop(() => {
            const deltaTime = this.time.update().getDelta()
            this.update(deltaTime)
            this.scene.render()
        })
    }

    async update(deltaTime){
        this.camera.update(deltaTime)
        this.world.update(deltaTime)
        this.navmesh.update(deltaTime)
    }

    randomEntityMovement(){
        const randomAgents = this.randomAgents.filter(() => {
            return Math.random() > 0.5
        })

        randomAgents.forEach((agent) => {
            agent.setDestination(new Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50))
        })

        setTimeout(() => {
            this.randomEntityMovement()
        }, 5000)
    }

    async destroy(){
        this.camera.deactivate()
        this.scene.dispose()
        this.engine.dispose()
    }
}