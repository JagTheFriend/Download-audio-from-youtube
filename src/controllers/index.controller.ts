import { ResponseReceived, VideoFormat } from '@interfaces/video.interface';
import { YOUTUBE_API_KEY } from '@config';
import { NextFunction, Request, Response } from 'express';
import fetch from 'cross-fetch';
import ytdl from 'ytdl-core';
import { check } from 'prettier';

const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY}&type=video&maxResults=18&q=`;
const url2 = `https://www.googleapis.com/youtube/v3/videos?part=id&key=${YOUTUBE_API_KEY}&id=`;

function sendResponse(id: string, res: Response) {
  return Promise.resolve(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: 'audioonly',
      requestOptions: { timeout: 360 },
    }).pipe(res),
  );
}

async function checkValidity(videoId: string) {
  const response = await fetch(url2 + videoId);
  const data = await response.json();
  return data.pageInfo.totalResults !== 0;
}

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.header('Access-Control-Allow-Origin', '*');
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
    const fileName: string = req.query.fileName as string;
    if (!(await checkValidity(id))) {
      res.redirect('/');
      return;
    }
    try {
      res.header('Content-Disposition', `attachment; filename="${fileName.replace(/[^\x00-\x7F]/g, '')}.mp3"`);
      sendResponse(id, res);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
