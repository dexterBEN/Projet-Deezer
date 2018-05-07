import { bus } from './Bus.js';

var homePageComponent = Vue.component ('homePage',{

	data: function(){
		return {
				urlSrc: 'https://api.deezer.com/search?q=', //Url source de l'API DEEZER pour la recherche 
				urlAlbum: 'https://api.deezer.com/album/',
				finalUrl:'',
				orderOption:'',                            //Gère les options du selectionner par l'utilisateur
				inputUser: "",                              //Entrée du formulaire de recherche
				index:0,                                   //Inndex pour parcourir les tableau (utilisé dans le html pour le v-for)
				musicOfArtist:[],                         //Tableau qui sert à stocker l'objet JSON renvoyer par l'API
				total: 0,
				nextURL: ''
		};
		
	},

	methods:{
		concatenation: function(){
			var urlFinal = this.finalUrl; //obliger de passer par une variable intermédiaire pour récupérer la propriété finalUrl de data
			if(this.inputUser === ""){
				console.log('Rentré un artiste');
			}else{
				urlFinal = this.urlSrc+this.inputUser+'&output=jsonp';
			}

			if(this.orderOption === ""){
				console.log("vous avez une liste par défaut non-ordonnée");
			}else{
				urlFinal = this.urlSrc+this.inputUser+'&order='+this.orderOption+'&output=jsonp';
			}
			console.log("url final après construction:"+urlFinal);
			return urlFinal;
		},
		request: function(){
			//Élement pour la requête au serveur voir ici: https://www.w3schools.com/jquery/ajax_ajax.asp
			this.finalUrl = this.concatenation();
			var url = this.finalUrl;
			console.log("url avant requête:"+url);
			/*$.ajax({
				url:this.finalUrl,
				// dataType:'jsonp',
				success: response => {

					this.musicOfArtist = response.data;
					console.log(this.musicOfArtist);
					//console.log(this.musicOfArtist[0].album.tracklist);
				},
			});*/

			fetchJsonp(url)
				.then(data => data.json())
				.then((data)=>{
					this.musicOfArtist = data.data;
					this.total = data.total;
					this.nextURL = data.next;
					this.inputUser='';
					console.log(this.musicOfArtist);
					bus.$emit('test', this.musicOfArtist);
				});
		},

		convertTime: function(musicTime){
			var min = 0;
			var sec = 0;
			var timeConverted;

			min = Math.floor(musicTime/60);
			//console.log('Voici minute:'+min);

			sec = musicTime - (min*60);
			//console.log('Voici secondes:'+sec);

			timeConverted = min +':'+sec;
			return timeConverted;

		}
	},


	template:`
		<section>
			<form class="container row">
				<div class="col s2"><input v-model="inputUser" type="text" placeholder="Donner le nom de l'artiste"></div>
				<div class="col s4"><button v-on:click.prevent="request()" class="waves-effect waves-light btn" >Recherche</button></div><!--Le prevent permet d'éviter le rechargement automatique de la page au moment du clique-->
				<div class="col s4">
					<select v-model="orderOption" class="browser-default">
						<option value="" disabled selected>Trier par...</option>
						<option value="ALBUM_ASC">Album</option>
						<option value="ARTIST_DESC">Artist</option>
						<option value="RATING">Rang </option>
						<option value="TRACK_ASC">  Titre   </option>
                        <option value="RATING">     Note    </option>
					</select>
				</div>
			</form>
			<div class="container row">
				<div v-for="(element, index) in musicOfArtist" class="col s4 card">
					<div class="card-image waves-effect waves-block waves-light">
						<img class="activator" v-bind:src="element.album.cover_big">
					</div>
					<div class="card-content">
						<span class="truncate card-title activator grey-text text-darken-4">{{element.title}}</span>
						<p> {{convertTime(musicOfArtist[index].duration)}}</p>
						<p>{{element.artist.name}}/ {{element.album.title}}</p>
					</div>
					<div class="card-reveal">
						<span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
						<p>Here is some more information about this product that is only revealed once clicked on.</p>
					</div>
					<div class="card-action">
						<a class="waves-effect waves-light indigo darken-4 btn">Ecouter un extrait</a>
						<router-link    :class="{'active' : $route.name === 'albumPageComponent.template'}"
										:to="{name: 'albumDescription', params: { requestData: musicOfArtist[index],trackId:element.album.tracklist,  albumTitle:element.album.title, artistName:element.artist.name, artistePage:element.artist.link, artistImg:element.artist.picture_big, albumCover: element.album.cover_big, albumPath:'https://www.deezer.com/album/'+element.album.id, albumTrack:element.album.tracklist}}" 
										>Consulter l'album</router-link>
										<a class="waves-effect waves-light btn modal-trigger" href="#modal1">Album</a>

						<router-link    :class="{'active' : $route.name === 'artistPageComponent.template'}"
										:to="{name:'artistPage', params:{artistLink:element.artist.link, artistId:element.artist.id, artistFans:'https://api.deezer.com/artist/'+element.artist.id, artistName:element.artist.name, artistImg:element.artist.picture_big}}"
										>Voir la fiche de l'artiste</router-link>
					</div>
					<div class="card-action">
						<audio v-bind:src="element.preview" type="audio/mp3" controls="controls">
							Votre navigateur ne supporte pas la balise AUDIO.
						</audio>
					</div>
				</div>
			</div>
		</section>
	`
});

