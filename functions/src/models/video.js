class Video {
    constructor(doc) {
        this.id = doc.id;
        this.videoId = doc.data.videoId;
        this.publishedAt = doc.data.publishedAt;
        this.title = doc.data.title;
        this.description = doc.data.description;
        this.thumbnail = doc.data.thumbnail;
        this.channelTitle = doc.data.channelTitle;
        this.src = doc.data.src;
        this.sanitized = doc.data.sanitized;
        this.categorie = doc.data.categorie;
        this.extractWiki = doc.data.extractWiki;
        this.rating = doc.data.rating;
    }
}

module.exports = Video;

  