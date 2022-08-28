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
import { EnemyEntity } from './entities/EnemyEntity'
import { PlayerEntity } from './entities/PlayerEntity'
import { Navmesh } from './navigation/Navmesh'
import { LaserWeapon } from './weapons/LaserWeapon'
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

        this.enemyEntities = []
    }

    async start(){
        window.addEventListener('resize', () => {
            this.engine.resize()
        })

        await this.camera.start()
        await this.world.start()
        await this.navmesh.start()
        await this.navmesh.createNavmesh()

        this.createPlayer()

        for(let i = 0; i < 50; i++){
            const position = new Vector3(Math.random() * 100 - 50, 0, Math.random() * 100 - 50)
            const enemy = new EnemyEntity(this, {
                position,
                stats: {
                    speed: { base: 1.2 }
                }
            })

            const enemyWeapon = new LaserWeapon(this, enemy)
            enemy.equipWeapon(enemyWeapon)

            this.enemyEntities.push(enemy)
        }

        this.engine.runRenderLoop(() => {
            const deltaTime = this.time.update().getDelta()
            this.update(deltaTime)
            this.scene.render()
        })
    }

    createPlayer(){
        const playerLevel = this.player?.stats?.Level || 1

        setTimeout(() => {
            this.player = new PlayerEntity(this, {
                position: new Vector3(0, 0, 0),
                level: playerLevel,
                stats: {
                    speed: { base: 1.5 }
                }
            })
    
            this.playerWeapon = new LaserWeapon(this, this.player)
            this.player.equipWeapon(this.playerWeapon)
        }, 2000)
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