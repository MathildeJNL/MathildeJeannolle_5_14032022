//Je fais appel à l'API qui contient la liste des produits
fetch("http://localhost:3000/api/products")
  
/* 1ère promesse .then = récupérer le résultat (res) de la requête au format JSON
avec une vérif préalable que la requête s'est bien passée */
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

// 2ème promesse si la première est tenue :
  .then(function(value) {
    showProducts(value);
  })

  //Si il y a une erreur au moment d'appeler le serveur, on renvoi :
  .catch(function(err) {
    alert("Une erreur est survenue... Le serveur ne répond pas")
  });


//AFFICHAGE PRODUITS
function showProducts(value){
    for (article of value){
      /*en suivant la structure HTML, on fait appel à chaque caractéristiques produits :*/
      document.getElementById("items").innerHTML += `
      <a href="./product.html?id=${article._id}">
      <article>
      <img src = "${article.imageUrl}" alt = "${article.altTxt}">
      <h3 class = "productName">${article.name}</h3>
      <p class = "productDescription">${article.description}</p>
      </article>
      </a>
      `
    }
}


//   <a href="./product.html?id=42">
//   <article>
//     <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//     <h3 class="productName">Kanap name1</h3>
//     <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//   </article>
// </a>


/*
  .then(function(value) {
    for (let i in value){ 
      let altTexte = value[i].altTxt;
      let colors = value[i].colors;
      let descriptionArticle = value[i].description;
      let imageArticle = value[i].imageUrl;
      let nameArticle = value[i].name;
      let priceArticle = value[i].price;
      let idArticle = value[i]._id;

      console.log(value[i]);
      document.getElementById("items").innerHTML +=
       '<a>' + nameArticle + '</a>';
    }
  })*/