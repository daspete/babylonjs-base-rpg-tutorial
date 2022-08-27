import { Color3, Vector3, CreateGround, DirectionalLight, HemisphericLight, StandardMaterial, ShadowGenerator } from "babylonjs"
import { GridMaterial } from "babylonjs-materials"

export class BaseWorld {
    constructor(game){
        this.game = game
    }

    async start(){
        await this.createGround()
        await this.createLight()
        await this.createShadows()
    }

    async update(deltaTime){}

    async createGround(){
        this.ground = CreateGround(crypto.randomUUID(), { width: 100, height: 100 }, this.game.scene)
        this.ground.material = new GridMaterial(crypto.randomUUID(), this.game.scene)
        this.ground.material.diffuseColor = new Color3(0.2, 0.25, 0.3)
        this.ground.receiveShadows = true
    }

    async createLight(){
        this.ambientLight = new HemisphericLight(crypto.randomUUID(), new Vector3(0, 1, 0), this.game.scene)
        this.ambientLight.intensity = 0.3

        this.sunLight = new DirectionalLight(crypto.randomUUID(), new Vector3(-1, -2, 1), this.game.scene)
        this.sunLight.intensity = 0.6
        this.sunLight.position = new Vector3(20, 40, -20)
    }

    async createShadows(){
        this.shadowGenerator = new ShadowGenerator(2048, this.sunLight)
        this.shadowGenerator.useBlurExponentialShadowMap = true
        this.shadowGenerator.useKernelBlur = true
        this.shadowGenerator.blurKernel = 32
        this.shadowGenerator.darkness = 0.5
    }

    addShadowCaster(mesh){
        this.shadowGenerator.addShadowCaster(mesh)
    }
}