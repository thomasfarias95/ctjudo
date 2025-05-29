// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body;

    // 1. Configure o transportador do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    try {
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER, 
        to: 'ctferroviario22@gmail.com', 
        subject: `Nova mensagem de contato de ${name}`,
        html: `
          <p>Você recebeu uma nova mensagem do formulário de contato:</p>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Nome:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong> ${message}</p>
        `,
      });

      res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      res.status(500).json({ message: 'Erro ao enviar o e-mail.' });
    }
  } else {
    
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}