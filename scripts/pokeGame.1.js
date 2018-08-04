
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.greeting);
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "injecting")
      sendResponse({farewell: 'injected!!'});
    if (request.greeting == "SPAWN"){
      const newPokemon = new WildPokemon();
      sendResponse({farewell:'spawned!'})
    }
    return true
  });

const pokemonStore = {
  //jolteon
  0: '<img class="wild-pokemon" src="https://i.pinimg.com/originals/16/17/e6/1617e654042c91da3a2f9145ffd36e97.gif">',
  //growlithe
  1: '<img class="wild-pokemon" src="http://31.media.tumblr.com/21e9ab876cd84558592f3bcfb21c37fc/tumblr_ml5q06jBQc1s5h198o1_500.gif">',
  //suicune
  2: '<img class="wild-pokemon" src="http://gifimage.net/wp-content/uploads/2018/04/pokemon-sprites-gif-13.gif">',
  //eevee
  3: '<img class="wild-pokemon" src="http://rs248.pbsrc.com/albums/gg199/alex061095/Pokemon%20Sprites/eevee.gif~c200">',
  //charmander
  4: '<img class="wild-pokemon"  src="https://i.gifer.com/3bMU.gif">'
}
const pokemonStoreCount = Object.keys(pokemonStore).length

class WildPokemon {
  constructor() {
    //generates a random number, based on the pokemonStore key length. This random number is used to access a random pokemon.
    this.pokemonRandomNumber = Math.floor(Math.random()*pokemonStoreCount);
    //accesses the pokemon store to obtain the HTML for a random pokemon
    this.html = $(`${pokemonStore[this.pokemonRandomNumber]}`);
    // this.currentDirection = Math.floor(Math.random()*360);
    $('body').append(this.html);
    this.randomLeftPosition = this.randomLeftPosition();
    this.randomTopPosition = this.randomTopPosition(); 
    this.html.css({ top: this.randomTopPosition, left: this.randomLeftPosition });
    console.log(this.move.bind(this))
    this.move.bind(this)()
  }

  randomLeftPosition(){
    return Math.floor(Math.random() * (window.innerWidth-150))
  }

  randomTopPosition(){
    return Math.floor(Math.random() * (window.innerHeight-150)) 
  }

  move(){
    //move in a random direction
    //change direction every 2-5 seconds
     const position = this.html.position();  
     const randomMoveTime = Math.floor(Math.random() * 1000) + 1600;
     const randomLeftPosition =  Math.floor(Math.random() * (window.innerWidth-150))
     const randomTopPosition = Math.floor(Math.random() * (window.innerHeight-150)) 
     this.html.animate({top: randomTopPosition, left: randomLeftPosition}, randomMoveTime); 
     setTimeout(this.move.bind(this), randomMoveTime)
  }
  
}



