// ADD EVENT-LISTENERS FOR UI
const UImodule = (function(){

  // BUILDING FUNCTIONS
  function changeColor(element, amount){
    const color = getComputedStyle(element).backgroundColor;
    const rawColor = color.slice(4, -1).split(', ');
    return `rgb(${rawColor.map(num => Number(num) + amount)})`;
  }

  function showDialog(bool){
    const dialog = document.querySelector('.big-form');
    const overlay = document.querySelector('.overlay');
    if(bool){
      dialog.style.transform = 'translate(-50%, -50%)';
      overlay.classList.remove('hidden');
    } else if(!bool){
      dialog.style.transform = 'translate(120%, -50%)';
      overlay.classList.add('hidden');
    }
  }
  
  const btnHoverHandler = (button, isHover) => {
    if(isHover){
      button.style.backgroundColor = changeColor(button, -20);
    } else if(!isHover){
      button.style.backgroundColor = changeColor(button, 20);
    }
  }

  // BUTTON HOVERS
  const allButtons = document.querySelectorAll('button, .submit');
  allButtons.forEach(button => {
    button.addEventListener('mouseover', (e) => {
      btnHoverHandler(e.target, true);
    });
    button.addEventListener('mouseout', (e) => {
      btnHoverHandler(e.target, false);
    });
    button.addEventListener('mousedown', (e) => {
      btnHoverHandler(e.target, true);
    });
    button.addEventListener('mouseup', (e) => {
      btnHoverHandler(e.target, false);
    });
  });

  // DIALOG LISTENERS
  const newBook = document.querySelector('.new-book');
  newBook.addEventListener('mouseup', e => {
    showDialog(true);
  });

  const cancel = document.querySelector('.cancel');
  cancel.addEventListener('mouseup', e => {
    showDialog(false);
  });

  return {
    showDialog,
    changeColor,
    btnHoverHandler
  }

})();


// CREATE THE LIBRARY
let Library = [];

const template = document.querySelector('.card-template');

class Book {
  constructor(title, author, pages, status, cover, hyperlink, forDOM) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.status = status,
    this.cover = cover,
    this.hyperlink = hyperlink,
    this.forDOM = forDOM;
  }

}

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
  const pages = pagesInp ? pagesInp : null;
  const hyperlinkInp = document.querySelector('#hyperlink').value;
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
  const forDOM = document.querySelector('.card-template').cloneNode(true);
  forDOM.classList.remove('card-template');

  forDOM.querySelector('.card-title').textContent = title;
  forDOM.querySelector('.card-author').textContent = author;

  if(pages){
    forDOM.querySelector('.card-pages').textContent = pages;
  } else{
    forDOM.querySelector('.card-pages').textContent = 'was not defined';

  }
  
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
    button.addEventListener('mouseover', e => (e) => {
      UImodule.btnHoverHandler(e.target, true);
    });
    button.addEventListener('mouseout', e => (e) => {
      UImodule.btnHoverHandler(e.target, false);
    });
    button.addEventListener('mousedown', e => (e) => {
      UImodule.btnHoverHandler(e.target, true);
    });
    button.addEventListener('mouseup', e => (e) => {
      UImodule.btnHoverHandler(e.target, false);
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
  cards.appendChild(template);
  Library.forEach((book) => {
    cards.appendChild(book.forDOM);
  });
}

function addBookManually(title, author, pages, status, coverFileName, hyperlink){
  const inputData = [title, author, pages, status, `img/book-covers/${coverFileName}`, hyperlink];
  
  const forDOM = createForDOM(...inputData);
  Library.push(new Book(...inputData, forDOM));
  displayLibrary();
}

const form = document.querySelector('#form');
form.addEventListener('submit', e => {
  e.preventDefault();
  UImodule.showDialog(false);
  addBook();
  form.reset();
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
  Library.forEach((book) => {
    if(book.forDOM === thisCard){
      Library.splice(Library.indexOf(book), 1);
      return;
    }
  });
    
  displayLibrary();
}

// STATUS STATE UPDATE
function checkThis(){
  const thisCard = this.parentNode.parentNode.parentNode;
  const state = this.classList[0];
  Library.forEach((book) => {
    if(book.forDOM === thisCard){
      book.status = state;
      return;
    }
  });
}


// SORT FEATURE
const byTitle = document.querySelector('#by-title');
const byAuthor = document.querySelector('#by-author');
const byPages = document.querySelector('#by-pages');

byTitle.addEventListener('mouseup', sortByTitle);
byAuthor.addEventListener('mouseup', sortByAuthor);
byPages.addEventListener('mouseup', sortByPages);
function sortByTitle(){
  sort.by('title', this);
}
function sortByAuthor(){
  sort.by('author', this);
}
function sortByPages(){
  sort.by('pages', this);
}

const sort = {
  isUp: true,

  getParam: function(){
    const titles = [];
    const authors = [];
    const pages = [];
    Library.forEach(book => {
      titles.push(book.title);
      authors.push(book.author);
      pages.push(book.pages);
    });
    return {
      title: titles,
      author: authors, 
      pages}
  },

  by: function(param, thisBtn){
    const paramList = this.getParam()[param];
    const newLibrary = [];

    if(sort.isUp){
      sort.isUp = false;
      paramList.sort();
      if(typeof paramList[0] === 'number') paramList.sort((a,b) => a - b);
      sortClass('sort-up', thisBtn);
    } else{
      sort.isUp = true;
      paramList.sort().reverse();
      if(typeof paramList[0] === 'number') paramList.sort((a,b) => b - a);
      sortClass('sort-down', thisBtn);
    }

    paramList.forEach(value => {
      Library.forEach(book => {
        if(book[param] === value){
          newLibrary.push(book);
        }
      });
    });
    Library = newLibrary;
    displayLibrary();
  }
}

function sortClass(order, btn){
  const sortBtns = document.querySelectorAll('.sort button');
  if(order === 'sort-up'){
    sortBtns.forEach(btn => {
      btn.classList.remove('sort-up');
      btn.classList.remove('sort-down');
    });
    btn.classList.add('sort-up');
  } if(order === 'sort-down'){
    sortBtns.forEach(btn => {
      btn.classList.remove('sort-up');
      btn.classList.remove('sort-down');
    });
    btn.classList.add('sort-down');
  }
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

