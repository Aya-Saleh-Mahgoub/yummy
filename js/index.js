let homeData = document.getElementById("homeData");
let searchContent = document.getElementById("searchInputs");
let submit;

$(document).ready(() => {
  apiSearchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
    $(".inner-loading-screen").fadeOut(500); // hide loading screen
  });
});
//  actions clicked nav tabs
$('#search').on('click', function(){
  getForm();
  SideNav();
});
$('#categories').on('click', function(){
  apiCats();
  SideNav();
})
$('#area').on('click', function(){
   apiArea();
   SideNav();
})
$('#ingredients').on('click', function(){
  apiIngredients();
  SideNav();
})
$('#contactUS').on('click', function(){
  validationsForm();
  SideNav();
})
// start side nav open and close
let outerNavWidth;
function SideNav() {
  outerNavWidth = $(".sideNav .nav-tab").outerWidth();
  closeNav();
  $(".sideNav i.open-close-icon").click(() => {
    if ($(".sideNav").css("left") == "0px") {
      $(".sideNav").animate({left: `-${outerNavWidth}px`}, 500);
      $(".open-close-icon").addClass("fa-align-justify");
      $(".open-close-icon").removeClass("fa-x");

      $(".links li").animate({top: `300px`},500);
    } else {
      $(".sideNav").animate( {left: 0},500);
      $(".open-close-icon").removeClass("fa-align-justify");
      $(".open-close-icon").addClass("fa-x");

      for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({top: 0},(i + 5) * 100);
      }
    }
  });
}
function closeNav(){
  $('.sideNav').animate({left: `-${outerNavWidth}px`}, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
}

SideNav();
// end side nav toggle 
// start display home for all meals
function homeMeals(arr) {
  let homeMealsData = "";

  for (let i = 0; i < arr.length; i++) {
    homeMealsData += `
        <div class="col-md-3">
                <div onclick="singleMeal('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  }

  homeData.innerHTML = homeMealsData;
}
// end 
// single meal info api and display it

async function singleMeal(mealID) {
  homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading

  searchContent.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  respone = await respone.json();

  getSingleMeal(respone.meals[0]);
  $(".inner-loading-screen").fadeOut(300);// hide loading
}

function getSingleMeal(meal) {
  searchContent.innerHTML = "";
//   for loop on strIngredient and check if the value not null 
// then bind strIngredient and  strMeasure in li tag to display list of Recipes and the tags
  let strIngredient = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
        strIngredient += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      }
       ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
 
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let singleMealInfo = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${strIngredient}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

            homeData.innerHTML = singleMealInfo;
}
// end single meal info 
//display all categories with api and display all catecories for each single meal
async function apiCats() {
    homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading
  searchContent.innerHTML = "";

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const response = await api.json();

  getCats(response.categories);
  $(".inner-loading-screen").fadeOut(300);// hide loading
}

function getCats(arr) {
  let allCats = "";

  for (let i = 0; i < arr.length; i++) {
    allCats += `
        <div class="col-md-3">
                <div onclick="getCatsMeals('${
                  arr[i].strCategory
                }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${
                      arr[i].strCategoryThumb
                    }" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  homeData.innerHTML = allCats;
}
async function getCatsMeals(cat) {
  homeData.innerHTML = "";
    homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  const response = await api.json();

  homeMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);// hide loading
}
// end cats functions

//get area meals
async function apiArea() {
    homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading

  searchContent.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  respone = await respone.json();
  console.log(respone.meals);

  getAreas(respone.meals);
  $(".inner-loading-screen").fadeOut(300);// hide loading
}

function getAreas(arr) {
  let areas = "";

  for (let i = 0; i < arr.length; i++) {
    areas += `
        <div class="col-md-3">
                <div onclick="apiAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
    `;
  }

  homeData.innerHTML = areas;
}
// get meals for specific area api 
async function apiAreaMeals(area) {
    homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const response = await api.json();

  homeMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);// hide loading
}
// end areas meals

// display ingredients meals with api 
async function apiIngredients() {
    homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300); // display loading

  searchContent.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  respone = await respone.json();
  console.log(respone.meals);

  getIngredients(respone.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);// hide loading
}

function getIngredients(arr) {
  let ingredients = "";

  for (let i = 0; i < arr.length; i++) {
    ingredients += `
        <div class="col-md-3">
                <div onclick="apiMealIngredients('${
                  arr[i].strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
    `;
  }

  homeData.innerHTML = ingredients;
}
// get api for all ingredients for specific meal

async function apiMealIngredients(ingredients) {
  homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  const response = await api.json();

  homeMeals(response.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);// hide loading
}
// end ingerdiants toggle nav action

//start search inputs functions
function getForm() {
  searchContent.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="apiSearchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="FletterInput" onkeyup="apiSearchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
   
    homeData.innerHTML = "";
    
}

