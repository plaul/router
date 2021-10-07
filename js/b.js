const URL = "https://jsonplaceholder.typicode.com/users/"

export function makeRows() {
  fetch(URL).then(r => r.json())
    .then(data => {
      var tbody = document.querySelector("#table-body");
      tbody.innerHTML = ""
      data.forEach((row, i) => {
        const template = document.querySelector('#rows');
        const clone = template.content.cloneNode(true);
        let tds = clone.querySelectorAll("td");
        tds[0].textContent = row.id
        tds[1].textContent = row.name
        tds[2].textContent = row.username
        tbody.appendChild(clone);
      })
    })
}