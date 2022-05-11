//je crée une nouvelle url à partir de l'url actuelle en ajoutant searchParams pour manipuler les paramètres de requête d'URL :
let params = (new URL(document.location)).searchParams;

//je récupère l'ID de l'URL :
let id = params.get('id');

//------APPEL DE L'API AVEC L'ID DU CANAPE SELECTIONNE :--------

/* Création des variables nécessaire pour manipuler le DOM :*/
const image = document.getElementsByClassName('item__img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.getElementById('colors');

//Je fais appel à l'API qui contient le produit grâce à l'ID :
fetch("http://localhost:3000/api/products/" + id)

  /* 1ère promesse .then = récupérer le résultat (res) de la requête au format JSON
  avec une vérif préalable que la requête s'est bien passée */
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  // 2ème promesse si la première est tenue :
  .then(function (value) {

    //--------AFFICHER LES IMAGES---------

    //createElement me crée comme une balise HTML "img"
    let imageElement = document.createElement("img");

    //on ajoute des attributs à l'élément (la balise html donc)
    imageElement.setAttribute("src", value.imageUrl);
    imageElement.setAttribute("alt", value.altTxt);
    image[0].appendChild(imageElement);

    //on ajoute le titre, le prix et la description dans les éléments HTML correspondant
    title.textContent = value.name;
    price.textContent = value.price;
    description.textContent = value.description;


    //------COULEURS-----

    //on boucle les couleurs
    for (color of value.colors) {
      let colorsElement = createOption(color); //fonction crée en l.65
      colors.appendChild(colorsElement);
    }

  })

  //Si il y a une erreur au moment d'appeler le serveur, on renvoi :
  .catch(function (err) {
    alert("Une erreur est survenue... Le serveur ne répond pas")
  });


//------CREATION FONCTION POUR LES COULEURS-------

//on créé une fonction qui permet d'ajouter un élément -> <option> :
function createOption(colors) {

  //1 : créer élément
  //2 : attribut un attribut et sa valeur
  //3 : on met la valeur dans l'élément (HTML)
  let colorsElement = document.createElement("option");
  colorsElement.setAttribute("value", colors);
  colorsElement.innerHTML = colors;

  //on veut retourner l'élément <option> complété avec la couleur en paramètre
  return colorsElement;
}

//------Evénement CLIC-------

//on créé des constantes 
const selectQuantity = document.getElementById('quantity');
const selectColors = document.getElementById('colors');

//on récupère l'élément sur lequel on veut détecter le clic :
const addToCart = document.getElementById("addToCart");

//On écoute l'événement click de l'element addToCart :
addToCart.addEventListener('click', function (event) {

  //on utilise la fonction preventDefault de l'objet event pour empêcher le comportement par défaut de cet élément au clic de la souris
  event.preventDefault();

  //Ajouter les données du pdt :
  const dataLocalStorage = {
    "quantity": parseInt(selectQuantity.value),
    "colors": selectColors.value,
    "id": id
  };

  //on créé une condition pour savoir si il existe un panier :
  let panier;

  if (localStorage.getItem("product") === null) {
    console.log("pas de panier");
    panier = [];

  } else {
    console.log("panier existant");
    panier = JSON.parse(localStorage.getItem("product"));
  }

  //boolean permet savoir si MAJ qtité ou ajout :
  let miseAJour = false; //drapeau-flag
  let addProduct = true;
  
  //On va créer une alerte contenant une condition qui indique qu'un choix de couleur doit se faire
  if (!selectColors.value) {
    alert("Veuillez sélectionner une couleur");

  //On créer une condition pour vérifier les quantités avant l'ajout au panier
  } else if (dataLocalStorage.quantity < 1 || dataLocalStorage.quantity >= 100 || !dataLocalStorage.quantity){
    alert("Vérifiez vos quantités !");

  } else {

    //on créé une boucle pour vérifier la présence ou non d'un même produit :
    for (let product of panier) {

      if (dataLocalStorage.colors === product.colors && dataLocalStorage.id === product.id) {

      //condition, si la quantité du panier + pdt ajouté est inf ou égal à 100, on ajoute
      if(product.quantity + dataLocalStorage.quantity <=100){
        
        miseAJour = true;

          product.quantity = product.quantity + dataLocalStorage.quantity;

          alert("Panier mis à jour !")

      //sinon si le produit ajouté + le pdt du panier (pdt identique) ont une qtité suppérieure, on n'ajoute pas au panier et donc on ne met pas à jour
      } else {
        addProduct = false;

        alert("Les quantités sont supérieures à celles autorisées");
      }
      }
    }

    //si ce n'est pas une MAJ alors on AJOUTE au panier, sinon c'est une MAJ
    if (!miseAJour && addProduct) {

      //ajouter au panier
      panier.push(dataLocalStorage);

      //On créé une alerte pour informer de l'ajout au panier :
      alert("Article ajouté au panier avec succès !");
    }

    //on met le panier (avec le nouveau produit) dans le local storage + convertir le JSON en chaine de caractères :
    localStorage.setItem('product', JSON.stringify(panier));
  }
});