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
        this.publishedAt = data.publishedAt,
        this.title = data.title,
        this.description = data.description,
        this.thumbnail = data.thumbnail,
        this.channelTitle = data.channelTitle,
        this.src = data.src,
        this.categorie = data.categorie
    }
}

module.exports = Video;


