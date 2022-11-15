window.onload = () => {
    // Checks browser language
    let browserLang = navigator.language;
    let locale = Intl.getCanonicalLocales(browserLang);
    //redirects to appropriate page
    if(browserLang.substring(0, 2)==="fr"){
        window.location.replace("fr.index.html");
    } else {
        window.location.replace("en.index.html");
    }
}