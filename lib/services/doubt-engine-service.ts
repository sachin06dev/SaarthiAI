import { CandidateExtractionRow, DoubtEngineMessage } from '../types/report.types';
import { CANONICAL_TEST_CATALOG } from '../knowledge/test-catalog';

export interface DoubtEngineResponse {
  message: DoubtEngineMessage;
  isRefusal: boolean;
}

export function answerDoubtQuery(
  query: string,
  sessionRows: CandidateExtractionRow[],
  language: 'en' | 'hi' = 'en'
): DoubtEngineResponse {
  const isHi = language === 'hi';
  const normalized = query.trim().toLowerCase();

  // STRICT MEDICAL SAFETY GUARDRAIL
  const dangerousPatterns = [
    'diagnose',
    'diagnosis',
    'do i have',
    'cancer',
    'tumor',
    'which medicine',
    'what medicine',
    'medicine',
    'medication',
    'prescribe',
    'prescription',
    'drug',
    'drugs',
    'dosage',
    'dose',
    'how many pills',
    'cure me',
    'cure',
    'treat me',
    'treatment',
    'heart attack',
    'दवा',
    'दवाई',
    'इलाज',
    'उपचार',
    'क्या मुझे बीमारी है',
    'कौन सी दवाई',
    'कितनी गोली',
  ];

  const isDangerous = dangerousPatterns.some((pattern) => normalized.includes(pattern));

  if (isDangerous) {
    const refusalText = isHi
      ? 'सारथी एआई (SaarthiAI) किसी बीमारी का निदान नहीं कर सकता और न ही कोई दवा या उपचार लिख सकता है। यह मंच केवल रिपोर्ट में दी गई जानकारी को सरल भाषा में समझाने और डॉक्टर से परामर्श हेतु प्रश्न तैयार करने के लिए है। कृपया किसी भी लक्षण, निदान या दवा के लिए तुरंत योग्य चिकित्सक से संपर्क करें।'
      : 'SaarthiAI cannot diagnose medical conditions, recommend medications, or prescribe treatments. Our platform is strictly educational—to help you decode laboratory terminology and prepare informed questions for your physician. Please consult a licensed medical doctor for clinical advice.';

    return {
      isRefusal: true,
      message: {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: refusalText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        isRefusal: true,
      },
    };
  }

  // Check if query asks about a specific analyte in the current session
  for (const row of sessionRows) {
    const rawLower = row.rawTestName.toLowerCase();
    const canonLower = row.canonicalId.toLowerCase();
    if (normalized.includes(rawLower) || normalized.includes(canonLower)) {
      const def = CANONICAL_TEST_CATALOG[row.canonicalId];
      const name = def?.displayName || row.rawTestName;
      const valStr = row.parsedNumericValue !== undefined
        ? `${row.parsedNumericValue} ${row.parsedUnit}`
        : row.parsedCategoricalValue || row.rawValueText;

      const desc = isHi
        ? `${name} के बारे में: ${def?.descriptionHi || 'यह एक महत्वपूर्ण नैदानिक मापदंड है।'}\nआपकी रिपोर्ट में इसका परिणाम ${valStr} दर्ज है।`
        : `About ${name}: ${def?.descriptionEn || 'This is an important clinical laboratory parameter.'}\nYour report shows an observed result of ${valStr}.`;

      return {
        isRefusal: false,
        message: {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          text: desc,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language,
          relatedTestId: row.canonicalId,
        },
      };
    }
  }

  // General Questions: Units
  if (normalized.includes('unit') || normalized.includes('इकाई') || normalized.includes('मात्रा') || normalized.includes('mg/dl')) {
    const unitText = isHi
      ? 'प्रयोगशाला रिपोर्ट में इकाइयाँ (जैसे mg/dL, g/dL, U/L) यह दर्शाती हैं कि रक्त के एक निश्चित आयतन में पदार्थ की कितनी मात्रा मौजूद है। अलग-अलग प्रयोगशालाएँ विभिन्न मापदंडों का उपयोग कर सकती हैं, इसलिए संख्या को हमेशा उसकी इकाई के साथ समझा जाता है।'
      : 'Laboratory units such as mg/dL (milligrams per deciliter), g/dL, or U/L express concentration—the quantity of an analyte within a given volume of biological fluid. Because different labs use different measurement conventions, values must always be interpreted alongside their specific units.';

    return {
      isRefusal: false,
      message: {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: unitText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      },
    };
  }

  // General Questions: Reference Ranges
  if (normalized.includes('range') || normalized.includes('सीमा') || normalized.includes('normal')) {
    const rangeText = isHi
      ? 'संदर्भ सीमा (Reference Range) स्वस्थ व्यक्तियों के समूह में पाए जाने वाले सामान्य मानों को दर्शाती है। यदि कोई मान थोड़ा बाहर है, तो इसका यह मतलब नहीं कि कोई बीमारी है। आहार, पानी का स्तर, तनाव और परीक्षण का समय जैसे कई सामान्य कारक इस पर प्रभाव डालते हैं।'
      : 'A reference interval reflects the range of values observed in 95% of a healthy reference population. Being slightly outside this range does not automatically indicate disease—everyday factors like hydration, dietary intake, sleep, and time of collection frequently influence results.';

    return {
      isRefusal: false,
      message: {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: rangeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      },
    };
  }

  // Default grounded reply
  const defaultText = isHi
    ? `सारथी एआई आपकी वर्तमान रिपोर्ट के ${sessionRows.length} मापदंडों को समझता है। आप किसी विशिष्ट टेस्ट (जैसे हीमोग्लोबिन, शुगर, क्रिएटिनिन) के बारे में पूछ सकते हैं, या डॉक्टर से क्या पूछना चाहिए यह जान सकते हैं।`
    : `SaarthiAI is referencing ${sessionRows.length} parameters from your current session. You can ask what specific tests measure, what units indicate, or what neutral questions to discuss with your doctor.`;

  return {
    isRefusal: false,
    message: {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      text: defaultText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    },
  };
}
