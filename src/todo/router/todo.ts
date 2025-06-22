import { Request, Response, Router } from 'express';
const router: Router = Router();

router.get('/todo', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Todo API is working!' });
});

router.post('/todo', (req: Request, res: Response) => {
  const { title, content } = req.body;
  // Here you would typically save the note to a database
  res.status(201).json({ message: 'Note created', note: { title, content } });
});

router.put('/todo', (req: Request, res: Response) => {
  const { id, title, content } = req.body;
  // Here you would typically update the note in a database
  res
    .status(200)
    .json({ message: `Note with ID ${id} updated`, note: { title, content } });
});

export default router;
