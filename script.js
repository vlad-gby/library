// ADD EVENT-LISTENERS TO BUTTONS
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

// ATTACHING HYPERLINKS
const hyperlinks = [];
hyperlinks.push(document.querySelector('.card:nth-child(1) .hyperlink'), document.querySelector('.card:nth-child(2) .hyperlink'), document.querySelector('.card:nth-child(3) .hyperlink'));

function attachHyperlink(element, link){
  element.addEventListener('mouseup', e => {
    window.open(link, '_blank');
  });
};

attachHyperlink(hyperlinks[0], 'https://books.googleusercontent.com/books/content?req=AKW5Qaefla-E5X81NGARGOYiJiZrsiMJE1ZteeEYCWBsZC3t11etwnwpy2Bkog8Y-qHvOvBTd4kmWikXF5DldJLT_KZ4_Cxw5Jvi3nPNUuL-H_lNiQqigH5XXDYC1ourBGiM9N2kn_ZQ_2q9FVDXuRgSkSZ0n_jZkQCpzjNT_rbWzeM63dd0X-Huqz6Hjo93xUFJEhFFsYRsqQFFMpgneNJqTv1PpmCJFJN86TYbaKa4Tch8sSFrj8onCWyqauUlZpEa_XPfagxGikHpzxDwsiFBNa5JjGmYzw');

attachHyperlink(hyperlinks[1], 'https://www.arvindguptatoys.com/arvindgupta/oldmansea.pdf');

attachHyperlink(hyperlinks[2], 'https://www.crisrieder.org/thejourney/wp-content/uploads/2021/02/Jonathan-Livingston-Seagull.pdf');

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


// CREATE THE MAIN LOGIC
const Library = [];

function Book(title, author, pages, status = 'unread', cover, hyperlink){
  return {
    title,
    author,
    pages,
    status,
    cover,
    hyperlink
  }
}
Library.push(new Book('Sumy City', 'Vladyslav Hubanov', 88, 'unread', null, null));

function addBook(){
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = !document.querySelector('#pages').value && null;
  const status = document.querySelector('.status input:checked').id;
  const hyperlink = !document.querySelector('#hyperlink').value && null;
  
  const coverFile = document.querySelector('#cover').files[0];
  const reader = new FileReader();
  if(coverFile)reader.readAsDataURL(coverFile);
  const coverURL = !reader.result && null;
  
  Library.push(new Book(title, author, pages, status, coverURL, hyperlink));
  console.log(Library[1]);
}


// const submit = document.querySelector('.submit');
const form = document.querySelector('#form');

form.addEventListener('submit', e => {
  e.preventDefault();
  closeDialog();
  addBook();
  

  // const coverFile = document.querySelector('#cover').files[0];

  // if(coverFile){
  //   const reader = new FileReader();
  //   reader.readAsDataURL(coverFile);

  //   reader.addEventListener('load', e => {
  //     console.log(reader.result)
  //   });
  // }
});


