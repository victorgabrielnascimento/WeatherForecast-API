//Controle do button da tela

let chk = document.getElementById("chk");
chk.addEventListener( "change", () => {
   if ( chk.checked ) {
    document.querySelectorAll('.temperaturaMin').forEach(function(e) {
      e.querySelectorAll('img')[0].style.display = 'none';
      e.querySelectorAll('img')[1].style.display = 'block';
      // document.body.classList.toggle('dark');
    });
   } else {
    document.querySelectorAll('.temperaturaMin').forEach(function(e) {
      e.querySelectorAll('img')[0].style.display = 'block';
      e.querySelectorAll('img')[1].style.display = 'none';
      // document.body.classList.remove('dark');
    });
   }
   document.body.classList.toggle('dark');
});

// comandos destacados quaso o toggle de erro.