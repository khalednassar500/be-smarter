const START_BUTTON = document.getElementById('start');
const RESTART_BUTTON = document.getElementById('restart');
const PAUSE_PLAY_BUTTON = document.getElementById('pause_play');
const USER_CHOICES = document.querySelectorAll('.choices input');
const PLACE_OF_QUIZE = document.querySelector('#quiz_con');
const CHOICES_CONTAINER = document.querySelectorAll('.choices');
const OPERATIONS = document.getElementById('operations');
const CURRENT_NUM = document.getElementById('current');
const SETTING_ICON = document.getElementById('res');

let checker = true;

let userOptions = [];  //All options chosen by the player in order to run the program accordingly
let userLevel = '';      //All options chosen by the player in order to run the program accordingly

const RANDOM_NUM = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const RANDOM_2NUM = (level) => {  // create a random number based on the level
  let range = []
  if (level == 'easy') {
    range = [0, 10];// easy level
  }else if (level == 'middle') {
    range = [10, 100];// middle level
  }else {
    range = [100, 1000];// advaned level
  }    
  return [RANDOM_NUM(range[1], range[0]),
          RANDOM_NUM(range[1], range[0])] 

}

let mathProblems = [];  //Store the arithmetic operations that will be created
let PCSolutions = [];   //Store the arithmetic operations solution by the computer
let userSolutions = []; //Store the arithmetic operations solution by the user

const PROBLEM_SOLVER = (num1, operator, num2) => {
  let solution = '';
  switch(operator) {
    case '+':
      solution = num1 + num2;
      break;
    case '–':
      solution = num1 - num2;
      break;
    case '×':
      solution = num1 * num2;
      break;
    case '÷':
      solution = num1 / num2;
      break;
  }
  return solution;
}

const CREATE_QUIZES = () => {
  let nums = RANDOM_2NUM(userLevel);
  let operator = userOptions[RANDOM_NUM((userOptions.length -1), 0)]
  let quize = nums[0] +' '+ operator +' '+ nums[1] + ' = ';

  PLACE_OF_QUIZE.firstElementChild.textContent = quize;

  /* save the quizzes and there solutions */
  mathProblems.push(quize);
  PCSolutions.push(PROBLEM_SOLVER(nums[0], operator, nums[1]));
  
}

const TIMER = document.getElementById('timer').lastElementChild.firstElementChild;
let counter = '';
let count = 1;
let widthOfTimer = 100;
let t = 0;

let counterAction = () => {
  widthOfTimer = (widthOfTimer - 100 / (t / 1000));
  TIMER.style.width = widthOfTimer +'%';

  if (widthOfTimer <= 0) {
    userSolutions.push('');
    checker = false;
    PLACE_OF_QUIZE.lastElementChild.value = '';

    if (count == 10) {
      clearInterval(counter);
      PLACE_OF_QUIZE.lastElementChild.blur();
      PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'none';
      finalResult(checker);
      return;
    };
    count++;
    CURRENT_NUM.textContent = count;
    widthOfTimer = 100;
    TIMER.style.background = '#3575fe';
    TIMER.style.width = widthOfTimer +'%';
    CREATE_QUIZES();
  }else if(widthOfTimer <= 30) {
    TIMER.style.background = '#FF2442';
  }else if (widthOfTimer <= 60) {
    TIMER.style.background = '#FFB830';
  }
}

const INTERVAL = (level) => {  //create timer based on level
  if (level == 'easy') {
    t = 10000;
  }else if (level == 'middle') {
    t = 30000;
  }else {
    t = 120000;
  }
  counter = setInterval(counterAction, 1000);
}

