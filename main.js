// this imports the translation JSON file so we can treat it later on
import data from './assets/languages/lang.JSON' assert { type: 'json'};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

window.onload = () => {
    //Select all elements for manipulation
    let listHeadings = document.querySelectorAll(".skills-headings"),
        button = document.querySelector(".skills__collapse-button"),
        skillTree = document.querySelector(".skill-folder-tree"),
        skillContainer = document.querySelector(".about-container__skills"),
        skillsLink = document.querySelector(".skillsLink"),
        aboutLink = document.querySelector(".aboutLink"),
        xplodeWords = document.querySelectorAll(".xplode"),
        language = document.querySelector(".lang-options"),
        mobLanguage = document.querySelector(".lang-selector"),
        submitButton = document.getElementById("submitButton");

    // add event listeners to each heading
    listHeadings.forEach(heading => {
        heading.dataset.closed = 0;
        heading.addEventListener("click", openCloseChildren);
    });

    // add event listener for open close folder section
    button.addEventListener("click", () => {
        collapseExpandSkills(button, skillTree, skillContainer)
    });

    window.addEventListener("resize", () => {
        domResizeEvents(button, skillTree, skillContainer);
    });

    skillsLink.addEventListener("click", () => {
        openSkillTree(button, skillTree, skillContainer);
    });

    aboutLink.addEventListener("click", () => {
        let screenWidth = window.innerWidth;

        if(screenWidth <= 600){
            closeSkillTree(button, skillTree, skillContainer)
        } 
    });

    xplodeText(xplodeWords);

    language.addEventListener("click", () => {
        languageChange(event, xplodeWords);
    });
    
    // submitButton.addEventListener("click", contactProcessor);
}

// opens and close folder/headings in skill tree
function openCloseChildren(event) {
    
    event.stopImmediatePropagation();

    if(event.target.classList.value !== 'skills-headings'){
        return;
    }

    let children = event.target.childNodes.item(2);
    let folder = event.target.childNodes.item(0);

    // testing making children collapse
    let subList = Array.from(children.childNodes);

    if(event.target.dataset.closed === "0"){
        folder.src = "./assets/img/folder.png"
        event.target.dataset.closed = 1;
    } else {
        folder.src = "./assets/img/folder-open.png"
        event.target.dataset.closed = 0;
    } 

    openCloseList(subList);
}

// timing function for staggered removal of elements
async function openCloseList(listOfItems){
    for(let i = listOfItems.length; i >= 0; i--){
        if(listOfItems[i] instanceof Element){
            listOfItems[i].classList.toggle("hide-me");
        }
        await sleep(20);
    }
}

// expand or collapse skills section depending on button click
function collapseExpandSkills(button, skillTree, skillContainer){
    if(button.classList.contains("skills__collapse-button")){
        closeSkillTree(button, skillTree, skillContainer);
         button.dataset.buttonactivated = 1;
    } else {
        openSkillTree(button, skillTree, skillContainer);
        button.dataset.buttonactivated = 0;
    }
}

// expand or collapse skills section depending on screen width
function domResizeEvents(button, skillTree, skillContainer){
    let screenWidth = window.innerWidth;    
    if(screenWidth <= 600){
        closeSkillTree(button, skillTree, skillContainer);
    }

    if(screenWidth > 600 && button.dataset.buttonactivated == 0){
        openSkillTree(button, skillTree, skillContainer);
    }

}

function openSkillTree(button, skillTree, skillContainer){
    removeAddClass(button, "skills_expand-button", "skills__collapse-button");
    button.dataset.closed = 0;
    removeAddClass(skillTree, "hide-me", "skill-folder-tree");
    removeAddClass(skillContainer, "about-container__skills--colapsed", "about-container__skills");
}

function closeSkillTree(button, skillTree, skillContainer){
    removeAddClass(button, "skills__collapse-button", "skills_expand-button");
    button.dataset.closed = 1;
    removeAddClass(skillTree, "skill-folder-tree", "hide-me");
    removeAddClass(skillContainer, "about-container__skills", "about-container__skills--colapsed");
}

function removeAddClass(node, remove, add){
    node.classList.remove(remove);
    node.classList.add(add);
}

