import { Camera, FreeCamera, PointerEventTypes, Space, TransformNode, Vector3 } from "babylonjs"
import { BaseCamera } from "../BaseCamera"

export class TopDownCamera extends BaseCamera {
    constructor(game){
        super(game)

        this.settings = {
            pan: {
                speed: 20,
                screenBorder: 120
            },
            zoom: {
                speed: 0.003,
                min: 2,
                max: 80
            },
            clipping: {
                near: 0.01,
                far: 1000
            },
            distance: 5,
            cameraBorders: {
                x: {
                    min: -50,
                    max: 50
                },
                z: {
                    min: -50,
                    max: 50
                }
            }
        }

        this.zoom = 10

        this.transform = new TransformNode(crypto.randomUUID(), this.game.scene)

        this.cam = new FreeCamera(crypto.randomUUID(), new Vector3(0, this.zoom, -this.settings.distance), this.game.scene)
        this.cam.mode = Camera.PERSPECTIVE_CAMERA
        this.cam.minZ = this.settings.clipping.near
        this.cam.maxZ = this.settings.clipping.far

        this.cam.setTarget(this.transform.position)
        this.cam.lockedTarget = this.transform

        this.moveVector = new Vector3(0, 0, 0)

        this.game.scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type === PointerEventTypes.POINTERMOVE){
                this.onPointerMove(pointerInfo)
            }
        })
    }

    async start(){
        await super.start()
    }

    async update(deltaTime){
        if(!this.isActive) return

        await super.update(deltaTime)

        this.move(deltaTime)
    }

    move(deltaTime){
        this.transform.translate(this.moveVector, this.settings.pan.speed * deltaTime, Space.LOCAL)
        this.transform.position.x = Math.max(this.settings.cameraBorders.x.min, Math.min(this.settings.cameraBorders.x.max, this.transform.position.x))
        this.transform.position.z = Math.max(this.settings.cameraBorders.z.min, Math.min(this.settings.cameraBorders.z.max, this.transform.position.z))

        this.cam.position.x = this.transform.position.x
        this.cam.position.y = this.zoom
        this.cam.position.z = this.transform.position.z - this.settings.distance
    }

    updateMoveVector(x, y){
        const { width, height } = this.game.canvas

        this.moveVector = Vector3.Zero()

        if(x < this.settings.pan.screenBorder){
            this.moveVector.x = -1
        }
        if(x > width - this.settings.pan.screenBorder){
            this.moveVector.x = 1
        }
        if(y < this.settings.pan.screenBorder){
            this.moveVector.z = 1
        }
        if(y > height - this.settings.pan.screenBorder){
            this.moveVector.z = -1
        }
    }

    onPointerMove(pointerInfo){
        this.updateMoveVector(pointerInfo.event.x, pointerInfo.event.y)
    }

    onPointerWheel(pointerInfo){
        const delta = pointerInfo.event.deltaY

        this.zoom += delta * this.settings.zoom.speed
        this.zoom = Math.max(this.settings.zoom.min, Math.min(this.settings.zoom.max, this.zoom))
    }
}