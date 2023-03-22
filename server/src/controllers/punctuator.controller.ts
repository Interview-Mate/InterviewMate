const axios = require('axios');
import { Request, Response } from "express";

exports.punctuate = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`http://bark.phon.ioc.ee/punctuator?text=${text}`);
    const punctuatedText = response.data;
    res.json({ punctuatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

