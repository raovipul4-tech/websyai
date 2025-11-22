import { MetaCredentials } from '../types';

const GRAPH_API_VERSION = 'v18.0';
const BASE_URL = 'https://graph.facebook.com';

export const getStoredCredentials = (): MetaCredentials | null => {
  const stored = localStorage.getItem('meta_credentials');
  return stored ? JSON.parse(stored) : null;
};

export const saveCredentials = (creds: MetaCredentials) => {
  localStorage.setItem('meta_credentials', JSON.stringify(creds));
};

export const validateCredentials = async (phoneNumberId: string, accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/${GRAPH_API_VERSION}/${phoneNumberId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Validation failed:', error);
    return false;
  }
};

export const sendWhatsAppMessage = async (to: string, body: string): Promise<boolean> => {
  const creds = getStoredCredentials();
  if (!creds || !creds.verified) {
    console.warn('No valid credentials found. Message simulated.');
    return true; // Simulate success in demo mode
  }

  try {
    const response = await fetch(`${BASE_URL}/${GRAPH_API_VERSION}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        text: { body: body },
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error('Meta API Error:', data);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Send message failed:', error);
    return false;
  }
};

export const sendTemplateMessage = async (to: string, templateName: string, language: string = 'en_US'): Promise<boolean> => {
  const creds = getStoredCredentials();
  if (!creds || !creds.verified) {
     console.warn('No valid credentials found. Template simulated.');
     return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/${GRAPH_API_VERSION}/${creds.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language }
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
       console.error('Meta API Error:', data);
       return false;
    }
    return true;
  } catch (error) {
    console.error('Send template failed:', error);
    return false;
  }
};