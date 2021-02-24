class Video {
    /* constructor(videoId, title, channelTitle, description, categorie) {
        this.videoId = videoId,
        this.title = title,
        this.channelTitle = channelTitle,
        this.description = description,
        this.categorie = categorie
    } */
    constructor(data) {
        this.videoId = data.videoId,
        this.title = data.title,
        this.channelTitle = data.channelTitle,
        this.description = data.description,
        this.categorie = data.categorie
    }
}

module.exports = Video;