var albumPageComponent = Vue.component('albumPage', {

	// props:['trackId', 'albumPath'],

	props : {
		requestData : Object,
		trackId : String,
		albumPath : String
	},

	data: function(){
		return{
			//urlTrack : 'https://api.deezer.com/album/53227232/tracks&output=jsonp',
			trackList:[],
			total: 0,
			index:0,
			nextURL: ''
		}
	},
	created: function(){
		bus.$on('test', (musicOfArtist) => {
			console.log(musicOfArtist);
			return this.musicOfArtist = musicOfArtist;
		});

	},

	methods:{

		requestTrack: function(){
			console.log('Ceci est url venant de prop:'+this.trackId);
			var urlForTrack = this.trackId+'&output=jsonp';
			console.log(urlForTrack);
			fetchJsonp(urlForTrack)
				.then( data =>  data.json())
				.then((data)=> {
					
					this.trackList = data.data;
					this.total = data.total;
					this.nextURL = data.next;
					console.log(this.trackList);
				})
		}
		
	},

	template:`
		<section>
			<p>{{$route.params.requestData.album.id}}</p>
			<div>
				<h1>Album:{{$route.params.albumTitle}}</h1>
				<p>Artiste:<a v-bind:href="$route.params.artistePage">{{$route.params.artistName}}</a></p>
				<button v-on:click="requestTrack()">Afficher les tracks</button>
			</div>
			<div class="d-flex justify-content-start">
				<div><img v-bind:src="$route.params.albumCover"></div>
				<ul class="collection with-header">
					<li class="collection-header"><h1>First Names</h1></li>
					<div v-for="(track,index) in trackList">
						<!--<a v-bind:href="track.link"><li class="collection-item">{{track.title}}</li></a>-->
						<router-link	:class="{'active' : $route.name === 'titlePageComponent.template'}" 
										:to="{name: 'trackPage', params:{ trackTitle:track.title, trackLink:track.link, trackPreview:track.preview, albumPic:$route.params.albumCover, albumHeader:$route.params.albumTitle, artistPic:$route.params.artistImg, artistNom:$route.params.artistName}}">
							<li class="collection-item">{{track.title}}</li>
						</router-link>
					</div>
				</ul>
			</div>
			<a v-bind:href="$route.params.albumPath">Voir album</a>
		</section>
	`
});

var artistPageComponent = Vue.component('artistPage',{

	props:['artistLink', 'artistFans'],
	data: function(){
		return{
			fansList:{},
			total: 0,
			index:0,
			nbFans:0
		}
	},

	methods:{

		requestForFans: function(){
			
			var urlForFans = this.artistFans+'?output=jsonp';
			console.log(urlForFans);
			fetchJsonp(urlForFans)
				.then( data =>  data.json())
				.then((data)=> {
					
					this.fansList = data;
					this.total = data.total;
					this.nextURL = data.next;
					console.log(this.fansList);
					
					return this.fansList;
				})

		}
		

	},

	template:`
		<section>
			<h1>{{$route.params.artistName}}</h1> 
			<div><img v-bind:src="$route.params.artistImg"></div>
			<button v-on:click="requestForFans()">Voir le nombre de fans</button>
			<div>
				<p>Nombre d'album:{{fansList.nb_album}} </p>
				<p>Nombre de fan:{{fansList.nb_fan}}  </p>
			</div>
			<div><a v-bind:href="$route.params.artistLink">Voir l'artiste sur Deezer</a></div>
		</section>
	`

});

var titlePageComponent = Vue.component('trackPage',{

	props:[],

	data: function(){
		return{  }
	},

	methods:{
		something: function(){
			var qqchose = bus.$on('test', (musicOfArtist) => {
				// console.log(musicOfArtist) ;
				this.musicOfArtist = musicOfArtist;
	
				console.log(this.musicOfArtist);
			});
			console.log(qqchose);
		},

		convertTime: function(musicTime){

			var min = 0;
			var sec = 0;
			var timeConverted;

			min = Math.floor(musicTime/60);
			//console.log('Voici minute:'+min);

			sec = musicTime - (min*60);
			//console.log('Voici secondes:'+sec);

			timeConverted = min +':'+sec;
			return timeConverted;

		}

	},

	template:`
		<section>
			<div>Title:<h1>{{$route.params.trackTitle}}</h1></div>
			<div class="row">
				<div class="col s6">
					<img class="activator" v-bind:src="$route.params.albumPic">
					<p>
						Album:
						<router-link 	:class="{'active' : $route.name === 'titlePageComponent.template'}"
											:to="{name: 'albumDescription', params:{albumCover:$route.params.albumPic, artistNom:$route.params.artistNom, albumTitle:$route.params.albumTitle}}"
										>{{$route.params.albumHeader}}</router-link>
						<a v-bind:href="$route.name">{{$route.params.albumHeader}}</a>
					</p>
				</div>
				<div class="col s6">
					<img class="activator" v-bind:src="$route.params.artistPic">
					<p>Artiste:<router-link v-link="'/artist-page'">{{$route.params.artistNom}}</router-link></p>
				</div>
			</div>
			<div>
				<audio v-bind:src="$route.params.trackPreview" type="audio/mp3" controls="controls">
					Votre navigateur ne supporte pas la balise AUDIO.
				</audio>
				<!--<p>{{convertTime($route.params.requestData.duration)}}</p>-->
			</div>
			<div class="row">
				<a class="col 	s2 waves-effect btn blue darken-3" v-bind:href="$route.params.trackLink" 
								target="_blank">Voir le titre sur Deezer</a>
				<div class="col s3 white"></div>
				<a class="col s2 waves-effect btn" >Ajouter au favoris</a>
			</div>
		</section>

	`
});

export{
	homePageComponent,
	albumPageComponent,
	artistPageComponent,
	titlePageComponent
}
