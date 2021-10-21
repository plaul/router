import{URL} from "./settings.js"

//Observe - NO need for escaping when we are using templates this way
export function makeRows() {
  fetch(URL).then(r => r.json())
    .then(data => {
      var tbody = document.querySelector("#table-body");
      tbody.innerHTML = ""
      data.forEach((row, i) => {
        const template = document.querySelector('#rows');
        const clone = template.content.cloneNode(true);
        let tds = clone.querySelectorAll("td");
        //tds[0].textContent = row.id
        tds[0].innerHTML = `<a href='#/user/##${row.id}'>${row.id}</a>`
        tds[1].textContent = row.name
        tds[2].textContent = row.username
        tbody.appendChild(clone);
      })
    })
}