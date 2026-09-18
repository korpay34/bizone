document.querySelectorAll('.product-selector').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#connection').scrollIntoView({ behavior: 'smooth' });
  });
});

const topButton = document.getElementById('top-button');
if (topButton) {
  topButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
}
