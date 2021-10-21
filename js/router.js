import {makeRows} from "./b.js"
import {showUser} from "./user.js"

//Your index.html must include an empty div with id= "content"
const content = document.getElementById('content');

function getPathWithoutParameterPart(){
  let pathname = window.location.hash
  if(pathname.includes("/##")){
    pathname = pathname.substring(0,pathname.indexOf("/##")+3)
  }
  return pathname;
}

//The top-level of your navigation structure must include an id="topnav"
const topnav = document.getElementById("topnav");
top.onclick = onNavClick

const loadTemplate = async (page) => {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      return console.error(`Failed to load the page: ${page}`)
    }
    return r.text()
  });
  const body = document.getElementsByTagName("BODY")[0];
  const div = document.createElement("div");
  div.innerHTML = resHtml;
  body.appendChild(div)
};

let routes;

async function initRoutes() {
  //This is how you set up your routes. Name of fields ('#/') MUST match the url given inside your topnav
 routes = {
    '#/': {
      templateFile: "templates/aTemplate.html",
      templateId: "a-template",
    },
    '#/b': {
      templateFile: "templates/bTemplate.html",
      templateId: "b-template",
      afterRender: [makeRows]
    },
    '#/c': {
      templateFile: "templates/cTemplate.html",
      templateId: "c-template",
    },
    '#/user/##': {
      templateFile: "templates/showUser.html",
      templateId: "show-user-template",
      afterRender: [showUser]
    },
    '#/404': {
      templateFile: "templates/404.html",
      templateId: "error-template"
    }
  };

  for (const field in routes) {
    const route = routes[field]
    if (!route.templateFile) {
      return console.error(`No template available for the route [${field}]`)
    }
    await loadTemplate(route.templateFile)
    const template = document.getElementById(route.templateId);
    if (template == null) {
      return console.error(`Could not find a template with the id [${route.templateId}]`)
    }
    route.template = template
  }

  //Set initial page
  let pathName = getPathWithoutParameterPart();
  setTemplate(pathName)
}

document.addEventListener("DOMContentLoaded", () => initRoutes());

function onNavClick(evt) {
  const target = evt.target;
  if (target.nodeName !== "A") { //If not an Achor-tag go away
    return
  }
  const pathname = target.getAttribute("href")

  window.history.pushState({}, pathname, window.location.origin + pathname);
  //setTemplate(pathname)
};

window.onpopstate = () => {
  const pathName = getPathWithoutParameterPart();
  setTemplate(pathName)
};

function setTemplate(path) {
  //const route = routes[pathname] ? routes[pathname] : routes["#/"] // Add a 404 template if you prefer
  let pathname = path;
  if (path == "") {
    pathname = "#/"
    window.history.pushState({}, pathname, window.location.origin + pathname);
  }
  const route = routes[pathname] || routes["#/404"] // Add a 404 template if you prefer
  const clone = route.template.content.cloneNode(true)
  content.innerHTML = ""
  content.appendChild(clone)
  if (route.afterRender) {
    route.afterRender.forEach((method) => method())
  }

  //Set the active Selection
  const links = topnav.querySelectorAll("a");
  links.forEach(child => {
    child.classList.remove("active")
    if (child.getAttribute("href") === pathname) {
      child.classList.add("active")
    }
  })

}