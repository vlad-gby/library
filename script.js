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
const Library = {
  defaultBooks: [],
  books: [],
  display: displayLibrary
  
};

// ADD DEFAULT BOOKS
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  Library.defaultBooks.push(card);
});


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

  if(hyperlink){
    attachHyperlink(forDOM.querySelector('.hyperlink'), hyperlink);
  } else{
    forDOM.querySelector('.hyperlink').style.display = 'none';
  }

  return forDOM;
}

function addBook(){
  const inputDataResult = collectInput();
  if(inputDataResult instanceof Promise){
    inputDataResult.then((value) => {
      const inputData = value[0];
      inputData[4] = value[1];

      const forDOM = createForDOM(...inputData);
      Library.books.push(new Book(...inputData, forDOM));
      displayLibrary();
    });
  } else{
    const forDOM = createForDOM(...inputDataResult);
    Library.books.push(new Book(...inputDataResult, forDOM));
    displayLibrary();
  }
}

function displayLibrary(){
  const cards = document.querySelector('.cards');
  Library.books.forEach(book => {
    cards.appendChild(book.forDOM);
  });
}

function addBookManually(title, author, pages, status, coverFileName, hyperlink){
  const inputData = [title, author, pages, status, `img/book-covers/${coverFileName}`, hyperlink];
  
  const forDOM = createForDOM(...inputData);
  Library.books.push(new Book(...inputData, forDOM));
  displayLibrary();
}

// EXECUTION

addBookManually(
  'A Journey To The Centre Of The Earth',
  'Jules Verne',
  437,
  'finished',
  'journey.png',
  'https://books.googleusercontent.com/books/content?req=AKW5Qaefla-E5X81NGARGOYiJiZrsiMJE1ZteeEYCWBsZC3t11etwnwpy2Bkog8Y-qHvOvBTd4kmWikXF5DldJLT_KZ4_Cxw5Jvi3nPNUuL-H_lNiQqigH5XXDYC1ourBGiM9N2kn_ZQ_2q9FVDXuRgSkSZ0n_jZkQCpzjNT_rbWzeM63dd0X-Huqz6Hjo93xUFJEhFFsYRsqQFFMpgneNJqTv1PpmCJFJN86TYbaKa4Tch8sSFrj8onCWyqauUlZpEa_XPfagxGikHpzxDwsiFBNa5JjGmYzw'
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




// attachHyperlink(hyperlinks[0], 'https://books.googleusercontent.com/books/content?req=AKW5Qaefla-E5X81NGARGOYiJiZrsiMJE1ZteeEYCWBsZC3t11etwnwpy2Bkog8Y-qHvOvBTd4kmWikXF5DldJLT_KZ4_Cxw5Jvi3nPNUuL-H_lNiQqigH5XXDYC1ourBGiM9N2kn_ZQ_2q9FVDXuRgSkSZ0n_jZkQCpzjNT_rbWzeM63dd0X-Huqz6Hjo93xUFJEhFFsYRsqQFFMpgneNJqTv1PpmCJFJN86TYbaKa4Tch8sSFrj8onCWyqauUlZpEa_XPfagxGikHpzxDwsiFBNa5JjGmYzw');

// attachHyperlink(hyperlinks[1], 'https://www.arvindguptatoys.com/arvindgupta/oldmansea.pdf');

// attachHyperlink(hyperlinks[2], 'https://www.crisrieder.org/thejourney/wp-content/uploads/2021/02/Jonathan-Livingston-Seagull.pdf');
