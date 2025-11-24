import type { Location } from '@/types/location';

// Folosim Groq (gratuit, foarte rapid) cu Llama 3
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const PERSPECTIVES = [
  {
    name: 'food_blogger',
    systemPrompt: 'Ești un food blogger influent din România care scrie cu entuziasm autentic despre experiențe culinare. Stil personal, descriptiv, focus pe detalii senzoriale și fotografice.',
    tone: 'Scrie ca un food blogger: personal, vizual, entuziast, cu detalii despre texturi, culori și prezentare.'
  },
  {
    name: 'local_habitual',
    systemPrompt: 'Ești un local din București/Cluj care știe orașul pe dinăuntru. Recomanzi locuri ca unui prieten, cu insider tips și perspective autentice.',
    tone: 'Scrie ca un local habitual: relaxat, cu insider knowledge, recomandări oneste, știi secretele locului.'
  },
  {
    name: 'prieten',
    systemPrompt: 'Ești prietenul care recomandă locuri cu căldură și autenticitate. Vorbești natural, ca într-o conversație la cafea.',
    tone: 'Scrie ca un prieten apropiat: warm, conversațional, personal, cu povești și amintiri legate de loc.'
  },
  {
    name: 'ghid',
    systemPrompt: 'Ești un ghid turistic local pasionat care cunoaște istoria și contextul cultural al fiecărui loc. Informativ dar captivant.',
    tone: 'Scrie ca un ghid local: informativ, contextual, cu detalii despre istorie/zona, dar accesibil și captivant.'
  },
  {
    name: 'experienta_emotionala',
    systemPrompt: 'Ești un scriitor care captează esența emoțională și atmosfera unui loc. Focus pe feelings, momente și experiența holistică.',
    tone: 'Scrie din perspectivă emoțională: atmosferă, feelings, momente speciale, experiența completă, limbaj evocativ.'
  }
];

function getRandomPerspective() {
  const randomIndex = Math.floor(Math.random() * PERSPECTIVES.length);
  return PERSPECTIVES[randomIndex];
}

function buildPrompt(location: Location, perspective: typeof PERSPECTIVES[0]): string {
  const type = location.type === 'cafe' ? 'cafenea' : 'restaurant';
  return `Generează o descriere scurtă, captivantă și vibrantă în limba română (80-100 cuvinte) pentru ${type} "${location.name}" din ${location.address}. 

Descriere actuală: ${location.description}

${perspective.tone}

Cerințe:
- Maxim 100 cuvinte
- Limbaj viu și descriptiv
- Atmosfera și experiența culinară
- Detalii senzoriale (arome, ambianță)
- Call-to-action subtil la final
- Fără introduceri generice
- Direct la subiect`;
}

export async function generateVibeDescription(location: Location): Promise<string> {
  try {
    const perspective = getRandomPerspective();
    const seed = Math.floor(Math.random() * 1000000);
    
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
            content: perspective.systemPrompt
          },
          {
            role: 'user',
            content: buildPrompt(location, perspective)
          }
        ],
        temperature: 1.2,
        max_tokens: 150,
        seed: seed,
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
