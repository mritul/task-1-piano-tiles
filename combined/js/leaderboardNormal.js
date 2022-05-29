const arrayFromLocalStorage = JSON.parse(
  window.localStorage.getItem("dataArrayNormal")
);

//Sorting based on score from objects
arrayFromLocalStorage.sort((a, b) => {
  return b.score - a.score;
});

console.log(arrayFromLocalStorage);

//Getting tablebody to append all the user objects from local storage array
const tableBody = document.querySelector("table tbody");

//Appending each user object data from the array
arrayFromLocalStorage.forEach((object) => {
  const tr = document.createElement("tr");
  const tduser = document.createElement("td");
  const usernameText = document.createTextNode(object.name);
  tduser.appendChild(usernameText);
  tr.appendChild(tduser);
  const tdscore = document.createElement("td");
  const scoreText = document.createTextNode(object.score);
  tdscore.appendChild(scoreText);
  tr.appendChild(tdscore);
  tableBody.appendChild(tr);
});
