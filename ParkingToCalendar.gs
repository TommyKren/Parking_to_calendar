function ParkingToCalendar() {
  //  Vyhledej všechny zprávy od odesilatele
  var mailFromSender = GmailApp.search("from:/*___private_info__*/");
    
  // *************************************************************************************
  //  Postupně projdi všechny odpovídající e-maily
  for(var i in mailFromSender) {
    var mails = mailFromSender[i].getMessages()
    
    // ***********************************************************************************
    for(var j in mails) {
 
      //  Získej předmět e-mailu
      var mailTitle = mails[j].getSubject()
      //  Logger.log("Predmet " + nadpis)

      // *********************************************************************************
      //  Porovnej předmět a připrav na zpracování
      if (mailTitle == "Rezervace parkování") {
        //  Rozděl na jednotlivé řádky
        var mailDescription = mails[j].getPlainBody()
          .trim()
          .split("\n")
        //  Logger.log("Obsah mailu " + i + "-" + j + " " + mailDescription[0] + " " + mailDescription[1] + " " + mailDescription[2] + " " + mailDescription[3])

        //  Projdi všechny řádky a porovnej se záznamy v kalendáři
        for(var k in mailDescription) {
          if (mailDescription[k].search("Parkovací místo") > -1) {
            var mailDescriptionDate = mailDescription[k]
              .split(";")[0]
              .trim()

            var dateConversion = mailDescriptionDate
              .split(".")

            //  Zapsat rok
            mailDescriptionDate = dateConversion[2]
            
            //  Zapsat mesic
            if(dateConversion[1].length == 1) {
              mailDescriptionDate = mailDescriptionDate + "-0" + dateConversion[1]
            }
            else {
              mailDescriptionDate = mailDescriptionDate + "-" + dateConversion[1]
            }

            //  Zapsat den
            if(dateConversion[0].length == 1) {
              mailDescriptionDate = mailDescriptionDate + "-0" + dateConversion[0]
            }
            else {
              mailDescriptionDate = mailDescriptionDate + "-" + dateConversion[0]
            }

            //  Zapsat misto
            var mailDescriptionPlace = mailDescription[k]
              .split(";")[2]
              .trim()
        
            Logger.log("ocistene datum " + mailDescriptionDate + " |||||| ocistene misto " + mailDescriptionPlace)

            var eventDate = new Date(mailDescriptionDate)
            var eventPlace

            var events = CalendarApp.getDefaultCalendar().getEventsForDay(eventDate)

            var isEventExist = false
            var isEventToChange = false

            for(var l in events){
              eventPlace = events[l].getLocation()
              if (eventPlace.search(mailDescriptionPlace) > -1) {
                isEventExist = true
                break
              }
              else if(eventPlace.search("Parkovací místo") > -1) {
                isEventToChange = true
                break
              }
              else{

              }
            }

            if (isEventExist == false && isEventToChange == false) {
              Logger.log("!! Není založit !!")
              
              //  Vytvoř událost ve výchozím kalendáři
              var eventNew = CalendarApp.getDefaultCalendar()
                .createEventFromDescription(mailTitle + ", " + mailDescriptionDate + " 7:00-17:00")
                .setLocation(mailDescriptionPlace)
            }
            else if (isEventExist == false && isEventToChange == true) {
              Logger.log("Bude změněno z " + eventPlace)
              var eventEdit = events[l]
              eventEdit.setLocation(mailDescriptionPlace)
            }
            else {
              Logger.log("Existuje misto " + eventPlace)
            }
        
            //  Logger.log(dayOfEvent)
            //  Logger.log("Vytvoren zaznam " + datumUdalosti.toString() + " " + misto)

            
        
            //  Přesuň zprávu do koše
            mails[j].moveToTrash()
          }
        }
      }
    }
  } 
}
