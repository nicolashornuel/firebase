class Preference {
    constructor(doc) {
        this.matSliderValue = doc.data.matSliderValue;
        this.radioBackEnd = doc.data.radioBackEnd;
        this.radioDataBase = doc.data.radioDataBase;
        this.switchDiscogs = doc.data.switchDiscogs;
        this.maxResultsDiscogs = doc.data.maxResultsDiscogs;
        this.switchWikipedia = doc.data.switchWikipedia;
        this.switchYoutube = doc.data.switchYoutube;
        this.maxResultsYoutube = doc.data.maxResultsYoutube;
        this.orderYoutube = doc.data.orderYoutube
    }
}

module.exports = Preference;
