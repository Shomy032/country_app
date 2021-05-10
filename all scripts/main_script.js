// let buttons = [];
//parent
const main = document.getElementById('main');
//form elements
const form = document.getElementById('form');
const input = document.getElementById('input');

const btn = document.getElementById('btn');
const drop_down = document.getElementById('drop_down');
const left_right = document.getElementById('left_right');
// url with defined what to fetch (we dont need all)
const url_all_init = 'https://restcountries.eu/rest/v2/all?fields=name;capital;region;population;flag;alpha2Code';
const url_search = 'https://restcountries.eu/rest/v2/name/name' ;
//function for serch fetch
// search function 


// initial fetch , get 32 random counties.
 getData(url_all_init) ;

form.addEventListener('submit' , (e) =>{
  e.preventDefault()

  main.innerHTML = '' ;
  const search_value = input.value ;
// it work for now , but i need to add catch statment
  if(search_value){
    getData(`https://restcountries.eu/rest/v2/name/${search_value}`)
  } 
  input.value = '' ;
})

//function for initial fetch (reusable later) ;
async function getData(url){
  //first clear main
main.innerHTML = '' ;
// fetch data
try{
  const resp = await fetch(url);
  const data = await resp.json();
  // sort response by random
   let sort = data.sort(func);  
    function func(a, b) {  
      return 0.5 - Math.random();
    }  
    console.log('sort');
    // use random 32 cards
    let newArr = sort.slice(0 , 32)
    // for each country on screen , this function is used later in search too.
    newArr.forEach(country => {
      // create card
    const card = document.createElement('div');
    card.classList.add('card')
  
    // deconstruct all data we need
    let {name , capital , region , population , flag , alpha2Code} = country ;
  // add class off region soo we can search later
  if (region !== ''){
    card.classList.add(`${region}`);
  } else {
    card.classList.add('no_region');
  }
   
  // check if capital or region are "" or null
  if (capital == "" || capital === null){
    capital = "no capital..."
  }
  if (region == "" || region === null){
    region = " no region..."
  }
  
  // number (population) format algorytm ,bcs numbers are too big..
  if (population > 10000){
    population = (population / 1000000) ;
    population = population.toFixed(2) + " " + 'M';
  } 
  
    // truncate string algorithms :
    // 1.
    if (name.length > 18) {
       name = name.slice(0, 18) + '...' ;
    }
    // 2.
    if (capital.length > 13) {
      capital = capital.slice(0, 13) + '...' ;
   }
  //

  // add data to card
    card.innerHTML =
    `<img src="${flag}" alt="flag">
    <button class="${alpha2Code} show_more">Learn more</button>
  <div id="info">
  <h4 id="country_name">${name}</h4>
  <ul>
    <li>
      <span>Population :</span>
       <span id="population">${population}</span>
    </li>
    <li>
      <span>Region :</span>
       <span id="region">${region}</span>
    </li>
    <li>
      <span>Capital :</span>
       <span id="capital">${capital}</span>
    </li>
  </ul> 
  </div> `
  // add it to document
  main.appendChild(card);



  }); // end of for each

  let buttons = document.querySelectorAll('.show_more');
  
  buttons.forEach( b => {
    b.addEventListener('click' , () => {
      console.log('works' , b.classList[0])
      fetch(`https://restcountries.eu/rest/v2/alpha/${b.classList[0]}`)
      .then(e => e.json())
      .then(data => {
        console.log(data);
        // here we deconstructure
      });
    })
  })

} catch(err){
  // append another element , bcs we have no search results
  noResults();
  console.log(err);
}
  // i want to search by first class  ->. button[0]


}

//event to show filter bar
btn.addEventListener('click' , () => {
  drop_down.classList.toggle('show');
  if(left_right.classList.contains('fa-chevron-left')){
    left_right.classList.remove('fa-chevron-left');
    left_right.classList.add('fa-chevron-right');
  } else{
    left_right.classList.remove('fa-chevron-right');
    left_right.classList.add('fa-chevron-left');
  }
  
});

// get all filter buttons
const region_btn = document.querySelectorAll('.region_btn');
// add on click to all of the with diferent logic
region_btn.forEach(element => {
element.addEventListener('click' , () =>{
const region = element.id ;
const card = document.querySelectorAll(`.card`)
card.forEach(e => {
if(!e.classList.contains(`${region}`)){
e.classList.add('remove');
} 
else{
  e.classList.remove('remove');
}

})
console.log(region);
})
});

// REMINDER
// if (region !== ''){
//   card.classList.add(`${region}`);
// } else {
//   card.classList.add('no_region');
// }
//Africa, Americas, Asia, Europe, Oceania , no_region

function noResults(){
  
  const ele = document.createElement('div');
  ele.classList.add('no_results');

  ele.innerHTML = `
  <i class="fas fa-search"></i>
  <div>
  <p class='hm'>Hmmm...</p>
  <p class='va'>We couldnt find any matches ...</p>
<p class='error'>Double check your search for any typos or spelling errors - or try a different search term.</p>
</div>
  ` ;

main.appendChild(ele)
}