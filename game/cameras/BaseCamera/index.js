export class BaseCamera {
    constructor(game){
        this.game = game
        this.isActive = false
    }

    async start(){
        this.activate()
    }

    async update(deltaTime){}

    activate(){
        this.isActive = true
    }

    deactivate(){
        this.isActive = false
    }
    
}