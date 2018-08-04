

window.onload = load;

function load(){
  const pokes = loadOrCreateStorage();
  populateInventory(pokes);
}

let play = document.getElementById('inject');
let spawn = document.getElementById('spawn');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

function loadOrCreateStorage(){
  let numPokemon = 0;
  console.log('inside loadOrCreateStorage');
  chrome.storage.sync.get(['pokeCount'], function(result) {
    console.log('result.pokeCount is set to ' + result.pokeCount);
    numPokemon = result.pokeCount;

    if(numPokemon === undefined){
      chrome.storage.sync.set({'pokeCount': 0}, function() {
        console.log('Pokecount is set to ' + 0);
      });
    }
    console.log('numPokemon: '+ numPokemon);
  });
  return numPokemon;
}

function populateInventory(numOfPokemon){

  //get the inventory
  let inventory = {};
  chrome.storage.sync.get(['0'], function(result) {
    inventory = result;
  });
  console.log('inventory:')
  console.log(inventory);
  //loop and append pokemon
  for(let i =0;i<numOfPokemon;i++){
    let curreMon = inventory[i];
    $('#pokemon-inv').append(curreMon.html)
  }

}

play.onclick = function(element) {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log('received!');
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye FROM POPUP"});
      if (request.greeting == "CAUGHT"){
        console.log('kkkkk');
        //get teh current count and increment;
        const pokeId = request.storeId;
        chrome.storage.sync.get(['pokeCount'], function(result) {
          console.log('Pokecount is ' + result.pokeCount);
          let newCaughtPokemon = new CaughtPokemon(pokeId);
          let key = result.pokeCount;
          let newCount = result.pokeCount+1;
          let newItem = {'pokeCount': newCount, key: newCaughtPokemon};
          chrome.storage.sync.set(newItem, function() {
            console.log(`Incrementing pokeCount to ${result.pokeCount+1}`);
            console.log(`and adding a new store#${pokeId} to the inventory`)
          }); 
        });
        


        
        sendResponse({farewell: "pokemon stored!"});
      }
      //return true;
    });
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    tabs.forEach((tab,index) =>{

      chrome.tabs.executeScript(tab.id, {
        file: 'scripts/jquery.min.js'
      });
      chrome.tabs.insertCSS(tab.id, {
        file: 'css/poke.css'
      });
      chrome.tabs.executeScript(tab.id, {
        file: 'scripts/pokeGame.js'
      });

      
      chrome.tabs.sendMessage(tab.id, {greeting: "injecting"}, function(response) {
        console.log(response.farewell);
      });

    });
  });
};

spawn.onclick = function(element){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "SPAWN"}, function(response) {
      console.log(response.farewell);
    });
  });
};


const pokemonStore = {
  //jolteon
  0: '<img class="caught-pokemon" src="https://i.pinimg.com/originals/16/17/e6/1617e654042c91da3a2f9145ffd36e97.gif">',
  //growlithe
  1: '<img class="caught-pokemon" src="http://31.media.tumblr.com/21e9ab876cd84558592f3bcfb21c37fc/tumblr_ml5q06jBQc1s5h198o1_500.gif">',
  //suicune
  2: '<img class="caught-pokemon" src="http://gifimage.net/wp-content/uploads/2018/04/pokemon-sprites-gif-13.gif">',
  //eevee
  3: '<img class="caught-pokemon" src="http://rs248.pbsrc.com/albums/gg199/alex061095/Pokemon%20Sprites/eevee.gif~c200">',
  //pikachu
  4: '<img class="caught-pokemon" src="https://i.gifer.com/1V94.gif">',
  //charmander
  5: '<img class="caught-pokemon" src="http://rs77.pbsrc.com/albums/j61/Black_kitsune_Rioku/Pokemon%20Platinum%20Animated%20Sprites/CharmanderPlatinum.gif~c200">',
  //squirtle
  6: '<img class="caught-pokemon" src="http://rs77.pbsrc.com/albums/j61/Black_kitsune_Rioku/Pokemon%20Platinum%20Animated%20Sprites/Squirtle.gif~c200">',
  //mewtwo
  7: '<img class="caught-pokemon" src="https://78.media.tumblr.com/94dd642bae4af0f8f29b4187f8b00f9a/tumblr_mkv8xzNuYo1s3bc1no1_500.gif">',
  //Snorlax
  8: '<img class="caught-pokemon" src="https://78.media.tumblr.com/6eff72a4406552302fead4a9e13f5ee2/tumblr_oi5n67fG6L1vr3vrmo1_500.gif">',
  //bulbasaur
  9: '<img class="caught-pokemon" src="http://rs1265.pbsrc.com/albums/jj514/Narcotic-Dementia/All%20Pokemon%20Sprites%20Animated/001.gif~c200">',
}

//inventory stuff












class CaughtPokemon {
  constructor(pokemonID) {
    //When a pokemon was caught, we knew its type, AKA it's number in the store. Pokemon ID is this number
    this.html = $(`${pokemonStore[pokemonID]}`);
    this.level = 1;
    this.experence = {currentXP: 0, levelUpXP: 100}
    this.hp = 20 + Math.floor(Math.random()*10)
    this.attack = 10 + Math.floor(Math.random()*5)
  }
  gainExperience(){
    this.experience[currentXP] += 20 + Math.floor(Math.random()*50);
    if (this.experience[currentXP] > this.experience[levelUpXP]){
      this.experience[currentXP] = this.experience[levelUpXP] - this.expereince[currentXP]
      this.levelUp()
    }
  }
  levelUp(){
    this.experience[levelUpXP] *= 1.2;
    this.level += 1; 
    this.hp += 10 + Math.floor(Math.random()*5)
    this.attack += 4 + Math.floor(Math.random()*3)
  }
}