function start() {    
  userOptions = [];
  userLevel = '';
  for (let x = 0; x <= USER_CHOICES.length-1; x++) {
    if (USER_CHOICES[x].checked) {
      if (USER_CHOICES[x].type == 'checkbox') {
        userOptions.push(USER_CHOICES[x].value)
      }else {
        userLevel = USER_CHOICES[x].value
      }
    }
  }

  if (userOptions.length && userLevel) {
    START_BUTTON.classList.toggle('hide');
    PAUSE_PLAY_BUTTON.classList.toggle('hide');
    CHOICES_CONTAINER[0].classList.toggle('hide');
    CHOICES_CONTAINER[1].classList.toggle('hide');
    OPERATIONS.classList.toggle('show');
    PLACE_OF_QUIZE.lastElementChild.focus()
    PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'visible';

    /* create the quize */
    CREATE_QUIZES();
    INTERVAL(userLevel);

    if (window.innerWidth <= 800) {
      RESTART_BUTTON.classList.toggle('hide');
      SETTING_ICON.click()
    }

  }else if (userOptions.length) {
    swal("Choose your level",'', "info");
  }else if (userLevel) {
    swal("Choose your options",'', "info");
  }else {
    swal("Choose your options and level",'', "info");
  }
}
START_BUTTON.addEventListener('click', start);

/*-- on submit th solution --*/
function submitSolution(event) {
  if ((event.code == 'Enter' || event.code == 'NumpadEnter' || event.keyCode == 13 ) && event.target.value ) {
    clearInterval(counter);
    

    if (checker && event.target.value != PCSolutions[PCSolutions.length-1]) {
      checker = false;
    }
    userSolutions.push(event.target.value);
    if (count == 10) {
      PLACE_OF_QUIZE.lastElementChild.blur();
      PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'none';
      finalResult(checker);
      return;
    }
    
    PLACE_OF_QUIZE.lastElementChild.value = '';
    count++;
    CURRENT_NUM.textContent = count;
    widthOfTimer = 100;
    TIMER.style.width = widthOfTimer +'%';
    TIMER.style.background = '#3575fe';
    CREATE_QUIZES();
    counter = setInterval(counterAction, 1000);
  }
}
PLACE_OF_QUIZE.lastElementChild.addEventListener('keypress', submitSolution);

/*-- when click pause button --*/
function pausePlay(e) {
  if (e.target.dataset.pause == 'false') {
    e.target.dataset.pause = 'true';
    e.target.textContent = '▶';
    RESTART_BUTTON.classList.toggle('hide');
    clearInterval(counter);
    PLACE_OF_QUIZE.lastElementChild.blur();
    PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'none';  
  }else {
    e.target.dataset.pause = 'false';
    e.target.textContent = '| |';
    RESTART_BUTTON.classList.toggle('hide');
    counter = setInterval(counterAction, 1000);
    PLACE_OF_QUIZE.lastElementChild.focus();
    PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'visible';
  }
}
PAUSE_PLAY_BUTTON.addEventListener('click', pausePlay);

/*-- when click restart button --*/
function restart() {
  RESTART_BUTTON.classList.toggle('hide');
  PAUSE_PLAY_BUTTON.classList.toggle('hide');
  PAUSE_PLAY_BUTTON.dataset.pause = 'false';
  PAUSE_PLAY_BUTTON.textContent = '| |';
  START_BUTTON.classList.toggle('hide');
  CHOICES_CONTAINER[0].classList.toggle('hide');
  CHOICES_CONTAINER[1].classList.toggle('hide');
  OPERATIONS.classList.toggle('show');
  PLACE_OF_QUIZE.lastElementChild.value = '';
  
  mathProblems = [];
  userSolutions = [];
  PCSolutions = [];

  count = 1;
  widthOfTimer = 100;
  t = 0;

  CURRENT_NUM.textContent = count;
  widthOfTimer = 100;
  TIMER.style.background = '#3575fe';
  TIMER.style.width = widthOfTimer +'%';
}
RESTART_BUTTON.addEventListener('click', restart);

/*-- After the level ends--*/  
let finalResultPosition = document.getElementById('final_result');
let audio = document.getElementById('audio');