async function apiSearchByName(term) {
  homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);// display loading screen

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const response = await api.json();

  response.meals ? homeMeals(response.meals) : homeMeals([]);
  $(".inner-loading-screen").fadeOut(300);// hide loading
}


async function apiSearchByFLetter(term) {;
  homeData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300); // display loading screen
  // console.log(term.split(" ").slice(0).join(" "));
  term == "" ? (term = "a") : "";
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  const response = await api.json();
  response.meals ? homeMeals(response.meals) : homeMeals([]);
  
  
  $(".inner-loading-screen").fadeOut(300); // hide loading
}
// end search inputs functions
function validationsForm() {
    homeData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container contactUs w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="name" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="email" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phone" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="age" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="password" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repassword" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submit" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
// onkeyUp event for all inputs for validation
$('.contactUs input').keyup(function(){
  inputsValidationError();
});

submit = document.getElementById("submit"); //i initialize it above to be global to prevent error of null because when website refreshed the contact form  will be null
focusedInputs();
}
// declarations for focused input 
let nameFocused = false;
let emailFocused = false;
let phoneFocused = false;
let ageFocused = false;
let passwordFocused = false;
let repasswordFocused = false;
// alert boxes wil be d-block when input is focused
 function focusedInputs(){
$("#name").focus(function(){
  nameFocused = true;
});
$("#email").focus(function(){
  emailFocused = true;
});
$("#phone").focus(function(){
  phoneFocused = true;
});
$("#age").focus(function(){
  ageFocused = true;
});
$("#password").focus(function(){
  passwordFocused = true;
});
$("#repassword").focus(function(){
  repasswordFocused = true;
});
 }
// if input focused apply alerts conditions
function alertFocusedInputs(){
// alert validations for focused inputs
if(nameFocused){
  if(nameValidationError()){
    $('#nameAlert').removeClass('d-block').addClass('d-none');
    $('#name').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#nameAlert').removeClass('d-none').addClass('d-block');
     $('#name').removeClass('is-valid').addClass('is-invalid');
   }
}
if(emailFocused){
  if(emailValidationError()){
    $('#emailAlert').removeClass('d-block').addClass('d-none');
    $('#email').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#emailAlert').removeClass('d-none').addClass('d-block');
     $('#email').removeClass('is-valid').addClass('is-invalid');
   }
}
if(phoneFocused){
  if(phoneValidationError()){
    $('#phoneAlert').removeClass('d-block').addClass('d-none');
    $('#phone').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#phoneAlert').removeClass('d-none').addClass('d-block');
     $('#phone').removeClass('is-valid').addClass('is-invalid');
   }
}
if(ageFocused){
  if(ageValidationError()){
    $('#ageAlert').removeClass('d-block').addClass('d-none');
    $('#age').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#ageAlert').removeClass('d-none').addClass('d-block');
     $('#age').removeClass('is-valid').addClass('is-invalid');
   }
}
if(passwordFocused){
  if(passwordValidationError()){
    $('#passwordAlert').removeClass('d-block').addClass('d-none');
    $('#password').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#passwordAlert').removeClass('d-none').addClass('d-block');
     $('#password').removeClass('is-valid').addClass('is-invalid');
   }
}
if(repasswordFocused){
  if(repasswordValidationError()){
    $('#repasswordAlert').removeClass('d-block').addClass('d-none');
    $('#repassword').removeClass('is-invalid').addClass('is-valid');
   }else{
     $('#repasswordAlert').removeClass('d-none').addClass('d-block');
     $('#repassword').removeClass('is-valid').addClass('is-invalid');
   }
}

// end alerts boxes

}
function inputsValidationError(){
  alertFocusedInputs();
  // console.log('event');
  if(nameValidationError()&&emailValidationError()
    &&phoneValidationError()&&ageValidationError()
    &&passwordValidationError()&&repasswordValidationError()){
    $("#submit").removeAttr("disabled");
}else{
    $("#submit").attr("disabled",true);
}
  
}
function nameValidationError(){
  let regex = /^[a-zA-Z ]+$/;
  // console.log(regex.test($('.contactUs #name').val()));
  return regex.test($('.contactUs #name').val());
}
function emailValidationError() {
  let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // console.log(regex.test($('.contactUs #email').val()))
  return regex.test($('.contactUs #email').val());
}
function phoneValidationError() {
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  // console.log(regex.test($('.contactUs #phone').val()))
  return regex.test($('.contactUs #phone').val());
}
function ageValidationError() {
  let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  // console.log(regex.test($('.contactUs #age').val()))
  return regex.test($('.contactUs #age').val());
}
function passwordValidationError() {
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  // console.log(regex.test($('.contactUs #password').val()))
  return regex.test($('.contactUs #password').val());
}
function repasswordValidationError() {
  return ($("#repassword").val() == $("#password").val());
}

