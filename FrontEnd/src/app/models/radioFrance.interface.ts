export interface Live {
  live: {
    song: Song;
  };
}

export interface Brand {
  brand: {
    id: string;
    title: string;
    baseline: string;
    description: string;
    websiteUrl: string;
    liveStream: string;
    localRadios: [
      {
        id: string;
        title: string;
        description: string;
        liveStream: string;
      }
    ];
    webRadios: [
      {
        id: string;
        title: string;
        description: string;
        liveStream: string;
      }
    ];
  } 
}

export interface Grid {
  grid: Song[];
}

export interface Song {
  start: number;
  end: number;
  track: {
    title: string;
    albumTitle: string;
    label: string;
    mainArtists: string[];
    authors: string[];
    composers: string[];
    performers: string[];
    productionDate: number;
  };
}
