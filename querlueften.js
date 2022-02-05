var was_klaudia_hoert_ID = "alexa2.0.History.summary";
var klaudia_soll_sprechen_ID = "alexa2.0.Echo-Devices.XXXXXXXXX.Commands.speak";
var fenster_sensor_ID = "hm-rpc.0.XXXXXXXXXX.1.STATE";
var regenstatus_text_ID = "javascript.0.Wetterstation.Regenstatus";
var dachfenster_Steuerung = 'hm-rpc.0.XXXXXXXXXX.4.LEVEL'/*HmIP-BROLL XXXXXX:4 LEVEL*/;
var antwort_im_Zeitrahmen = false;
var durchzug_aktiv = false;
var nochrechtzeitig;



on({ id: fenster_sensor_ID, change: "ne" }, function (obj) {
    var value = obj.state.val;
    var oldValue = obj.oldState.val;

    if (value == 1) {
        if (compareTime("6:00", "22:00", "between") == true) {
            if (getState(regenstatus_text_ID).val == "--") {

                klaudia_frage();
            }
        }
    }
    if (value == 0){
        setState(dachfenster_Steuerung, 0);
        if(durchzug_aktiv == true){
        timer_loeschen();
        }
        durchzug_aktiv = false;
        
    }
});

function timer_setzen(){
    setState('alexa2.0.Echo-Devices.XXXXXXXXXXXXX.Commands.textCommand'/*textCommand*/, "setze Timer auf 80 Sekunden");

}

// Funktion um Timer zu löschen

function timer_loeschen(){
    setState('alexa2.0.Echo-Devices.XXXXXXXXXXXXXXX.Commands.textCommand'/*textCommand*/, "loesche den 80 Sekunden Timer");

}


function klaudia_frage() {
    setState(klaudia_soll_sprechen_ID, "Soll ich die Dachfenster öffnen zum Querlüften?");

    //Setze Variable antwort rechzeitig auf true
    // timer Starten-> 
    // wenn timer abgelaufen ==> Setzte Var auf false


    antwort_im_Zeitrahmen = true;



    (function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();
    nochrechtzeitig = setTimeout(function () {

        antwort_im_Zeitrahmen = false;
        //console.log("Response Time ausgelaufen");

    }, 17000);
}


//trigger auf summery
// überprüfen ob in der Zeit 
// inhalt Prüfen
// aktion

on({ id: was_klaudia_hoert_ID, change: "ne" }, function (obj) {
    var value = obj.state.val;
    var oldValue = obj.oldState.val;

    //console.log(value);
    if (antwort_im_Zeitrahmen == true) {
        if (value == "ja") {
            setState(klaudia_soll_sprechen_ID, "OK ich öffne die Dachfenster");
            console.log("ja erkannt!")
            setState(dachfenster_Steuerung, 100);
            timer_setzen();
            durchzug_aktiv = true;
            antwort_im_Zeitrahmen = false;
            (function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();

        } else if (value == "nein") {
            setState(klaudia_soll_sprechen_ID, "Na dann halt nicht! Man darf ja mal noch fragen");
            console.log("nein erkannt!")
            antwort_im_Zeitrahmen = false;
            (function () { if (nochrechtzeitig) { clearTimeout(nochrechtzeitig); nochrechtzeitig = null; } })();

        } /* else if(value != ""){
            setState(klaudia_soll_sprechen_ID, "kannst du deine Anwort nochmal wiederholen?");
        } */
    }
