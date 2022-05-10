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

function modifQuantity(){
    let quantityModif = document.querySelectorAll(".itemQuantity");

    //on boucle sur les input itemQuantity et on crée une fonction qui écoute le changement en ajoutant un eventlistener "change" suite à une modification des quantités :
    //i = index et quantityModif = tableau
    for (let i=0; i < quantityModif.length; i++){
        quantityModif[i].addEventListener("change", function(event){

            //on utilise la fonction preventDefault de l'objet event pour empêcher le comportement par défaut de cet élément au moment de la modification
            event.preventDefault();

            //on crée une condition pour limiter les quantités entre 1 et 100 :
            if(quantityModif[i].value >= 1 && quantityModif[i].value <= 100){

            //on select l'élément que l'on modifie :
            productInLocalStorage[i].quantity = parseInt(quantityModif[i].value);

            localStorage.setItem("product", JSON.stringify(productInLocalStorage));
            reloadTotal();

            } else {
                //on reprend la valeur du localStorage pour remettre la valeur précédente dans l'input si jamais les qtités entrées sont trop élevées ou basses
                quantityModif[i].value = productInLocalStorage[i].quantity;
                alert("Les quantités ne sont pas bonnes");
            }
        })
    }
}

//Dans le cas où l'on supprime un article :
function deleteProduct(){
    let delitems = document.getElementsByClassName("deleteItem");
    for (let i=0; i < delitems.length; i++){ //on boucle sur tous les <p> "supprimer" de la classe deleteItem
        delitems[i].addEventListener("click", function(event){ //on ajoute un eventListener au moment du clic sur le <p> supprimer

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

//Validation du formulaire avec utilisation des Regex:
let orderButton = document.getElementById("order");

orderButton.addEventListener("click", function(event){

    event.preventDefault();
    const contact = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        address : document.getElementById('address').value,
        city : document.getElementById('city').value,
        email : document.getElementById('email').value 
    }

    let flagVerif = true;

    if(! contact.firstName.match(/^([a-zA-Z Ééèàçùêâûôëï'-]+)$/)){
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
        firstNameErrorMsg.innerText = "Le prénom est invalide, vérifiez votre saisi : pas de chiffre(s)";
        //a chaque fois qu'il y a une erreur le flag passe à false
        flagVerif = false;
    } else{
        //le champs saisi est correct donc on ne met pas de message d'erreur
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
        firstNameErrorMsg.innerText = "";
    }

    if(! contact.lastName.match(/^([a-zA-Z Ééèàçùêâûôëï'-]+)$/)){
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
        lastNameErrorMsg.innerText = "Le nom est invalide, vérifiez votre saisi : pas de chiffre(s) !";
        flagVerif = false;
    } else{
        //le champs saisi est correct donc on ne met pas de message d'erreur
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
        lastNameErrorMsg.innerText = "";
    }

    if(! contact.address.match(/^([0-9]{1,5}[a-z A-Z0-9_.,éèàçùêâûôëï]+)$/)){
        let addressErrorMsg = document.getElementById('addressErrorMsg');
        addressErrorMsg.innerText = "L\'adresse est invalide";
        flagVerif = false;
    } else{
        //le champs saisi est correct donc on ne met pas de message d'erreur
        let addressErrorMsg = document.getElementById('addressErrorMsg');
        addressErrorMsg.innerText = "";
    }

    if(! contact.city.match(/^([0-9]{1,5}[a-z A-Z_.,éèàçùêâûôëï-]{1,60})$/)){
        let cityErrorMsg = document.getElementById('cityErrorMsg');
        cityErrorMsg.innerText = "La ville n\'est pas valide, pensez à inscrire le code postal";
        flagVerif = false;
    } else{
        //le champs saisi est correct donc on ne met pas de message d'erreur
        let cityErrorMsg = document.getElementById('cityErrorMsg');
        cityErrorMsg.innerText = "";
    }

    if(! contact.email.match(/^[a-zA-Z0-9-_.]+[@]{1}[a-zA-Z]+[.]{1}[a-z]{2,3}$/)){
        let emailErrorMsg = document.getElementById('emailErrorMsg');
        emailErrorMsg.innerText = "Vérifiez que votre adresse email est écrite convenablement";
        flagVerif = false;
    } else{
        //le champs saisi est correct donc on ne met pas de message d'erreur
        let emailErrorMsg = document.getElementById('emailErrorMsg');
        emailErrorMsg.innerText = "";
    }

//si aucune erreur n'a été détectée on valide la commande :
    if(flagVerif){
        //appel la fonction createPostProduct qui permet de mettre au bon format les données du local storage pour l'envoi à l'API (liste de string des id pdts)
        products = createPostProduct()
        const sendFormData = {
            contact,
            products,
        }

        //création format JSON + option de l'envoi en POST à l'API
        const options = {
            method: 'POST',
            body: JSON.stringify(sendFormData),
            headers: { 
              'Content-Type': 'application/json',
            }
        };

        //envoi à l'API selon les options
        fetch("http://localhost:3000/api/products/order", options)
        .then(function (res) {
            return res.json()
        })
        //recup des données au format JSON, redirection de la page vers la page "confirmation" + order ID que l'on a récupéré grâce à l'envoi du POST
        .then(function(data){
            document.location.href = 'confirmation.html?id='+ data.orderId;
        });

    }
});

// cette fonction permet de mettre au format attendu les différents produits pour l'envoyer a l'API (POST)
function createPostProduct(){
    data=[]
    for(product of productInLocalStorage){
        // on récupère que l'ID car l'API attend uniquement une liste de string des ID produits
        data.push(product.id)
    }
    return data
}