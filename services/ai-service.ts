import type { Location } from '@/types/location';

// Folosim Groq (gratuit, foarte rapid) cu Llama 3
const GROQ_API_KEY = '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'; // Ia cheie gratis de la https://console.groq.com
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildPrompt(location: Location): string {
  const type = location.type === 'cafe' ? 'cafenea' : 'restaurant';
  return `Generează o descriere scurtă, captivantă și vibrantă în limba română (80-100 cuvinte) pentru ${type} "${location.name}" din ${location.address}. 

Descriere actuală: ${location.description}

Cerințe:
- Maxim 100 cuvinte
- Ton prietenos și inviting
- Limbaj viu și descriptiv
- Atmosfera și experiența culinară
- Detalii senzoriale (arome, ambianță)
- Call-to-action subtil la final
- Fără introduceri generice
- Direct la subiect`;
}

export async function generateVibeDescription(location: Location): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Ești un copywriter expert în descrieri creative pentru locații gastronomice din România. Scrii în stil captivant, warm și autentic.'
          },
          {
            role: 'user',
            content: buildPrompt(location)
          }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error('No content generated');
    }

    return generatedText;
  } catch (error) {
    console.error('AI Service Error:', error);
    if (error instanceof Error) {
      throw new Error(`Nu am putut genera descrierea: ${error.message}`);
    }
    throw new Error('Nu am putut genera descrierea. Verifică conexiunea la internet.');
  }
}

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
}

export function configureAIService(config: AIServiceConfig): void {
  console.log('AI Service configured:', config);
}
