class Preference {
    constructor(doc) {
        this.matSliderValue = doc.data.matSliderValue;
        this.switchDiscogs = doc.data.switchDiscogs;
        this.maxResultsDiscogs = doc.data.maxResultsDiscogs;
        this.switchWikipedia = doc.data.switchWikipedia;
        this.switchYoutube = doc.data.switchYoutube;
        this.maxResultsYoutube = doc.data.maxResultsYoutube;
        this.orderYoutube = doc.data.orderYoutube;
        this.stationRadioFrance = doc.data.stationRadioFrance;
    }
}

module.exports = Preference;
