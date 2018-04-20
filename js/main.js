import { homePageComponent, albumPageComponent, artistPageComponent } from './components.js'; //import des différents composants nécessaire au bon fonctionnement de l'application

//Les différentes routes permettant de naviguer entre composants
var routes = [
    {
        path:'/',
        component: homePageComponent
    },
    {
        name: 'albumDescription',
        path: '/album-page',
        component: albumPageComponent ,
        props: true
    },
    {
        name: 'artistPage',
        path: '/artist-page',
        component: artistPageComponent,
        props: true
    }
];

var router = new VueRouter({
    routes
});

//Instance de vue de l'application
var app = new Vue({
    router,
}).$mount('#deezer-app')

export {
    app
}
