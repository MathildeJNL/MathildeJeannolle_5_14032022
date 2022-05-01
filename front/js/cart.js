//On souhaite afficher les produits du panier :
let productInLocalStorage = JSON.parse(localStorage.getItem('product'));
console.log(productInLocalStorage);

//on crée une première condition si le panier est vide :
if (productInLocalStorage === null || productInLocalStorage === 0) {
    alert("votre panier est vide !");
}

//Je fais appel à l'API qui contient la liste des produits
fetch("http://localhost:3000/api/products")

    /* 1ère promesse .then = récupérer le résultat (res) de la requête au format JSON
    avec une vérif préalable que la requête s'est bien passée */
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })

    // 2ème promesse si la première est tenue :
    .then(function (value) {
        showProducts(value);
        modifQuantity();
        deleteProduct();
    })

    //Si il y a une erreur au moment d'appeler le serveur, on renvoi :
    .catch(function (err) {
        alert("Une erreur est survenue... Le serveur ne répond pas")
    });

//AFFICHAGE PRODUITS
//il faut boucler : pour comparer le panier et les données de l'API (2boucles = 1 dans 1)

function showProducts(value) {

    //on veut stocker la somme totale des quantités des pdts du local Storage
    //par défaut elle est à 0
    let totalQuantityInCart = 0;
    let totalPriceInCart = 0;

    
    //on boucle sur les pdts du local storage en 1er lieu
    for (let product of productInLocalStorage){     

        //on boucle sur les articles de l'API en 2nd lieu
        for (article of value) {

            //on conditionne si les id sont identiques : produit = article car ils ont le même id
            if(product.id === article._id){

                //on ajoute à totalQuantity la valeur en qtité de product, cela permet de ne pas effacer la valeur existante
                totalQuantityInCart += product.quantity;
                totalPriceInCart += parseInt(article.price) * parseInt(product.quantity);

                //en suivant la structure HTML, on fait appel à chaque caractéristiques produits :
                document.getElementById("cart__items").innerHTML += `
                <article class="cart__item" data-id=${article._id} data-color=${product.colors}>

                <div class="cart__item__img">
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                </div>

                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${article.name}</h2>
                        <p>${product.colors}</p>
                        <p>${article.price}</p>
                    </div>

                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>

                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
                </article>
                `
            }
        }
    }

    //On souhaite afficher le total d'articles dans le panier ainsi que le prix total :
    document.getElementById("totalQuantity").innerHTML = `
    ${totalQuantityInCart}
    `
    document.getElementById("totalPrice").innerHTML = `
    ${totalPriceInCart}
    `
}

//Dans le cas où l'on modifie le panier :
//fonction permettant la MAJ du total qtité et du prix après modif

function reloadTotal(){
    let allCartItem = document.querySelectorAll(".cart__item");
    let totalQuantityInCart = 0; //on initialise à zéro
    let totalPriceInCart = 0;

    //on boucle toutes les cartes
    for (let cart of allCartItem){
        let description_node = cart.getElementsByClassName("cart__item__content__description")[0]; //on sélectionne un noeud dans la carte

        let quantity = cart.getElementsByClassName("itemQuantity")[0].value; //on recupère la qtité de la carte
        let price = description_node.children[2].innerHTML; //on récupère le prix qui est situé dans le noeud enfant de description_node à l'index 2 ([h2, p, p])

        quantity = parseInt(quantity);
        price = parseInt(price);

        totalQuantityInCart += quantity;
        totalPriceInCart += price * quantity;

    }

    //On souhaite afficher le total d'articles dans le panier ainsi que le prix total :
    document.getElementById("totalQuantity").innerHTML = `
    ${totalQuantityInCart}
    `
    document.getElementById("totalPrice").innerHTML = `
    ${totalPriceInCart}
    `
}

//Dans le cas a=où l'on supprime un article :
function deleteProduct(){
    let delitems = document.getElementsByClassName("deleteItem");
    for (let i=0; i < delitems.length; i++){ //on boucle sur tous les <p> "supprimer" de la classe deleteItem
        delitems[i].addEventListener("click", function(event){ //on ajoute un eventListener au momemnt du clic sur le <p> supprimer

            //on utilise la fonction preventDefault de l'objet event pour empêcher le comportement par défaut de cet élément au moment de la modification
            event.preventDefault();

            //on crée un nouveau tableau 
            let newLocalStorage = [];
            //on boucle sur l'index "j" des prdts dans le localStorage
            for(let j in productInLocalStorage){
                //on conditionnne : si l'index (j) est différent de l'index (i) on l'ajoute au newlocalStorage
                if(j != i){
                    newLocalStorage.push(productInLocalStorage[j]);
                }
            }
            //on réassigne la valeur
            productInLocalStorage = newLocalStorage;
            
            //on modifie le localStorage avec l'article supprimé
            localStorage.setItem("product", JSON.stringify(productInLocalStorage));
            alert("Votre article a été supprimé !");

            //on recharge la page pour éviter les erreurs d'index dans les EventListener
            window.location.reload();
        })
    }
}

function modifQuantity(){
    let quantityModif = document.querySelectorAll(".itemQuantity");

    //on boucle sur les input itemQuantity et on crée une fonction qui écoute le changement en ajoutant un eventlistener "change" suite à une modification des quantités :
    //i = index et quantityModif = tableau
    for (let i=0; i < quantityModif.length; i++){
        quantityModif[i].addEventListener("change", function(event){

            //on utilise la fonction preventDefault de l'objet event pour empêcher le comportement par défaut de cet élément au moment de la modification
            event.preventDefault();

            //on select l'élément que l'on modifie :
            productInLocalStorage[i].quantity = parseInt(quantityModif[i].value);

            localStorage.setItem("product", JSON.stringify(productInLocalStorage));
            reloadTotal();
        })
    }
}
