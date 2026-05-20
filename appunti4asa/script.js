const btnTema = document.querySelector('#btn-tema')
const body = document.querySelector('body')

function cambiaTema() {
    body.classList.toggle('dark-mode');
}

btnTema.addEventListener('click', cambiaTema);

const bottoniCompra = document.querySelectorAll('.btn-compra');
const testoCarrello = document.querySelector('#totale-carrello');
let contatoreCarrello = 0;

function aggiungiAlCarrello() {
    contatoreCarrello = contatoreCarrello + 1; // contatoreCarrello++
    testoCarrello.textContent = contatoreCarrello;
    alert("Prodotto aggiunto");
}

bottoniCompra.forEach(function(bottone) {
    bottone.addEventListener('click', aggiungiAlCarrello);
})