// ADD EVENT-LISTENERS FOR UI

const allButtons = document.querySelectorAll('button, .submit');

allButtons.forEach(button => {

  button.addEventListener('mouseover', e => {
    button.style.backgroundColor = changeColor(button, -20);
  });
  button.addEventListener('mouseout', e => {
    button.style.backgroundColor = changeColor(button, 20);
  });
  button.addEventListener('mousedown', e => {
    button.style.backgroundColor = changeColor(button, -20);
  });
  button.addEventListener('mouseup', e => {
    button.style.backgroundColor = changeColor(button, 20);
  });
});

function changeColor(element, amount){
  const color = getComputedStyle(element).backgroundColor;
  const rawColor = color.slice(4, -1).split(', ');
  return `rgb(${rawColor.map(num => Number(num) + amount)})`;
}

const statusBtns = document.querySelectorAll('.status img:not(.selected)');

statusBtns.forEach(button => {
  button.addEventListener('mouseover', e => {
    button.style.backgroundColor = 'rgb(130, 109, 83)';
  });
  button.addEventListener('mouseout', e => {
    button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  });
  button.addEventListener('mouseup', e => {

    button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  });
});




// INVOKING AND CLOSIG THE DIALOG
const newBook = document.querySelector('.new-book');
const cancel = document.querySelector('.cancel');
const dialog = document.querySelector('.big-form');

const overlay = document.querySelector('.overlay');

function closeDialog(){
  dialog.style.transform = 'translate(100%, -50%)';
  overlay.classList.add('hidden');
  
}

cancel.addEventListener('mouseup', e => {
  closeDialog();
});

newBook.addEventListener('mouseup', e => {
  dialog.style.transform = 'translate(-50%, -50%)';
  overlay.classList.remove('hidden');
});


// CREATE THE LIBRARY
const Library = [];

// ADD A TEMPLATE
const template = document.querySelector('.card-template');
Library.push(template);

// BOOK CONSTRUCTOR
function Book(title, author, pages, status, cover, hyperlink, forDOM){
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.status = status,
  this.cover = cover,
  this.hyperlink = hyperlink,
  this.forDOM = forDOM
}

// ATTACHING HYPERLINKS
function attachHyperlink(element, link){
  element.addEventListener('mouseup', e => {
    window.open(link, '_blank');
  });
};

function collectInput(){
  const dataArr = [];

  // COLLECT EASY ONES
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const status = document.querySelector('.status input:checked').id;
  
  // OPTIONAL ONES
  const pagesInp = document.querySelector('#pages').value;
  const hyperlinkInp = document.querySelector('#hyperlink').value;
  const pages = pagesInp ? pagesInp : null;
  const hyperlink = hyperlinkInp ? hyperlinkInp : null;
  
  // VALID AND COLLECT IMG DATA URL
  const coverFile = document.querySelector('#cover').files[0];
  const reader = new FileReader();

  if(coverFile){
    return new Promise((resolve) => {
      dataArr.push(title, author, pages, status, null, hyperlink);
      reader.readAsDataURL(coverFile);

      reader.addEventListener('load', e => {
        resolve([dataArr, reader.result]);
      });
    });
  }else{
    dataArr.push(title, author, pages, status, null, hyperlink);
    return dataArr;
  }
}

