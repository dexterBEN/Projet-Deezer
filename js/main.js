import { homePageComponent, albumPageComponent } from './components.js';                                                   

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
        }
    ];

    var router = new VueRouter({
        routes
    });

    var app = new Vue({
        router
    }).$mount('#deezer-app')

    export {
        app
    }
