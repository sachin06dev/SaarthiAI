import { AIProvider } from './ai-provider.interface';
import { CandidateExtractionRow } from '../types/report.types';
import { ParameterExplanation } from '../types/test.types';

export class MockAIProvider implements AIProvider {
  name = 'Saarthi Curated Mock Engine (Offline/Safe)';
  isReady = true;

  async generateExplanation(
    param: CandidateExtractionRow,
    language: 'en' | 'hi' = 'en'
  ): Promise<ParameterExplanation> {
    const isHi = language === 'hi';
    const testName = param.rawTestName || param.canonicalId;
    const valueStr = param.parsedNumericValue !== undefined
      ? `${param.parsedNumericValue} ${param.parsedUnit}`
      : param.parsedCategoricalValue || param.rawValueText;

    const rangeStr = param.referenceRangeOrigin.rawRangeText
      ? `${param.referenceRangeOrigin.rawRangeText} ${param.referenceRangeOrigin.unit}`
      : isHi ? 'कोई संदर्भ सीमा दर्ज नहीं' : 'No reference range on report';

    let whatItMeasures = isHi
      ? `${testName} आपके शरीर में महत्वपूर्ण जैविक क्रियाओं और संतुलन की जांच करता है।`
      : `${testName} evaluates important biological functions and chemical balance in the body.`;

    let rangeContext = '';
    switch (param.comparisonStatus) {
      case 'IN_RANGE':
        rangeContext = isHi
          ? `यह परिणाम आपकी रिपोर्ट पर दी गई संदर्भ सीमा (${rangeStr}) के भीतर दर्ज है।`
          : `This result is within the reference range (${rangeStr}) specified for this test.`;
        break;
      case 'ABOVE_RANGE':
        rangeContext = isHi
          ? `यह परिणाम रिपोर्ट पर छपी सामान्य संदर्भ सीमा (${rangeStr}) से अधिक है। कई दैनिक या जैविक कारण इस पर असर डाल सकते हैं।`
          : `This result is above the reference interval (${rangeStr}) shown on the report. Several physiological or dietary factors may influence this.`;
        break;
      case 'BELOW_RANGE':
        rangeContext = isHi
          ? `यह परिणाम रिपोर्ट पर छपी संदर्भ सीमा (${rangeStr}) से कम है।`
          : `This result is below the reference interval (${rangeStr}) shown on the report.`;
        break;
      case 'NO_VERIFIED_RANGE':
        rangeContext = isHi
          ? 'इस पैरामीटर के लिए कोई सत्यापित संदर्भ सीमा उपलब्ध नहीं है। कृपया अपने चिकित्सक से परामर्श लें।'
          : 'No verified applicable reference range was found for this specific analyte and unit. Please consult your physician.';
        break;
      case 'CATEGORICAL_REVIEW':
        rangeContext = isHi
          ? `इस गुणात्मक परिणाम (${valueStr}) की व्याख्या नैदानिक संदर्भ के आधार पर आपके डॉक्टर द्वारा की जानी चाहिए।`
          : `This qualitative result (${valueStr}) should be clinically reviewed with your physician alongside your medical history.`;
        break;
      default:
        rangeContext = isHi
          ? 'इस परिणाम की पुष्टि आपके डॉक्टर द्वारा की जानी चाहिए।'
          : 'This result requires clinical review by your healthcare provider.';
    }

    const neutralQuestions = isHi
      ? [
          `डॉक्टर साहब, मेरे ${testName} के स्तर (${valueStr}) का मेरे समग्र स्वास्थ्य के लिए क्या अर्थ है?`,
          `क्या मुझे जीवनशैली में कोई बदलाव करने की आवश्यकता है, या कुछ समय बाद दोबारा जांच करानी चाहिए?`,
        ]
      : [
          `Doctor, what does this ${testName} value (${valueStr}) indicate in the context of my current health?`,
          `Are there any follow-up tests or specific precautions you would recommend based on this?`,
        ];

    return {
      canonicalId: param.canonicalId,
      testName,
      whatItMeasures,
      reportedResultSummary: `${testName}: ${valueStr}`,
      rangeContext,
      neutralDoctorQuestions: neutralQuestions,
      limitationsNote: isHi
        ? 'यह व्याख्या केवल सामान्य जानकारी के लिए है। यह कोई चिकित्सा निदान या उपचार की सलाह नहीं है।'
        : 'Educational summary only. Not a medical diagnosis or treatment recommendation. Always discuss with a licensed physician.',
    };
  }