// CREATE NEW .CARD
function createForDOM(title, author, pages, status, cover, hyperlink){
  const forDOM = document.querySelector('.card').cloneNode(true);
  forDOM.classList.remove('card-template');

  forDOM.querySelector('.card-title').textContent = title;
  forDOM.querySelector('.card-author').textContent = author;
  forDOM.querySelector('.card-pages').textContent = pages;

  if(cover !== null){
    forDOM.querySelector('img').src = cover;
  }

  switch (status){
    case 'started':
      forDOM.querySelector('.card-status [checked]').removeAttribute('checked');
      forDOM.querySelector('.card-status .started').setAttribute('checked', 'true');
    break;
    case 'finished':
      forDOM.querySelector('.card-status [checked]').removeAttribute('checked');
      forDOM.querySelector('.card-status .finished').setAttribute('checked', 'true');
    break;
  }

  // ACTIVATE MY CONTROLS AND BOOK STATUS
  if(hyperlink){
    attachHyperlink(forDOM.querySelector('.hyperlink'), hyperlink);
  } else{
    forDOM.querySelector('.hyperlink').style.display = 'none';
  }
  forDOM.querySelector('.remove').addEventListener('click', isConsent, true);
  forDOM.querySelector('.consent').addEventListener('click', removeCard);

  forDOM.querySelectorAll('.card-status input').forEach(option => {
    option.addEventListener('mouseup', checkThis);
  });


  forDOM.querySelectorAll('.hyperlink, .remove').forEach(button => {
    button.addEventListener('mouseover', e => {
      button.style.backgroundColor = changeColor(button, -20);
    });
    button.addEventListener('mouseout', e => {
      button.style.backgroundColor = changeColor(button, 20);
    });
    button.addEventListener('mousedown', e => {
      button.style.backgroundColor = changeColor(button, -20);
    });
    button.addEventListener('mouseup', e => {
      button.style.backgroundColor = changeColor(button, 20);
    });
  });

  return forDOM;
}

function addBook(){
  const inputDataResult = collectInput();
  if(inputDataResult instanceof Promise){
    inputDataResult.then((value) => {
      const inputData = value[0];
      inputData[4] = value[1];

      const forDOM = createForDOM(...inputData);
      Library.push(new Book(...inputData, forDOM));
      displayLibrary();
    });
  } else{
    const forDOM = createForDOM(...inputDataResult);
    Library.push(new Book(...inputDataResult, forDOM));
    displayLibrary();
  }
}

function displayLibrary(){
  const cards = document.querySelector('.cards');
  cards.innerHTML = '';
  for(let i = 1; i < Library.length; i++){
    cards.appendChild(Library[i].forDOM);
  }
}

function addBookManually(title, author, pages, status, coverFileName, hyperlink){
  const inputData = [title, author, pages, status, `img/book-covers/${coverFileName}`, hyperlink];
  
  const forDOM = createForDOM(...inputData);
  Library.push(new Book(...inputData, forDOM));
  displayLibrary();
}

// EXECUTION

addBookManually(
  'A Journey To The Centre Of The Earth',
  'Jules Verne',
  437,
  'finished',
  'journey.png',
  'https://books.google.gr/books/about/A_Journey_Into_the_Interior_of_the_Earth.html?id=--ro1ELSrAEC&printsec=frontcover&source=kp_read_button&hl=en&redir_esc=y#v=onepage&q&f=false'
);
addBookManually(
  'The Old Man And The Sea',
  'Ernest Hemingway',
  68,
  'finished',
  'old-man.png',
  'https://www.arvindguptatoys.com/arvindgupta/oldmansea.pdf'
);
addBookManually(
  'Jonathan Livingston Seagull',
  'Richard Bach',
  144,
  'finished',
  'seagull.png',
  'https://www.crisrieder.org/thejourney/wp-content/uploads/2021/02/Jonathan-Livingston-Seagull.pdf'
);

const form = document.querySelector('#form');
form.addEventListener('submit', e => {
  e.preventDefault();
  closeDialog();
  addBook();
});


// REMOVE BUTTON
function isConsent(){
  const consentBtn = this.nextSibling.nextSibling;
  const binBtn = this;
  consentBtn.style.display = 'block';
  binBtn.style.display = 'none';

  function back(){
    consentBtn.style.display = 'none';
    binBtn.style.display = 'block';
    window.removeEventListener('click', back);
  }
  window.addEventListener('mouseup', back);
}
function removeCard(){
  const thisCard = this.parentNode.parentNode.parentNode;
  for(let i = 1; i < Library.length; i++){
    if(Library[i].forDOM === thisCard){
      Library.splice(i, 1);
      break;
    }
  }
  displayLibrary();
  console.log(Library);
}

// STATUS STATE UPDATE
function checkThis(){
  const thisCard = this.parentNode.parentNode.parentNode;
  const state = this.classList[0];
  for(let i = 1; i < Library.length; i++){
    if(Library[i].forDOM === thisCard){
      Library[i].status = state;
      break;
    }
  }
}


