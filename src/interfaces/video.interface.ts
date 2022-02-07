export interface VideoFormat {
  nextPageToken: string;
  videoId: string;
  publishedAt: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailLink: string;
}

export interface ResponseReceived {
  nextPageToken: string;
  items: [
    {
      id: { videoId: string };
      snippet: {
        publishedAt: string;
        title: string;
        description: string;
        channelTitle: string;
        thumbnails: {
          medium: { url: string };
        };
      };
    },
  ];
}
