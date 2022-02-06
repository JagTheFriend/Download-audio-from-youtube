import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('index', { data: [] });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
