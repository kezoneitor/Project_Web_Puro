const slider = document.querySelector('.grafico-estadistico');
let isDown = false;
let startX;
let scrollLeft;

//Cuando se cliquea sobre el grafico estadistico
slider.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
//Cuando se saca el mouse del grafico
slider.addEventListener('mouseleave', () => {
  isDown = false;
});
//Cuando se libera el click
slider.addEventListener('mouseup', () => {
  isDown = false;
});


slider.addEventListener('mousemove', (e) => {
  //Solo se muev si el click está pulsado
  if(!isDown) return;
  e.preventDefault();
  //Se calcula la posición del mouse con respecto al grafico y la primera posición del mouse al hacer click
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; 
  //Se establece el valor del slider
  slider.scrollLeft = scrollLeft - walk;
});