// to break apart each link on hero by letter
function hyperplexed(node){
    let text = node.innerText.split("");
    
    node.innerText = "";

    text.forEach(letter => {
        let span = document.createElement("span");

        span.className = "letter";

        span.innerText = letter;

        node.appendChild(span);
    })
}

//loops over spans to process xplode function on them...prob not necessary
function xplodeText(xplode){
    xplode.forEach(word => {
        hyperplexed(word);
    });
}

// Fetch request to send emails to "formsubmit.co"
// Object must contain 3 props: name, email, message
async function submitContactForm(emailObject){

    if(Object.keys(emailObject).length<3){
        return console.error("Fields incomplete unable to process Fetch request");
    }

    fetch("https://formsubmit.co/ajax/contact@mitchellhenwood.com", { 
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        name: emailObject.name,
        email: emailObject.email,
        message: emailObject.message
        
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

// get form data
function contactProcessor(event){
    // event.preventDefault;

    let contactName = document.getElementById("qsdenamepofd"),
        contactEmail = document.getElementById("iedfemailopv"),
        contactMessage = document.getElementById("nqsfmmessagepods"),
        checkPots1 = document.getElementById("name"),
        checkPots2 = document.getElementById("email"),
        container = document.getElementById("contact-container"),
        form = document.getElementById("contact-form");

    if(checkPots1 != null || checkPots2 != null){
        afterContactSent(container, form);
        return
    }

    let contactObject = {
        name: contactName,
        email: contactEmail,
        message: contactMessage
    };

    // ===========================================================
    // I AM HERE TRYING TO FIGURE OUT HOW TO DO ERROR HANDLING FOR THE CONTACT FORM
    // ===========================================================
    try {
        submitContactForm(contactObject);
    } catch (error) {
        console.log(`there was error: ${error}`);
        errorMessage();
    }

    afterContactSent(container, form);
}

// return form to empty state
function afterContactSent(container, form){
    let currentLanguage = document.getElementById("lang-btn-select").dataset.lang;

    container.removeChild(form);

    let p = document.createElement("p");

    p.className = "contact-sent";

    if(currentLanguage == "English"){
        p.innerText = data.en["idContSent"];
    }

    if(currentLanguage == "Français"){
        p.innerText = data.fr["idContSent"];
    }

    container.appendChild(p);
}

// Handles putting an error message above contact form
function errorMessage(){
    let errorPlacement = document.getElementById("error-message"),
        currentLanguage = document.getElementById("lang-btn-select").dataset.lang,
        p = document.createElement("p");

    if(currentLanguage == "English"){
        p.innerText = data.en["error-message"];
    }

    if(currentLanguage == "Français"){
        p.innerText = data.fr["error-message"];
    }

    errorPlacement.appendChild(p);
}

// basic controller to control language state
function languageChange(event, xplode){
    let selection = event.target.id;
    
    if(selection === "lang-btn-fr"){
        repopulateText(data.fr);
        changeButton("Français");
    } else {
        repopulateText(data.en);
        changeButton("English");
    }
    let xplodenew = moveClasses();
    xplodeText(xplodenew);
}

// matches JSON keys with DOM id to replace values for language changes
function repopulateText(language){
    Object.keys(language).forEach(id => {
        let balise = document.getElementById(id);
        if(balise != null && id != "error-message"){
            balise.innerHTML = "";

            balise.innerHTML = language[id];
        }   
    });
}

// updates language button with current language
function changeButton(language){
    let button = document.getElementById('lang-btn-select');
    button.innerText = "";
    button.innerText = language;
    button.dataset.lang = language;
}

// Hack Solution to the difference between fr and en sentence structuring
function moveClasses(){
    let button = document.getElementById('lang-btn-select'),
        contact = document.getElementById('idContact'),
        form = document.getElementById('idForm'),
        line = document.getElementById('lastLine');

    if(button.dataset.lang == "English"){
        contact.className = "";
        form.className = "";
        line.className = "";
        contact.className = "hero__line_txt-prpl xplode word";
        form.className = "word";
        line.className = "hero__line";
    }

    if(button.dataset.lang == "Français"){
        contact.className = "";
        form.className = "";
        line.className = "";
        form.className = "word";
        contact.className = "hero__line_txt-prpl xplode word";
        line.className = "hero__line--reversed";
    }

    let xplodeWords = document.querySelectorAll(".xplode");

    return xplodeWords;
}