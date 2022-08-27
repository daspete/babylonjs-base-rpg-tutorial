import {
    Engine,
    Scene,
} from 'babylonjs'

import {
    Time
} from 'yuka'
import { TopDownCamera } from './cameras/TopDownCamera'
import { BaseWorld } from './worlds/BaseWorld'

export class Game {
    constructor(canvas, vue){
        this.canvas = canvas
        this.vue = vue

        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)
        this.time = new Time()

        this.camera = new TopDownCamera(this)
        this.world = new BaseWorld(this)
    }

    async start(){
        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        await this.camera.start()
        await this.world.start()

        this.engine.runRenderLoop(() => {
            const deltaTime = this.time.update().getDelta()
            this.update(deltaTime)
            this.scene.render()
        })
    }

    async update(deltaTime){
        this.camera.update(deltaTime)
        this.world.update(deltaTime)
    }

    async destroy(){
        this.camera.deactivate()
        this.scene.dispose()
        this.engine.dispose()
    }
}