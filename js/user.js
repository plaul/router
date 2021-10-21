import{URL} from "./settings.js"

export function showUser() {
    
    let pathname = window.location.hash
    let param = pathname.substring(pathname.indexOf("/##")+3)
    //No error handling for illegal ids
    fetch(`${URL}/${param}`)
    .then(r=>r.json())
    .then(data=> document.getElementById("show").innerText = JSON.stringify(data))


}