var was_klaudia_hoert_ID = "alexa2.0.History.summary";
var klaudia_soll_sprechen_ID = "alexa2.0.Echo-Devices.XXXXXXXXXXXXXXXX.Commands.speak"; // richtig ID eintragen
var antwort_im_Zeitrahmen = false;
var nochrechtzeitig;


setState(klaudia_soll_sprechen_ID, "hallo hier ist wieder die Dose! Soll ich weiter machen?");

//Setze Variable antwort rechzeitig auf true
//timer Starten-> 
//wenn timer abgelaufen ==> Setzte Var auf false


antwort_im_Zeitrahmen = true;



(function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();
nochrechtzeitig = setTimeout(function () {

    antwort_im_Zeitrahmen = false;
    console.log("Response Time ausgelaufen");

}, 17000);



//trigger auf summery
//überprüfen ob in der Zeit 
//Inhalt prüfen
//aktion

on({ id: was_klaudia_hoert_ID, change: "ne" }, function (obj) {
    var value = obj.state.val;
    var oldValue = obj.oldState.val;

    console.log(value);
    if (antwort_im_Zeitrahmen == true) {
        if (value == "ja") {
            setState(klaudia_soll_sprechen_ID, "Das war erfolgreich! JUHU");
            console.log("ja erkannt!")
            antwort_im_Zeitrahmen = false;
            (function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();

        } else if (value == "nein") {
            setState(klaudia_soll_sprechen_ID, "ok ich mach nichts");
            console.log("nein erkannt!")
            antwort_im_Zeitrahmen = false;
            (function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();

        } /* else if(value != ""){
            setState(klaudia_soll_sprechen_ID, "kannst du deine Anwort nochmal wiederholen?");
        } */
    }

});
