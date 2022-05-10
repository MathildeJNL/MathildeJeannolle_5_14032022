//on récupère l'ID de l'URL
function checkout(){
    let params = (new URL(document.location)).searchParams; //recup paramètres de l'URL
    let id = params.get('id'); //on recup le paramètre ID

    //on met l'ID dans "orderId"
    const orderId = document.getElementById('orderId');
    orderId.innerHTML = id;

    //on supprime le local storage car on ne doit pas conserver le n°
    localStorage.clear();
}

checkout();