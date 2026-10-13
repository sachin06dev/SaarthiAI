import { CandidateExtractionRow } from '../types/report.types';
import { ParameterExplanation } from '../types/test.types';
import { CANONICAL_TEST_CATALOG } from '../knowledge/test-catalog';

/**
 * Service generating grounded explanations and neutral doctor questions
 * based on verified laboratory parameters and curated test definitions.
 */
export function generateGroundedExplanation(
  param: CandidateExtractionRow,
  language: 'en' | 'hi' = 'en'
): ParameterExplanation {
  const isHi = language === 'hi';
  const def = CANONICAL_TEST_CATALOG[param.canonicalId];
  const testDisplayName = def?.displayName || param.rawTestName;

  const valueStr = param.resultType === 'CATEGORICAL'
    ? param.parsedCategoricalValue || param.rawValueText
    : `${param.parsedNumericValue ?? param.rawValueText} ${param.parsedUnit}`;

  const rangeStr = param.referenceRangeOrigin.rawRangeText
    ? `${param.referenceRangeOrigin.rawRangeText} ${param.referenceRangeOrigin.unit}`
    : isHi ? 'कोई संदर्भ सीमा दर्ज नहीं' : 'No reference range on report';

  // Description
  const whatItMeasures = isHi
    ? def?.descriptionHi || `${testDisplayName} शरीर में महत्वपूर्ण जैविक क्रियाओं की स्थिति को दर्शाता है।`
    : def?.descriptionEn || `${testDisplayName} evaluates biological function and chemical balance in the body.`;

  // Contextual status explanation
  let rangeContext = '';
  switch (param.comparisonStatus) {
    case 'IN_RANGE':
      rangeContext = isHi
        ? `यह परिणाम आपकी रिपोर्ट पर दी गई सामान्य संदर्भ सीमा (${rangeStr}) के भीतर दर्ज किया गया है।`
        : `This result is within the applicable reference interval (${rangeStr}).`;
      break;
    case 'ABOVE_RANGE':
      rangeContext = isHi
        ? `यह परिणाम सामान्य संदर्भ सीमा (${rangeStr}) से अधिक है। दैनिक आहार, निर्जलीकरण, शारीरिक तनाव या अन्य जैविक कारण इस पर प्रभाव डाल सकते हैं।`
        : `This result is above the reference interval (${rangeStr}). Dietary factors, hydration, or temporary physiological variation may influence this.`;
      break;
    case 'BELOW_RANGE':
      rangeContext = isHi
        ? `यह परिणाम सामान्य संदर्भ सीमा (${rangeStr}) से कम है।`
        : `This result is below the reference interval (${rangeStr}).`;
      break;
    case 'UNIT_MISMATCH':
      rangeContext = isHi
        ? 'इस रिपोर्ट की इकाई और सत्यापित संदर्भ सीमा की इकाई में भिन्नता है। भ्रामक व्याख्या से बचने के लिए तुलना रोकी गई है।'
        : 'The unit reported differs from the verified reference database unit. Direct comparison was safely withheld to avoid inaccurate conclusions.';
      break;
    case 'NO_VERIFIED_RANGE':
      rangeContext = isHi
        ? 'इस विशिष्ट जांच के लिए कोई सत्यापित संदर्भ सीमा उपलब्ध नहीं है। कृपया अपने चिकित्सक से सलाह लें।'
        : 'No verified applicable reference range was found for this specific analyte and population. Numeric classification safely withheld.';
      break;
    case 'CATEGORICAL_REVIEW':
      rangeContext = isHi
        ? `यह एक गुणात्मक वर्गीकरण (${valueStr}) है। इसे संख्यात्मक नियमों में नहीं बदला जा सकता और इसकी व्याख्या डॉक्टर द्वारा की जानी चाहिए।`
        : `This is a qualitative categorical result (${valueStr}). It is not converted to numbers and should be reviewed directly with your doctor.`;
      break;
    default:
      rangeContext = isHi
        ? 'इस परिणाम की पुष्टि डॉक्टर से परामर्श के दौरान की जानी चाहिए।'
        : 'This result requires clinical review alongside your medical history.';
  }

  // Neutral doctor questions
  const neutralDoctorQuestions = isHi
    ? [
        `डॉक्टर साहब, मेरे ${testDisplayName} (${valueStr}) का मेरे वर्तमान स्वास्थ्य के संदर्भ में क्या महत्व है?`,
        `क्या इस परिणाम की पुष्टि के लिए जीवनशैली में बदलाव या किसी निश्चित समय बाद दोबारा जांच की सलाह दी जाती है?`,
      ]
    : [
        `Doctor, how does this ${testDisplayName} level (${valueStr}) relate to my current health profile?`,
        `Do you recommend any confirmatory follow-up tests or specific lifestyle precautions based on this?`,
      ];

  const limitationsNote = isHi
    ? 'शैक्षिक सारांश: यह कोई चिकित्सा निदान या दवा की सिफारिश नहीं है। केवल अपने डॉक्टर से परामर्श करें।'
    : 'Educational summary only. Not a medical diagnosis or prescription. Always consult a licensed healthcare professional.';

  return {
    canonicalId: param.canonicalId,
    testName: testDisplayName,
    whatItMeasures,
    reportedResultSummary: `${testDisplayName}: ${valueStr}`,
    rangeContext,
    neutralDoctorQuestions,
    limitationsNote,
  };
}
