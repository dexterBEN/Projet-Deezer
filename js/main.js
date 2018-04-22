import { homePageComponent, albumPageComponent, artistPageComponent, titlePageComponent } from './components.js';                                                   

// console.log(message);

    var routes = [
        {
            path:'/',
            component: homePageComponent
        },
        {
            name: 'albumDescription',
            path: '/album-page', 
            component: albumPageComponent ,
            props:true
        },
        {
            name:'artistPage',
            path:'/artist-page',
            component: artistPageComponent,
            props:true
        },
        {
            name:'trackPage',
            path: '/track-page',
            component: titlePageComponent,
            props:true
        }
    ];

    var router = new VueRouter({
        routes
    });

    var app = new Vue({
        router,

    }).$mount('#deezer-app')

    export {
        app,
        router,
    }
