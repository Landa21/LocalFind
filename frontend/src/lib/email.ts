import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('⚠️ EmailJS keys are missing from environment variables. Skipping email send.');
    console.log('Mocked Email Details:', { email, name });
    return;
  }

  try {
    console.log('📧 Sending welcome email via EmailJS...');

    const templateParams = {
      to_name: name,
      to_email: email,
      message: `Your account has been successfully created on LocalFind. Access your dashboard here: ${window.location.origin}/dashboard`,
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);

    console.log('✅ Welcome email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to send email: ${errorMessage}`);
  }
};
