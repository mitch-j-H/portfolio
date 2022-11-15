window.onload = () => {
    // Checks browser language
    let browserLang = navigator.language;
    let locale = Intl.getCanonicalLocales(browserLang);
    console.log(browserLang);
    if(browserLang.substring(0, 2)==="fr"){
        window.location.replace("fr.index.html");
        console.log(browserLang);
    } else {
        window.location.replace("en.index.html");
        console.log(browserLang);
    }
}