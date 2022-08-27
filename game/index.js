import {
    Engine,
    Scene,
} from 'babylonjs'

import {
    Time
} from 'yuka'

export class Game {
    constructor(canvas, vue){
        this.canvas = canvas
        this.vue = vue

        this.engine = new Engine(this.canvas, true)

        this.scene = new Scene(this.engine)
        this.time = new Time()
    }

    async start(){
        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        this.engine.runRenderLoop(() => {
            const deltaTime = this.time.update().getDelta()
            this.update(deltaTime)
            this.scene.render()
        })
    }

    async update(deltaTime){
        console.log('update')
    }
}