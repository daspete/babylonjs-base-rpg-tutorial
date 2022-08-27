import {
    Engine,
    Scene,
} from 'babylonjs'

import {
    Time
} from 'yuka'
import { TopDownCamera } from './cameras/TopDownCamera'

export class Game {
    constructor(canvas, vue){
        this.canvas = canvas
        this.vue = vue

        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)
        this.time = new Time()

        this.camera = new TopDownCamera(this)
    }

    async start(){
        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        await this.camera.start()

        this.engine.runRenderLoop(() => {
            const deltaTime = this.time.update().getDelta()
            this.update(deltaTime)
            this.scene.render()
        })
    }

    async update(deltaTime){
        this.camera.update(deltaTime)
    }

    async destroy(){
        this.camera.deactivate()
        this.scene.dispose()
        this.engine.dispose()
    }
}