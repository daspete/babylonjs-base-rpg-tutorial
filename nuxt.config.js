export default {
    components: true,

    head: {
        title: 'Base RPG',
        script: [
            // download from https://preview.babylonjs.com/recast.js
            { src: '/scripts/recast.js' }
        ]
    },

    css: [
        '~/assets/css/tailwind.css',
        '~/assets/css/main.scss'
    ],

    modules: [
        '@nuxtjs/tailwindcss',
    ]
}