  async generateDoctorQuestions(
    params: CandidateExtractionRow[],
    language: 'en' | 'hi' = 'en'
  ): Promise<string[]> {
    const isHi = language === 'hi';
    const flagged = params.filter(
      p => p.comparisonStatus === 'ABOVE_RANGE' || p.comparisonStatus === 'BELOW_RANGE'
    );

    if (flagged.length === 0) {
      return isHi
        ? [
            'मेरे इस सामान्य रिपोर्ट प्रोफाइल के आधार पर, क्या मुझे कोई नियमित जांच जारी रखनी चाहिए?',
            'क्या मुझे किसी आहार या जीवनशैली समायोजन पर ध्यान देने की सलाह दी जाती है?',
          ]
        : [
            'Based on these laboratory results, do you recommend any ongoing monitoring or routine re-checks?',
            'Are there any lifestyle or dietary considerations relevant to keeping these parameters stable?',
          ];
    }

    const testNames = flagged.map(f => f.rawTestName || f.canonicalId).slice(0, 3).join(', ');
    return isHi
      ? [
          `डॉक्टर साहब, मेरी रिपोर्ट में ${testNames} के मान सामान्य सीमा से भिन्न हैं। क्या इसके पीछे कोई अस्थायी कारण (जैसे आहार, निर्जलीकरण, या तनाव) हो सकता है?`,
          `क्या इन परिणामों की पुष्टि के लिए किसी अन्य परीक्षण या निश्चित अंतराल के बाद दोबारा जांच की आवश्यकता है?`,
          `क्या मुझे वर्तमान में ली जा रही किसी दवा या पूरक (सप्लीमेंट) के बारे में आपको बताना चाहिए?`,
        ]
      : [
          `Doctor, my report shows variations in ${testNames}. Could factors such as hydration, diet, or recent activity explain this?`,
          `Do these findings warrant any confirmatory tests or a scheduled follow-up repeat test?`,
          `Should I review any current medications or nutritional supplements that might influence these numbers?`,
        ];
  }

  async askDoubtEngine(
    query: string,
    reportContext: CandidateExtractionRow[],
    language: 'en' | 'hi' = 'en'
  ): Promise<{
    responseText: string;
    isRefusal: boolean;
    educationalNotes?: string[];
  }> {
    const isHi = language === 'hi';
    const normalized = query.toLowerCase();

    // STRICT MEDICAL SAFETY GUARDRAIL: Refuse diagnosis, drugs, dosages, treatments
    const dangerousPatterns = [
      'diagnose',
      'do i have',
      'cancer',
      'which medicine',
      'what medicine',
      'prescription',
      'dosage',
      'how many pills',
      'cure me',
      'treat me',
      'दवा',
      'इलाज',
      'क्या मुझे बीमारी है',
      'कौन सी दवाई',
    ];

    const isDangerous = dangerousPatterns.some(pattern => normalized.includes(pattern));

    if (isDangerous) {
      return {
        isRefusal: true,
        responseText: isHi
          ? 'सारथी एआई (SaarthiAI) किसी बीमारी का निदान नहीं कर सकता और न ही कोई दवा या उपचार लिख सकता है। यह मंच केवल रिपोर्ट में दी गई जानकारी को सरल भाषा में समझाने और डॉक्टर से परामर्श हेतु प्रश्न तैयार करने के लिए है। कृपया किसी भी लक्षण, निदान या दवा के लिए तुरंत योग्य चिकित्सक से संपर्क करें।'
          : 'SaarthiAI cannot diagnose conditions, prescribe medications, or recommend treatments. Our role is strictly educational—to help you understand laboratory terminology and prepare informed questions for your physician. Please consult a qualified doctor regarding any symptoms or medical decisions.',
        educationalNotes: [
          isHi ? 'अस्वीकरण: केवल रोगी शिक्षा मंच' : 'Disclaimer: Educational Patient Assistant Only',
        ],
      };
    }

    // Grounded response using reportContext
    if (normalized.includes('unit') || normalized.includes('मात्रा') || normalized.includes('mg/dl') || normalized.includes('g/dl')) {
      return {
        isRefusal: false,
        responseText: isHi
          ? 'प्रयोगशाला रिपोर्ट में इकाइयाँ (Units) जैसे mg/dL (मिलीग्राम प्रति डेसीलीटर) या g/dL (ग्राम प्रति डेसीलीटर) यह दर्शाती हैं कि रक्त के एक निश्चित आयतन में पदार्थ की कितनी मात्रा मौजूद है। अलग-अलग प्रयोगशालाएँ अलग इकाइयों का उपयोग कर सकती हैं, इसलिए संख्या को हमेशा उसकी इकाई के साथ देखा जाता है।'
          : 'Laboratory units such as mg/dL (milligrams per deciliter) or g/dL (grams per deciliter) measure concentration—the amount of a substance in a given volume of blood. Because units differ between laboratories, values must always be interpreted alongside their specific units.',
      };
    }

    if (normalized.includes('range') || normalized.includes('सीमा') || normalized.includes('normal')) {
      return {
        isRefusal: false,
        responseText: isHi
          ? 'संदर्भ सीमा (Reference Range) उन मानों का समूह है जो स्वस्थ व्यक्तियों के एक बड़े समूह में सामान्य पाए जाते हैं। यदि कोई मान थोड़ा बाहर है, तो इसका यह मतलब नहीं कि कोई गंभीर समस्या है। आयु, लिंग, भोजन और समय जैसे कई कारक इस पर प्रभाव डालते हैं।'
          : 'A reference interval reflects the range of values observed in approximately 95% of a healthy population. Being slightly outside this range does not automatically indicate illness—factors like diet, hydration, physical exertion, and time of day frequently affect levels.',
      };
    }

    // Default grounded educational answer
    return {
      isRefusal: false,
      responseText: isHi
        ? `सारथी एआई आपकी रिपोर्ट के कुल ${reportContext.length} मापदंडों को समझता है। आप किसी भी विशिष्ट जांच (जैसे हीमोग्लोबिन, शुगर, प्लेटलेट्स) के बारे में पूछ सकते हैं।`
        : `SaarthiAI is currently referencing ${reportContext.length} laboratory parameters from your session. You can ask about what specific tests measure, what their units signify, or what questions to discuss with your doctor.`,
    };
  }
}
