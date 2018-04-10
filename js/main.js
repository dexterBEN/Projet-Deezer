import { bus } from './Bus.js';
// var bus = new Vue();

    var homePageComponent = Vue.component ('homePage',{

        data: function(){
            return {
                    urlSrc: 'https://api.deezer.com/search?q=', //Url source de l'API DEEZER pour la recherche 
                    finalUrl:'',
                    orderOption:'',                            //Gère les options du selectionner par l'utilisateur
                    inputUser: "",                              //Entrée du formulaire de recherche
                    index:0,                                   //Inndex pour parcourir les tableau (utilisé dans le html pour le v-for)
                    musicOfArtist:[]                          //Tableau qui sert à stocker l'objet JSON renvoyer par l'API
            };
            
        },

        methods:{
            concatenation: function(){
                var urlFinal = this.finalUrl; //obliger de passer par une variable intermédiaire pour récupérer la propriété finalUrl de data
                if(this.inputUser === ""){
                    console.log('Rentré un artiste');
                }else{
                    urlFinal = this.urlSrc+this.inputUser;
                    console.log("url final après construction:"+urlFinal);
                }

                if(this.orderOption === ""){
                    console.log("vous avez une liste par défaut non-ordonnée");
                }else{
                    urlFinal = this.urlSrc+this.inputUser+'&order='+this.orderOption;
                    console.log("url final après construction:"+urlFinal);
                }
                return urlFinal;
            },
            request: function(){
                //Élement pour la requête au serveur voir ici: https://www.w3schools.com/jquery/ajax_ajax.asp
                this.finalUrl = this.concatenation();
                bus.$emit('test'); //emission de l'évènement qui porte le nom 'test', exemple doc: https://fr.vuejs.org/v2/guide/instance.html#Les-hooks-de-cycle-de-vie-d%E2%80%99une-instance
                var url = this.finalUrl;
                console.log("url avant requête:"+url);
                $.ajax({
                    url:this.finalUrl,
                    // dataType:'jsonp',
                    success: response => {

                        this.musicOfArtist = response.data;
                        console.log(this.musicOfArtist);
                        //console.log(this.musicOfArtist[0].album.tracklist);
                    }
                });

                /*fetchJsonp(url)
                    .then(data => data.json())
                    .then((data)=>{
                        apiAnswer  = data;
                        console.log('voici:'+apiAnswer);
                    });*/
            },
        },


        template:`
            <div>
                <form class="container row">
                    <div class="col s2"><input v-model="inputUser" type="text" placeholder="Donner le nom de l'artiste"></div>
                    <div class="col s4"><button v-on:click.prevent="request()" class="waves-effect waves-light btn" >Recherche</button></div><!--Le prevent permet d'éviter le rechargement automatique de la page au moment du clique-->
                    <div class="col s4">
                        <select v-model="orderOption" class="browser-default">
                            <option value="" disabled selected>Trier par...</option>
                            <option value="ALBUM_ASC">Album</option>
                            <option value="ARTIST_DESC">Artist</option>
                            <option value="">musique</option>
                        </select>
                    </div>
                </form>
                <div class="container row">
                    <div v-for="(artist, index) in musicOfArtist" class="col s4 card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" v-bind:src="artist.album.cover_big">
                        </div>
                        <div class="card-content">
                            <span class="truncate card-title activator grey-text text-darken-4">{{artist.title}}</span>
                            <p>{{artist.artist.name}}/ {{artist.album.title}}</p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                            <p>Here is some more information about this product that is only revealed once clicked on.</p>
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light indigo darken-4 btn">Ecouter un extrait</a>
                            <router-link    :class="{'active' : $route.name === 'albumPageComponent.template'}"
                                            :to="{name: 'albumDescription', params: {  albumId: artist.album.title }}" 
                                            >Consulter l'album</router-link>
                                            <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Album</a>
                            <a class="waves-effect waves-light grey darken-2 btn">Voir la fiche de l'artiste</a>
                        </div>
                        <div class="card-action">
                            <audio v-bind:src="artist.preview" type="audio/mp3" controls="controls">
                                Votre navigateur ne supporte pas la balise AUDIO.
                            </audio>
                        </div>
                    </div>
                </div>
                <!--<div><router-view></router-view></div>-->
            </div>`
        });

    var albumPageComponent = Vue.component('albumPage', {

        /*props:{
            prop1:'corea',
        },*/

        /*data:function(){
            var recup = bus.$on("test");
            return{
                recup

            }
        },*/

        created: function(){
            bus.$on('test', function () {
                console.log("interception de l'évènement");
            })
            //console.log('test');
        },


        methods:{
            
        },

        template:`
            <section>
                <div>
                    <h1>{{}}</h1>
                    <p>Artiste name:<a href="">link name</a></p>
                    <button>clique</button>
                </div>

                <div>
                    <div></div>
                    <!--<ul class="collection with-header">
                        <li class="collection-header"><h4>First Names</h4></li>
                        <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
                        <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
                        <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
                        <li class="collection-item"><div>Alvin<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>
                    </ul>-->
                </div>
            </section>
        `
    });

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
