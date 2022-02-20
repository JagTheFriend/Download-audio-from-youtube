export interface VideoFormat {
  nextPageToken: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailLink: string;
}

export interface ResponseReceived {
  nextPageToken: string;
  items: [
    {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        thumbnails: {
          medium: { url: string };
        };
      };
    },
  ];
}

export interface DataToSend {
  nextPageToken: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailLink: string;
}
