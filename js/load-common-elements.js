// Cargar el head común
fetch('../html/head.html')
    .then(response => response.text())
    .then(data => {
        document.head.innerHTML += data;
    });

// Cargar la barra de navegación común
fetch('../html/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML = data + document.body.innerHTML;
    });

// Cargar el footer común
fetch('../html/footer.html')
    .then(response => response.text())
    .then(data => {
        document.body.innerHTML += data;
    });
