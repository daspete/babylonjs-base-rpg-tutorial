<template>
    <div class="game">
        <canvas ref="gameview"></canvas>
    </div>
</template>

<script>
import { Game } from '~/game'

export default {
    game: null,

    mounted(){
        this.game = new Game(this.$refs.gameview, this)
        this.game.start()
    },

    beforeDestroy(){
        if(this.game){
            this.game.destroy()
        }
    }
}
</script>

<style lang="scss">
.game {
    @apply w-full h-full;

    canvas {
        @apply w-full h-full;
    }
}
</style>