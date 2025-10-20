import emailjs from "@emailjs/browser";
import { EmailFormData } from "../types/FormData";



export const sendEmail = async (data: EmailFormData) => { 
  emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

  
  const templateParams = data; 
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, 
      templateParams 
    );
    console.log('E-mail enviado com sucesso!', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return false;
  }
};