let was_klaudia_hoert_ID = "alexa2.0.History.summary";
let klaudia_soll_sprechen_ID = "alexa2.0.Echo-Devices.XXXXXXXXX.Commands.speak";
let fenster_sensor_ID = "hm-rpc.0.XXXXXXXXXX.1.STATE";
let regenstatus_text_ID = "javascript.0.Wetterstation.Regenstatus";
let dachfenster_Steuerung = 'hm-rpc.0.XXXXXXXXXX.4.LEVEL'/*HmIP-BROLL XXXXXX:4 LEVEL*/;
let antwort_im_Zeitrahmen = false;
let durchzug_aktiv = false;
let nochrechtzeitig;



on({ id: fenster_sensor_ID, change: "ne" }, ({ state, oldState }) => {
  const value = state.val;
  const oldValue = oldState.val;

  if (!!value && compareTime("6:00", "22:00", "between") == true && getState(regenstatus_text_ID).val == "--") {
    klaudia_frage()
  }

  if (!value) {
    setState(dachfenster_Steuerung, 0);

    if (!durchzug_aktiv) {
      durchzug_aktiv = false;
    }

    timer_loeschen();
  }
});

const timer_setzen = () => {
  setState('alexa2.0.Echo-Devices.XXXXXXXXXXXXX.Commands.textCommand'/*textCommand*/, "setze Timer auf 80 Sekunden");
}

// Funktion um Timer zu löschen
const timer_loeschen = () => {
  setState('alexa2.0.Echo-Devices.XXXXXXXXXXXXXXX.Commands.textCommand'/*textCommand*/, "loesche den 80 Sekunden Timer");
}


const klaudia_frage = () => {
  setState(klaudia_soll_sprechen_ID, "Soll ich die Dachfenster öffnen zum Querlüften?");

  //Setze letiable antwort rechzeitig auf true
  // timer Starten-> 
  // wenn timer abgelaufen ==> Setzte let auf false


  antwort_im_Zeitrahmen = true;

  if (nochrechtzeitig) {
    clearTimeout(nochrechtzeitig);
    nochrechtzeitig = null;
  }

  nochrechtzeitig = setTimeout(() => {
    antwort_im_Zeitrahmen = false;
    //console.log("Response Time ausgelaufen");
  }, 17000);
}


//trigger auf summery
// überprüfen ob in der Zeit 
// inhalt Prüfen
// aktion

on({ id: was_klaudia_hoert_ID, change: "ne" }, ({ state, oldState }) => {
  let value = state.val;
  let oldValue = oldState.val;

  //console.log(value);
  if (!antwort_im_Zeitrahmen) {
    return
  }

  if (value == "ja") {
    setState(klaudia_soll_sprechen_ID, "OK ich öffne die Dachfenster");
    console.log("ja erkannt!")
    setState(dachfenster_Steuerung, 100);
    timer_setzen();
    durchzug_aktiv = true;
    antwort_im_Zeitrahmen = false;

    if (!nochrechtzeitig) {
      return;
    }

    clearTimeout(nochrechtzeitig);
    nochrechtzeitig = null;
    return;
  }

  if (value == "nein") {
    setState(klaudia_soll_sprechen_ID, "Na dann halt nicht! Man darf ja mal noch fragen");
    console.log("nein erkannt!")
    antwort_im_Zeitrahmen = false;

    if (!nochrechtzeitig) {
      return;
    }

    clearTimeout(nochrechtzeitig);
    nochrechtzeitig = null;
    return;
  }

  setState(klaudia_soll_sprechen_ID, "kannst du deine Anwort nochmal wiederholen?");
  return;
})
