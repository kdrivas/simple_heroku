// handleForm = (e) => {
//   e.preventDefault();
//   const host = 'http://localhost:3000/signup';

//   let myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//   let urlencoded = new URLSearchParams();
//   let username = document.getElementById("username").value
//   let password = document.getElementById("password").value
//   urlencoded.append("username", username);
//   urlencoded.append("password", password);
  
//   if (username != '' && password != '') { 
//     fetch(host, {
//           method: 'POST',
//           body: urlencoded,
//           headers: myHeaders
//           }).then((response) => {
//               // console.log(response);
//               return response.text();
//           }).then((info) => {
//               const json = JSON.parse(info)
//               if (json['message'] == 'ok')
//                 window.location.replace("/messages.html"); 
//               else
//                 window.location.replace("/error_signup.html"); 
//             }).catch((error) => {
//               console.error(error);
//       })
//   } else {
//     alert('Datos faltantes')
//   }
// };

// let registerForm = document.getElementById("form");
// registerForm.addEventListener('submit', handleForm);
