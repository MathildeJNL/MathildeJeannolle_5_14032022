function checkout(){
    const orderId = document.getElementById('orderId');
    let params = (new URL(document.location)).searchParams;
    //je récupère l'ID de l'URL :
    let id = params.get('id');
    orderId.innerHTML = id;
    localStorage.clear();
}
checkout();

// function send(e) {
//     e.preventDefault();
//     fetch("http://localhost:3000/api/products", {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json', 
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({value: document.getElementById("value").value})
//     })
//     .then(function(res) {
//       if (res.ok) {
//         return res.json();
//       }
//     })
//     .then(function(value) {
//         document
//           .getElementById("orderId")
//           .innerText = value.postData.text;
//     });
//   }

// document.getElementsByClassName("confirmation").addEventListener("click", send);