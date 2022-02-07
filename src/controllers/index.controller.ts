import { ResponseReceived, VideoFormat } from '@interfaces/video.interface';
import { YOUTUBE_API_KEY } from '@config';
import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';

const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY}&type=video&maxResults=18&q=`;

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('index');
    } catch (error) {
      next(error);
    }
  };

  public searchSong = async (req: Request, res: Response, next: NextFunction) => {
    const songName = req.body.song;
    try {
      const response = await fetch(url + songName);
      const data: ResponseReceived = <ResponseReceived>await response.json();
      const dataToSend: VideoFormat[] = [];
      for (const key of data.items) {
        dataToSend.push({
          nextPageToken: data.nextPageToken,
          videoId: key.id.videoId,
          title: key.snippet.title,
          description: key.snippet.description,
          thumbnailLink: key.snippet.thumbnails.medium.url,
        });
      }
      res.send(dataToSend);
    } catch (error) {
      next(error);
    }
  };

  public downloadSong = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.query.id as string;
    try {
      res.send(id);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
