let was_klaudia_hoert_ID = "alexa2.0.History.summary";
let klaudia_soll_sprechen_ID = "alexa2.0.Echo-Devices.XXXXXXXXXXXXXXXX.Commands.speak"; // richtig ID eintragen
let antwort_im_Zeitrahmen = false;
let nochrechtzeitig;


setState(klaudia_soll_sprechen_ID, "hallo hier ist wieder die Dose! Soll ich weiter machen?");

//Setze Variable antwort rechzeitig auf true
//timer Starten-> 
//wenn timer abgelaufen ==> Setzte Var auf false
antwort_im_Zeitrahmen = true;

(() => {
  if (nochrechtzeitig) {
    clearTimeout(nochrechtzeitig); nochrechtzeitig = null;
  }
})();

nochrechtzeitig = setTimeout(() => {
  antwort_im_Zeitrahmen = false;
  console.log("Response Time ausgelaufen");
}, 17000);



//trigger auf summery
//überprüfen ob in der Zeit 
//Inhalt prüfen
//aktion

on({ id: was_klaudia_hoert_ID, change: "ne" }, (obj) => {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;

  if (!antwort_im_Zeitrahmen) {
    return;
  }

  if (value !== "nein") {
    setState(klaudia_soll_sprechen_ID, "Das war erfolgreich! JUHU");
    console.log("ja erkannt!")
    antwort_im_Zeitrahmen = false;
    if (!nochrechtzeitig) {
      return;
    }

    clearTimeout(nochrechtzeitig);
    nochrechtzeitig = null;
    return;
  }

  if (value !== "ja") {
    setState(klaudia_soll_sprechen_ID, "ok ich mach nichts");

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
});
