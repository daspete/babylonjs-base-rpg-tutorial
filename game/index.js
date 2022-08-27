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
import { PlayerEntity } from './entities/PlayerEntity'
import { Navmesh } from './navigation/Navmesh'
import { BaseWorld } from './worlds/BaseWorld'

export class Game {
    constructor(canvas, vue){
        this.canvas = canvas
        this.vue = vue

        this.debug = false

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

        this.player = new PlayerEntity(this, Vector3.Zero(), {
            maxSpeed: 3
        })

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

    async destroy(){
        this.camera.deactivate()
        this.scene.dispose()
        this.engine.dispose()
    }
}