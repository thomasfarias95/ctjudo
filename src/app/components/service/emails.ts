import emailjs from "emailjs-com";
import { FormData } from "../types/FormData";

// Inicializa o EmailJS uma única vez
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

export const sendEmail = async (data: FormData) => {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    { ...data } // converte para objeto genérico
  );
};