function finalResult(result) {
  let section = document.createElement('section');

  if (result) {
    section.insertAdjacentHTML( 'afterbegin', `
                          <div class='head'>
                            <p>Congratulations 🎊🎉</p>
                            <p class='score'>100%</p>
                          </div>
                          <p class='motivational_text'>You made it 👋😃</p>`);
    
    let imgs = ['giphy.gif', 'tenor.gif', 'tenor(1).gif', 'tenor(2).gif', 'tenor(3).gif', 'tenor(4).gif', 'tenor(5).gif'];
    section.innerHTML += `<img src='./images/${imgs[RANDOM_NUM((imgs.length-1), 0)]}' alt='cool img'>`
    
    let quotes = ['You should be proud of yourself 👏',
                    'Yes✋, it is hard work that gives these amazing results 💯',
                    'Keep up and train until you are the smartest 🌟',
                    'Keep practicing until you reach good stages 🥇👌'];
  section.innerHTML += `<p class='motivational_text'>${quotes[RANDOM_NUM((quotes.length-1), 0)]}</p>
                        <button id='new_game' onclick='newGame()'>New Game</button>`

  let audioList = ['./audios/coolMusic.mp3','./audios/music.mp3','./audios/music2.mp3'];
  audio.src = audioList[RANDOM_NUM((audioList.length-1), 0)];
  audio.play();
  
  }else {
    let ul = document.createElement('ul');
    let c = 0;

    for (let x = 0; x <= mathProblems.length-1; x++) {
      if (PCSolutions[x] == userSolutions[x]) {
        ul.innerHTML += `<li class='true'><span>☑</span>${mathProblems[x]} ${userSolutions[x]}</li>`;
      }else {
        c++;
        ul.innerHTML += `<li class='false'><span>☒</span>${mathProblems[x]} ${userSolutions[x]}<span>${PCSolutions[x]}</span></li>`;
      }
    }
    section.setAttribute('class', 'errors')
    section.insertAdjacentHTML( 'afterbegin', `
                          <div class='head'>
                            <p>Great Job 👍</p>
                            <p class='score'>${(10 - c)*10}%</p>
                          </div>
                          <p class='motivational_text'>You just need some exercise</p>`);
    
    section.appendChild(ul);
    section.innerHTML += `<p class='motivational_text'>Remember that success is only achieved by those who keep trying with a positive outlook 👌</p>
                           <button id='new_game' onclick='newGame()'>New Game</button>`
    checker = true;
  }
  finalResultPosition.innerHTML = '';
  finalResultPosition.appendChild(section);
  finalResultPosition.classList.toggle('show');
}

/*-- when click new game button --*/
function newGame() {
  finalResultPosition.classList.toggle('show');
  PAUSE_PLAY_BUTTON.classList.toggle('hide');
  START_BUTTON.classList.toggle('hide');
  CHOICES_CONTAINER[0].classList.toggle('hide');
  CHOICES_CONTAINER[1].classList.toggle('hide');
  OPERATIONS.classList.toggle('show');
  PLACE_OF_QUIZE.lastElementChild.value = '';
  RESTART_BUTTON.classList.add('hide');

  mathProblems = [];
  userSolutions = [];
  PCSolutions = [];

  count = 1;
  widthOfTimer = 100;
  t = 0;

  CURRENT_NUM.textContent = count;
  widthOfTimer = 100;
  TIMER.style.background = '#3575fe';
  TIMER.style.width = widthOfTimer +'%';

  audio.defaultMuted = true;
  audio.load();
}

/*-- when click setting icon on responsive mode --*/

const OPTIONS = document.getElementById('options');
let test = true;

function showSetting() {
  if (test) {
    OPTIONS.classList.toggle('showSetting');
    clearInterval(counter);
    PLACE_OF_QUIZE.lastElementChild.blur();
    PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'none';  
    test = false
  }else {
    OPTIONS.classList.toggle('showSetting');
    if (getComputedStyle(START_BUTTON).opacity < 1){
      counter = setInterval(counterAction, 1000);
    }
    PLACE_OF_QUIZE.lastElementChild.focus();
    PLACE_OF_QUIZE.lastElementChild.style.pointerEvents = 'visible';
    test = true
  }
}
SETTING_ICON.addEventListener('click', showSetting);