// ADD EVENT-LISTENERS TO BUTTONS
const allButtons = document.querySelectorAll('button');

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


