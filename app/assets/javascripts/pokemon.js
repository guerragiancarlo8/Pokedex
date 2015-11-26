// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
"use strict"
PokemonApp.Pokemon = function(pokemonUri){

	this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
}

PokemonApp.PokemonImage = function(resource_uri,which_image_class){

	$.ajax({

		url: "http://pokeapi.co"+resource_uri,
		success: function(response){

			$(which_image_class).attr("src","http://pokeapi.co"+response['image'])

		}
	})
}

PokemonApp.PokemonDescription = function(resource_uri){

	$.ajax({

		url: "http://pokeapi.co"+resource_uri,
		success: function(response){

			$('.js-pkmn-description').text(response['description'])
		}
	})
}

PokemonApp.PokemonEvolutions = function(resource_uri){

	$.ajax({

		url: "http://pokeapi.co"+resource_uri,
		success: function(response){

	

			$(".evol-pkmn-name").text(response['name'])

			//el enlace q nos va a llevar al pokemon original
			$("#test").attr("data-evolution-uri",response['resource_uri'])
			//console.log("this is response['resource_uri]"+response['resource_uri'])

			//get the image for the evolution and set it in the evolution image src
			PokemonApp.PokemonImage(response['sprites'][0]['resource_uri'],".evol-pkmn-image img")

		}
	})
}

PokemonApp.Pokemon.prototype.render = function(){

	var self = this;


	$.ajax({

		url: "/api/pokemon/" + this.id,
		success: function(response){

			self.info = response;


			$(".js-pkmn-name").text(self.info.name);
			$(".js-pkmn-number").text(self.info.pkdx_id);
			$(".js-pkmn-height").text(self.info.height);
			$(".js-pkmn-weight").text(self.info.weight);
			$(".js-pkmn-hp").text(self.info.hp);
			$(".js-pkmn-attack").text(self.info.attack);
			$(".js-pkmn-defense").text(self.info.defense);
			$(".js-pkmn-spatk").text(self.info.sp_atk);
			$(".js-pkmn-spdef").text(self.info.sp_def);
			$(".js-pkmn-speed").text(self.info.speed);

			//get the image
			PokemonApp.PokemonImage(self.info.sprites[0]['resource_uri'],"#pokemon-image")

			//get the most recent version and then the description
			var most_recent_version = self.info.descriptions.length
			PokemonApp.PokemonDescription(self.info.descriptions[most_recent_version - 1]['resource_uri'])
			
			//get evolutions
			for(var i=0; i<self.info.evolutions.length;i++){

				PokemonApp.PokemonEvolutions(self.info.evolutions[0]['resource_uri'])
			}
			//iterate to find the elemental types for selected pokemon
			$('h4').remove()
			for(var i=0; i<self.info.types.length;i++){

				$(".js-pkmn-types").append('<h4>'+self.info.types[i]["name"]+'</h4>');
			}

			$('.js-pokemon-modal').modal("show")

			self = undefined
		}
	});
};

PokemonApp.Pokemon.idFromUri = function(pokemonUri){

	var uriSegments = pokemonUri.split("/")
	var secondLast = uriSegments.length - 2;
	return uriSegments[secondLast];
}

$(document).on('ready',function(){
	//when the show evolutions button is clicked, pop up the modal for the evolutions
	$(".evol-show-evols").on('click',function(event){

		$('.evol-evolutions-modal').modal("show")
	})

	$("#test").on('click',function(event){

		var $button = $(event.currentTarget)
		console.log(event.currentTarget)
		var uri = $button.attr("data-evolution-uri")

		console.log(uri)

		var newpok = new PokemonApp.Pokemon(uri)
		console.log(newpok)
		$('.evol-evolutions-modal').modal("hide")
		newpok.render();
		
		//$('.js-pokemon-modal').modal("hide")
	});

	$(".js-show-pokemon").on('click',function(event){

		
		var $button = $(event.currentTarget);
		var pokemonUri = $button.data("pokemon-uri")

		var pokemon = new PokemonApp.Pokemon(pokemonUri);
		pokemon.render();
	});
});