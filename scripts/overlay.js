


//create a pokemon spawn button lower right corner

const spawnButton = $('<button>', {id: 'spawn'});
spawnButton.text('SPAWN');
$('body').append(spawnButton);
const spawnButtonTop = window.innerHeight * 0.95;
const spawnButtonLeft = window.innerWidth * 0.95;
spawnButton.css({top: spawnButtonTop, left: spawnButtonLeft})

$('#spawn').click( () => {
  const newPokemon = new WildPokemon();
})

//create inventory modal
const modal = $('<div>',{class:"modal", id:"inventory-modal"})
const modalContent = $('<div>',{class:"modal-content"})
modalContent.append($('<div>STUFFFF</div>'));
modal.append(modalContent);
$('body').append(modal);


//create a inventory button
const inventoryButton = $('<button>', {id: 'inventory-button'});
inventoryButton.text('POKE');
$('body').append(inventoryButton);
inventoryButton.css({top: spawnButtonTop * .95, left: spawnButtonLeft});
$('#inventory-button').click( () => {
  openInventoryModal();
})

let count = 0;

function openInventoryModal(){
  modal.css({display:"block"});
  window.onclick = function(event) {
    console.log('hiii');
    console.log(event.target.id);
    if (event.target.id === 'inventory-modal') {
      count++;
      chrome.storage.sync.set({'closed': count});
      modal.css({display:"none"});
    }
    chrome.storage.sync.get(['closed'], function(result) {
      console.log('Value currently is ' + result.closed);
    });
  
  }
}

