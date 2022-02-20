import { NextFunction, Request, Response } from 'express';
import { checkValidity, searchSong } from '@utils/util';
import ytdl from 'ytdl-core';

function sendResponse(id: string, res: Response) {
  return Promise.resolve(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: 'audioonly',
      requestOptions: { timeout: 360 },
    }).pipe(res),
  );
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
      const dataToSend = await searchSong(songName);
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
