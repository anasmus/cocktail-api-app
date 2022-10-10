const form = document.getElementById('form');
const button = document.getElementById('button');
const drink = document.getElementById('drink');
const drinkImage = document.getElementById('drinkImage');
const drinkName = document.getElementById('drinkName');
const ingredients = document.getElementById('ingredients');
const ingredientsHeading = document.querySelector('.ingredients__heading');
const instructions = document.getElementById('instructions');
const instructionsHeading = document.querySelector('.instructions__heading');
let index = 0;
let requiredDrink = '';
button.addEventListener('click', getDrink);
form.addEventListener('submit', getDrink);
document.querySelectorAll('.control__btn').forEach(btn => {
  btn.addEventListener('click', changeDrink)
});
ingredientsHeading.addEventListener('click', e => {
  ingredients.classList.toggle('ingredients__list--shown')
});
instructionsHeading.addEventListener('click', e => {
  instructions.classList.toggle('instructions__list--shown')
});

function getDrink(e) {
  e.preventDefault();
  requiredDrink = drink.value.toLowerCase().trim().replaceAll(' ', '+');
  if (!drink.value) return;
  index = 0;
  updateDrink(index);
}

function changeDrink(e) {
  if (!requiredDrink) return;
  if (e.target.className === 'control__btn control__btn--right') {
    index++;
  } else {
    index--;
  }
  updateDrink(index);
}
function updateDrink(index) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${requiredDrink}`)
       .then(res => res.json())
       .then(data => {
        const itemIndex = (index < 0) ? (data.drinks.length + index) : index % data.drinks.length;
        drinkImage.src = data.drinks[itemIndex].strDrinkThumb
        drinkName.innerText = data.drinks[itemIndex].strDrink
        const list = createList(data.drinks[itemIndex])
        if (document.querySelector('.ingredients__list')) document.querySelector('.ingredients__list').remove()
        if (document.querySelector('.instructions__list')) document.querySelector('.instructions__list').remove()
        ingredients.appendChild(list[0])
        instructions.appendChild(list[1])
       })
       .catch(err => {
         drinkImage.src = 'imgs/not-found.png'
         drinkName.innerText = 'Not Found'
       })
}
function createList(drinkObject) {
  const ul = document.createElement('ul');
  for (let i = 1; i <= 15; i++) {
    if (drinkObject[`strIngredient${i}`]) {
      const li = document.createElement('li');
      li.innerText = drinkObject[`strIngredient${i}`];
      if (drinkObject[`strMeasure${i}`]) {
        li.innerText += ` - ${drinkObject[`strMeasure${i}`]}`;
      }
      ul.appendChild(li);
    }
    else {
      break;
    }
  }
  ul.className = 'ingredients__list';
  
  const ol = document.createElement('ol');
  drinkObject.strInstructions.split('.').forEach(eachInstruction => {
    if (!eachInstruction) return
    const li = document.createElement('li')
    li.innerText = eachInstruction.trim() + '.'
    ol.appendChild(li)
  });
  ol.className = 'instructions__list';

  return [ul, ol];
}