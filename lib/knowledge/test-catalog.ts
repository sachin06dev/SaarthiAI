import { CuratedTestDefinition, TestCategory } from '../types/test.types';

/**
 * SaarthiAI Canonical Test Knowledge Catalogue
 * Strictly covers the 6 MVP categories + standard categorical laboratory tests.
 * Educational definitions only; does NOT contain hardcoded diagnostic claims.
 */
export const CANONICAL_TEST_CATALOG: Record<string, CuratedTestDefinition> = {
  // ==========================================
  // 1. COMPLETE BLOOD COUNT (CBC)
  // ==========================================
  HEMOGLOBIN: {
    canonicalId: 'HEMOGLOBIN',
    displayName: 'Hemoglobin (Hb)',
    category: 'CBC',
    synonyms: [
      'hemoglobin',
      'haemoglobin',
      'hb',
      'hgb',
      'total hemoglobin',
      'blood hemoglobin',
      'heamoglobin',
    ],
    recognizedUnits: ['g/dL', 'g/L', 'gm/dl', 'gm%'],
    resultType: 'NUMERIC',
    descriptionEn:
      'Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from your lungs to tissues throughout your body.',
    descriptionHi:
      'हीमोग्लोबिन लाल रक्त कोशिकाओं में मौजूद एक महत्वपूर्ण प्रोटीन है जो फेफड़ों से शरीर के सभी अंगों तक ऑक्सीजन पहुंचाने का कार्य करता है।',
    clinicalContextEn:
      'Clinicians routinely check hemoglobin to screen for anemia, evaluate fatigue, and monitor overall red blood cell capacity.',
    clinicalContextHi:
      'चिकित्सक एनीमिया की जांच, अत्यधिक थकान के कारणों और रक्त में ऑक्सीजन ले जाने की क्षमता का मूल्यांकन करने के लिए हीमोग्लोबिन की जांच करते हैं।',
    educationalSources: [
      { title: 'MedlinePlus - Hemoglobin Test', url: 'https://medlineplus.gov/lab-tests/hemoglobin-test/' },
    ],
  },
  RBC_COUNT: {
    canonicalId: 'RBC_COUNT',
    displayName: 'Red Blood Cell Count (RBC)',
    category: 'CBC',
    synonyms: ['rbc', 'red blood cell count', 'erythrocyte count', 'total rbc count', 'rbc count'],
    recognizedUnits: ['million/mcL', '10^6/uL', '10^12/L', 'mil/uL', 'mill/cumm', 'x10^6/uL'],
    resultType: 'NUMERIC',
    descriptionEn: 'Measures the absolute number of red blood cells in a microliter of blood.',
    descriptionHi: 'यह रक्त के एक माइक्रोलीटर में लाल रक्त कोशिकाओं की कुल संख्या को मापता है।',
    clinicalContextEn: 'Used alongside hemoglobin to understand red cell volume and production.',
    clinicalContextHi: 'लाल रक्त कोशिकाओं के निर्माण और संतुलन को समझने के लिए इसका मूल्यांकन किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - RBC Count', url: 'https://medlineplus.gov/lab-tests/red-blood-cell-count/' }],
  },
  WBC_COUNT: {
    canonicalId: 'WBC_COUNT',
    displayName: 'Total Leukocyte / White Blood Cell Count (WBC / TLC)',
    category: 'CBC',
    synonyms: ['wbc', 'white blood cell count', 'total leukocyte count', 'tlc', 'white blood cells', 'leukocytes'],
    recognizedUnits: ['cells/mcL', '/uL', '10^3/uL', '10^9/L', '/cumm', 'cells/cumm'],
    resultType: 'NUMERIC',
    descriptionEn: 'Counts immune system white blood cells that defend the body against infection.',
    descriptionHi: 'यह श्वेत रक्त कोशिकाओं की गिनती करता है, जो संक्रमण और बीमारियों से शरीर की रक्षा करती हैं।',
    clinicalContextEn: 'Checked to detect infection, systemic inflammation, or immunological response.',
    clinicalContextHi: 'संक्रमण, शरीर में सूजन या प्रतिरक्षा प्रणाली की प्रतिक्रिया का पता लगाने के लिए इसकी जांच की जाती है।',
    educationalSources: [{ title: 'MedlinePlus - WBC Count', url: 'https://medlineplus.gov/lab-tests/wbc-count/' }],
  },
  PLATELET_COUNT: {
    canonicalId: 'PLATELET_COUNT',
    displayName: 'Platelet Count (Thrombocytes)',
    category: 'CBC',
    synonyms: ['platelet count', 'platelets', 'thrombocyte count', 'plt', 'total platelets', 'plt count'],
    recognizedUnits: ['10^3/uL', 'lakhs/cumm', '/mcL', '10^9/L', '/cumm', 'x10^3/uL'],
    resultType: 'NUMERIC',
    descriptionEn: 'Platelets are tiny cell fragments critical for normal blood clotting and stopping bleeding.',
    descriptionHi: 'प्लेटलेट्स रक्त के थक्के जमने और चोट लगने पर खून के बहाव को रोकने में मुख्य भूमिका निभाते हैं।',
    clinicalContextEn: 'Monitored in bleeding disorders, viral fevers (like dengue), or routine surgical workups.',
    clinicalContextHi: 'रक्तस्राव संबंधी विकारों या वायरल संक्रमण (जैसे डेंगू) के दौरान इसकी बारीकी से निगरानी की जाती है।',
    educationalSources: [{ title: 'MedlinePlus - Platelet Tests', url: 'https://medlineplus.gov/lab-tests/platelet-tests/' }],
  },
  HEMATOCRIT: {
    canonicalId: 'HEMATOCRIT',
    displayName: 'Hematocrit (PCV)',
    category: 'CBC',
    synonyms: ['hematocrit', 'haematocrit', 'pcv', 'packed cell volume', 'hct'],
    recognizedUnits: ['%', 'vol%'],
    resultType: 'NUMERIC',
    descriptionEn: 'The percentage of your total blood volume that consists of red blood cells.',
    descriptionHi: 'यह आपके कुल रक्त आयतन में लाल रक्त कोशिकाओं के प्रतिशत को दर्शाता है।',
    clinicalContextEn: 'Helps evaluate hydration status, blood concentration, and red cell mass.',
    clinicalContextHi: 'शरीर में पानी के स्तर (हाइड्रेशन) और लाल रक्त कोशिकाओं के घनत्व को समझने में सहायक है।',
    educationalSources: [{ title: 'MedlinePlus - Hematocrit', url: 'https://medlineplus.gov/lab-tests/hematocrit-test/' }],
  },
  MCV: {
    canonicalId: 'MCV',
    displayName: 'Mean Corpuscular Volume (MCV)',
    category: 'CBC',
    synonyms: ['mcv', 'mean corpuscular volume', 'mean cell volume'],
    recognizedUnits: ['fL', 'fl'],
    resultType: 'NUMERIC',
    descriptionEn: 'Measures the average physical size of individual red blood cells.',
    descriptionHi: 'यह लाल रक्त कोशिकाओं के औसत आकार को मापता है।',
    clinicalContextEn: 'Differentiates microcytic (small cell) from macrocytic (large cell) blood profiles.',
    clinicalContextHi: 'विटामिन बी12 या आयरन की कमी से जुड़े रक्त परिवर्तनों को समझने के लिए उपयोगी है।',
    educationalSources: [{ title: 'MedlinePlus - MCV', url: 'https://medlineplus.gov/lab-tests/mcv-test/' }],
  },
  MCH: {
    canonicalId: 'MCH',
    displayName: 'Mean Corpuscular Hemoglobin (MCH)',
    category: 'CBC',
    synonyms: ['mch', 'mean corpuscular hemoglobin', 'mean cell hemoglobin'],
    recognizedUnits: ['pg'],
    resultType: 'NUMERIC',
    descriptionEn: 'Calculates the average amount of hemoglobin inside a single red blood cell.',
    descriptionHi: 'यह एक लाल रक्त कोशिका के अंदर हीमोग्लोबिन की औसत मात्रा को दर्शाता है।',
    clinicalContextEn: 'Used together with MCV to characterize red cell hemoglobinization.',
    clinicalContextHi: 'कोशिकाओं में हीमोग्लोबिन की सघनता का आकलन करने के लिए प्रयोग किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - RBC Indices', url: 'https://medlineplus.gov/lab-tests/red-blood-cell-indices/' }],
  },
  MCHC: {
    canonicalId: 'MCHC',
    displayName: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
    category: 'CBC',
    synonyms: ['mchc', 'mean corpuscular hemoglobin concentration'],
    recognizedUnits: ['g/dL', '%', 'g/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'The average concentration of hemoglobin packed into a given volume of red blood cells.',
    descriptionHi: 'यह लाल रक्त कोशिकाओं के एक निश्चित आयतन में हीमोग्लोबिन की औसत सघनता को मापता है।',
    clinicalContextEn: 'Evaluates color saturation (hypochromia vs normochromia) in red cell populations.',
    clinicalContextHi: 'रक्त कोशिकाओं में रंग और सघनता का मूल्यांकन करने में सहायक है।',
    educationalSources: [{ title: 'MedlinePlus - RBC Indices', url: 'https://medlineplus.gov/lab-tests/red-blood-cell-indices/' }],
  },

  // ==========================================
  // 2. DIABETES & GLUCOSE METABOLISM
  // ==========================================
  FASTING_GLUCOSE: {
    canonicalId: 'FASTING_GLUCOSE',
    displayName: 'Fasting Blood Glucose (FBS)',
    category: 'DIABETES_GLUCOSE',
    synonyms: [
      'fasting blood sugar',
      'fasting blood glucose',
      'fbs',
      'fbg',
      'fasting plasma glucose',
      'glucose fasting',
      'blood sugar fasting',
      'sugar fasting',
    ],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'Measures circulating glucose after an overnight fast (typically 8 to 12 hours with only water).',
    descriptionHi:
      'यह 8 से 12 घंटे के उपवास (फास्टिंग) के बाद रक्त में शर्करा (ग्लूकोज) के स्तर को मापता है।',
    clinicalContextEn:
      'A primary baseline test for glucose homeostasis and carbohydrate metabolism evaluation.',
    clinicalContextHi:
      'शरीर में ग्लूकोज के संतुलन और मेटाबॉलिज्म की प्राथमिक स्थिति की जांच के लिए किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - Blood Glucose', url: 'https://medlineplus.gov/lab-tests/blood-glucose-test/' }],
  },
  RANDOM_GLUCOSE: {
    canonicalId: 'RANDOM_GLUCOSE',
    displayName: 'Random Blood Glucose (RBS)',
    category: 'DIABETES_GLUCOSE',
    synonyms: [
      'random blood sugar',
      'random blood glucose',
      'rbs',
      'rbg',
      'random plasma glucose',
      'glucose random',
      'blood sugar random',
      'sugar random',
    ],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'Measures blood glucose levels at any random time regardless of when you last ate.',
    descriptionHi: 'यह भोजन के समय की परवाह किए बिना किसी भी समय रक्त शर्करा के स्तर को मापता है।',
    clinicalContextEn: 'Used for quick evaluations of immediate glucose balance.',
    clinicalContextHi: 'शरीर में तात्कालिक शर्करा स्तर की तुरंत जांच के लिए किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - Blood Glucose', url: 'https://medlineplus.gov/lab-tests/blood-glucose-test/' }],
  },
  HBA1C: {
    canonicalId: 'HBA1C',
    displayName: 'Glycated Hemoglobin (HbA1c)',
    category: 'DIABETES_GLUCOSE',
    synonyms: [
      'hba1c',
      'glycated hemoglobin',
      'glycosylated hemoglobin',
      'a1c',
      'hemoglobin a1c',
      'glycohemoglobin',
    ],
    recognizedUnits: ['%', 'mmol/mol'],
    resultType: 'NUMERIC',
    descriptionEn:
      'Reflects your average blood sugar concentration over the past 2 to 3 months by measuring glucose bound to hemoglobin.',
    descriptionHi:
      'यह पिछले 2 से 3 महीनों के औसत रक्त शर्करा स्तर को दर्शाता है, जो हीमोग्लोबिन से जुड़े ग्लूकोज को मापता है।',
    clinicalContextEn:
      'Provides a long-term glycemic overview that is unaffected by recent meal fluctuations.',
    clinicalContextHi:
      'यह हाल के भोजन के उतार-चढ़ाव से प्रभावित हुए बिना दीर्घकालिक शर्करा नियंत्रण की स्पष्ट तस्वीर देता है।',
    educationalSources: [{ title: 'MedlinePlus - HbA1c', url: 'https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/' }],
  },

  // ==========================================
  // 3. LIVER FUNCTION PANEL (LFT)
  // ==========================================
  ALT_SGPT: {
    canonicalId: 'ALT_SGPT',
    displayName: 'Alanine Aminotransferase (ALT / SGPT)',
    category: 'LIVER',
    synonyms: [
      'sgpt',
      'alt',
      'alanine aminotransferase',
      'alanine transaminase',
      'alt (sgpt)',
      'sgpt (alt)',
      'serum glutamic pyruvic transaminase',
    ],
    recognizedUnits: ['U/L', 'IU/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'An enzyme found predominantly in liver cells that assists in cellular energy production.',
    descriptionHi: 'यह मुख्य रूप से लिवर कोशिकाओं में पाया जाने वाला एंजाइम है जो ऊर्जा निर्माण में मदद करता है।',
    clinicalContextEn:
      'When liver cells experience stress or irritation, ALT is released into circulation, making it a sensitive marker.',
    clinicalContextHi:
      'लिवर कोशिकाओं पर किसी भी प्रकार के तनाव या सूजन की स्थिति में यह एंजाइम रक्त में बढ़ सकता है।',
    educationalSources: [{ title: 'MedlinePlus - ALT Blood Test', url: 'https://medlineplus.gov/lab-tests/alanine-aminotransferase-alt-blood-test/' }],
  },
  AST_SGOT: {
    canonicalId: 'AST_SGOT',
    displayName: 'Aspartate Aminotransferase (AST / SGOT)',
    category: 'LIVER',
    synonyms: [
      'sgot',
      'ast',
      'aspartate aminotransferase',
      'aspartate transaminase',
      'ast (sgot)',
      'sgot (ast)',
      'serum glutamic oxaloacetic transaminase',
    ],
    recognizedUnits: ['U/L', 'IU/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'An enzyme present in the liver, heart muscles, skeletal muscles, and kidney tissues.',
    descriptionHi: 'यह एंजाइम लिवर के साथ-साथ हृदय और मांसपेशियों के ऊतकों में भी मौजूद होता है।',
    clinicalContextEn: 'Often compared with ALT to give clinicians broader insight into hepatic and muscle health.',
    clinicalContextHi: 'लिवर स्वास्थ्य की समग्र समझ के लिए डॉक्टर अक्सर एएलटी के साथ इसका मिलान करते हैं।',
    educationalSources: [{ title: 'MedlinePlus - AST Blood Test', url: 'https://medlineplus.gov/lab-tests/aspartate-aminotransferase-ast-test/' }],
  },
  ALP: {
    canonicalId: 'ALP',
    displayName: 'Alkaline Phosphatase (ALP)',
    category: 'LIVER',
    synonyms: ['alp', 'alkaline phosphatase', 'alk phos'],
    recognizedUnits: ['U/L', 'IU/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'An enzyme concentrated in the bile ducts of the liver and in active bone tissue.',
    descriptionHi: 'यह एंजाइम लिवर की पित्त नलिकाओं और हड्डियों के ऊतकों में पाया जाता है।',
    clinicalContextEn: 'Assists in assessing biliary flow and bone turnover.',
    clinicalContextHi: 'पित्त नली के प्रवाह और हड्डियों के स्वास्थ्य के मूल्यांकन में सहायता करता है।',
    educationalSources: [{ title: 'MedlinePlus - ALP', url: 'https://medlineplus.gov/lab-tests/alkaline-phosphatase/' }],
  },
  BILIRUBIN_TOTAL: {
    canonicalId: 'BILIRUBIN_TOTAL',
    displayName: 'Total Bilirubin',
    category: 'LIVER',
    synonyms: ['total bilirubin', 'bilirubin total', 'serum bilirubin total', 't. bilirubin', 'bilirubin (total)'],
    recognizedUnits: ['mg/dL', 'umol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'A yellow pigment produced during the natural breakdown of aged red blood cells, processed by the liver.',
    descriptionHi:
      'यह पुरानी लाल रक्त कोशिकाओं के स्वाभाविक टूटने से बनने वाला पीला वर्णक है जिसे लिवर प्रोसेस करता है।',
    clinicalContextEn: 'Checked to evaluate liver processing and clearance of red cell byproducts.',
    clinicalContextHi: 'लिवर द्वारा रक्त अपशिष्ट को साफ़ करने की क्षमता की जांच के लिए मापा जाता है।',
    educationalSources: [{ title: 'MedlinePlus - Bilirubin', url: 'https://medlineplus.gov/lab-tests/bilirubin-blood-test/' }],
  },
  ALBUMIN: {
    canonicalId: 'ALBUMIN',
    displayName: 'Albumin',
    category: 'LIVER',
    synonyms: ['albumin', 'serum albumin', 's. albumin'],
    recognizedUnits: ['g/dL', 'g/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'The most abundant protein synthesized by the liver, preventing fluid from leaking out of blood vessels.',
    descriptionHi:
      'यह लिवर द्वारा निर्मित प्रमुख प्रोटीन है जो रक्त वाहिकाओं से तरल पदार्थ को बाहर रिसने से रोकता है।',
    clinicalContextEn: 'Used to understand liver synthetic capacity and nutritional protein balance.',
    clinicalContextHi: 'लिवर द्वारा प्रोटीन निर्माण और पोषण स्थिति का मूल्यांकन करने के लिए उपयोगी है।',
    educationalSources: [{ title: 'MedlinePlus - Albumin', url: 'https://medlineplus.gov/lab-tests/albumin-blood-test/' }],
  },

  // ==========================================
  // 4. KIDNEY FUNCTION PANEL (KFT)
  // ==========================================
  CREATININE: {
    canonicalId: 'CREATININE',
    displayName: 'Serum Creatinine',
    category: 'KIDNEY',
    synonyms: [
      'creatinine',
      'serum creatinine',
      'blood creatinine',
      's. creatinine',
      'creat',
      'creatinine serum',
    ],
    recognizedUnits: ['mg/dL', 'umol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'A natural waste product of muscle contraction that healthy kidneys filter out of the bloodstream continuously.',
    descriptionHi:
      'यह मांसपेशियों की क्रिया से उत्पन्न होने वाला स्वाभाविक अपशिष्ट उत्पाद है जिसे स्वस्थ गुर्दे (किडनी) रक्त से बाहर निकालते हैं।',
    clinicalContextEn:
      'The foundational marker for assessing kidney filtration efficiency and estimating GFR.',
    clinicalContextHi:
      'गुर्दे की कार्यक्षमता और रक्त शोधन क्षमता की जांच के लिए यह सबसे मुख्य मानक है।',
    educationalSources: [{ title: 'MedlinePlus - Creatinine', url: 'https://medlineplus.gov/lab-tests/creatinine-test/' }],
  },
  UREA_BUN: {
    canonicalId: 'UREA_BUN',
    displayName: 'Blood Urea / BUN',
    category: 'KIDNEY',
    synonyms: ['blood urea', 'urea', 'blood urea nitrogen', 'bun', 'serum urea', 's. urea'],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'A waste product formed in the liver when protein is metabolized, then excreted by the kidneys.',
    descriptionHi:
      'प्रोटीन के पाचन के बाद लिवर में बनने वाला अपशिष्ट उत्पाद जो गुर्दों के माध्यम से शरीर से बाहर निकलता है।',
    clinicalContextEn: 'Evaluates kidney excretion and can be influenced by protein intake and hydration.',
    clinicalContextHi: 'गुर्दे के अपशिष्ट निष्कासन और शरीर में पानी के संतुलन का आकलन करने में मदद करता है।',
    educationalSources: [{ title: 'MedlinePlus - BUN', url: 'https://medlineplus.gov/lab-tests/bun-blood-urea-nitrogen-test/' }],
  },
  EGFR: {
    canonicalId: 'EGFR',
    displayName: 'Estimated Glomerular Filtration Rate (eGFR)',
    category: 'KIDNEY',
    synonyms: ['egfr', 'gfr', 'estimated gfr', 'estimated glomerular filtration rate'],
    recognizedUnits: ['mL/min/1.73m2', 'mL/min'],
    resultType: 'NUMERIC',
    descriptionEn:
      'A calculated estimate of how many milliliters of blood your kidneys clean per minute, based on creatinine.',
    descriptionHi:
      'यह एक गणना है जो दर्शाती है कि आपके गुर्दे प्रति मिनट कितने मिलीलीटर रक्त को साफ़ कर रहे हैं।',
    clinicalContextEn: 'Provides a standardized measure of functional renal clearance stage.',
    clinicalContextHi: 'गुर्दे के समग्र कार्य स्तर को मानकीकृत तरीके से समझने के लिए प्रयोग किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - eGFR', url: 'https://medlineplus.gov/lab-tests/glomerular-filtration-rate-gfr-test/' }],
  },

  // ==========================================
  // 5. THYROID PROFILE
  // ==========================================
  TSH: {
    canonicalId: 'TSH',
    displayName: 'Thyroid Stimulating Hormone (TSH)',
    category: 'THYROID',
    synonyms: [
      'tsh',
      'thyroid stimulating hormone',
      'thyrotropin',
      'serum tsh',
      'ultrasensitive tsh',
      '3rd gen tsh',
    ],
    recognizedUnits: ['uIU/mL', 'mIU/L', 'uU/mL'],
    resultType: 'NUMERIC',
    descriptionEn:
      'A pituitary hormone that signals your thyroid gland to produce and release thyroid hormones.',
    descriptionHi:
      'पिट्यूटरी ग्रंथि द्वारा स्रावित हार्मोन जो थायरॉइड ग्रंथि को थायरॉइड हार्मोन बनाने का संकेत देता है।',
    clinicalContextEn:
      'The most sensitive first-line screening parameter for thyroid gland regulation.',
    clinicalContextHi:
      'थायरॉइड ग्रंथि की कार्यप्रणाली और संतुलन की जांच के लिए सबसे संवेदनशील प्राथमिक टेस्ट।',
    educationalSources: [{ title: 'MedlinePlus - TSH', url: 'https://medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/' }],
  },
  TOTAL_T3: {
    canonicalId: 'TOTAL_T3',
    displayName: 'Total Triiodothyronine (T3)',
    category: 'THYROID',
    synonyms: ['total t3', 't3 total', 'triiodothyronine total', 't3'],
    recognizedUnits: ['ng/dL', 'nmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'Measures total circulating triiodothyronine (both bound to proteins and free).',
    descriptionHi: 'यह रक्त में मौजूद कुल ट्राईआयोडोथायरोनिन (T3) हार्मोन को मापता है।',
    clinicalContextEn: 'Evaluates active metabolic thyroid hormone availability.',
    clinicalContextHi: 'शरीर की चयापचय (मेटाबॉलिक) गति को प्रभावित करने वाले हार्मोन का स्तर जांचता है।',
    educationalSources: [{ title: 'MedlinePlus - T3', url: 'https://medlineplus.gov/lab-tests/t3-test/' }],
  },
  TOTAL_T4: {
    canonicalId: 'TOTAL_T4',
    displayName: 'Total Thyroxine (T4)',
    category: 'THYROID',
    synonyms: ['total t4', 't4 total', 'thyroxine total', 't4'],
    recognizedUnits: ['ug/dL', 'nmol/L', 'mcg/dL'],
    resultType: 'NUMERIC',
    descriptionEn: 'Measures the total amount of thyroxine produced by the thyroid gland.',
    descriptionHi: 'यह थायरॉइड ग्रंथि द्वारा उत्पादित कुल थायरोक्सिन (T4) की मात्रा को मापता है।',
    clinicalContextEn: 'Provides an overview of thyroid hormone output alongside TSH.',
    clinicalContextHi: 'थायरॉइड ग्रंथि के कुल हार्मोन उत्पादन का समग्र दृश्य प्रदान करता है।',
    educationalSources: [{ title: 'MedlinePlus - T4', url: 'https://medlineplus.gov/lab-tests/t4-test/' }],
  },
  FREE_T3: {
    canonicalId: 'FREE_T3',
    displayName: 'Free T3 (FT3)',
    category: 'THYROID',
    synonyms: ['free t3', 'ft3', 'free triiodothyronine'],
    recognizedUnits: ['pg/mL', 'pmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'The unbound, biologically active form of T3 available directly to body tissues.',
    descriptionHi: 'T3 हार्मोन का वह सक्रिय रूप जो प्रोटीन से बंधा नहीं होता और सीधे ऊतकों के लिए उपलब्ध होता है।',
    clinicalContextEn: 'Unaffected by carrier protein variations in blood.',
    clinicalContextHi: 'रक्त प्रोटीन में बदलाव से अप्रभावित रहने वाला सक्रिय हार्मोन माप।',
    educationalSources: [{ title: 'MedlinePlus - T3', url: 'https://medlineplus.gov/lab-tests/t3-test/' }],
  },
  FREE_T4: {
    canonicalId: 'FREE_T4',
    displayName: 'Free T4 (FT4)',
    category: 'THYROID',
    synonyms: ['free t4', 'ft4', 'free thyroxine'],
    recognizedUnits: ['ng/dL', 'pmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'The active, unbound form of thyroxine directly available to cells.',
    descriptionHi: 'थायरोक्सिन का सक्रिय रूप जो कोशिकाओं द्वारा सीधे उपयोग किया जाता है।',
    clinicalContextEn: 'Interpreted in tandem with TSH for refined thyroid axis assessment.',
    clinicalContextHi: 'थायरॉइड स्वास्थ्य के सटीक विश्लेषण के लिए टीएसएच के साथ इसका अध्ययन किया जाता है।',
    educationalSources: [{ title: 'MedlinePlus - T4', url: 'https://medlineplus.gov/lab-tests/t4-test/' }],
  },

  // ==========================================
  // 6. LIPID PROFILE
  // ==========================================
  TOTAL_CHOLESTEROL: {
    canonicalId: 'TOTAL_CHOLESTEROL',
    displayName: 'Total Cholesterol',
    category: 'LIPID_PROFILE',
    synonyms: ['total cholesterol', 'cholesterol total', 'cholesterol', 'serum cholesterol'],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'The cumulative sum of all cholesterol subtypes circulating in your blood.',
    descriptionHi: 'यह आपके रक्त में प्रवाहित होने वाले सभी प्रकार के कोलेस्ट्रॉल का कुल योग है।',
    clinicalContextEn: 'A component of cardiovascular risk profile screening.',
    clinicalContextHi: 'हृदय और रक्त वाहिकाओं के समग्र स्वास्थ्य आकलन का एक हिस्सा है।',
    educationalSources: [{ title: 'MedlinePlus - Cholesterol', url: 'https://medlineplus.gov/lab-tests/cholesterol-levels/' }],
  },
  HDL_CHOLESTEROL: {
    canonicalId: 'HDL_CHOLESTEROL',
    displayName: 'HDL Cholesterol (High-Density Lipoprotein)',
    category: 'LIPID_PROFILE',
    synonyms: ['hdl', 'hdl cholesterol', 'high density lipoprotein', 'hdl-c', 'hdl-cholesterol'],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'Often called "good cholesterol," HDL transports excess cholesterol from tissues back to the liver for clearance.',
    descriptionHi:
      'इसे अक्सर "अच्छा कोलेस्ट्रॉल" कहा जाता है, क्योंकि यह अतिरिक्त कोलेस्ट्रॉल को लिवर में वापस भेजकर साफ़ करने में मदद करता है।',
    clinicalContextEn: 'Higher relative levels are generally associated with protective cardiovascular transport.',
    clinicalContextHi: 'शरीर में रक्त वाहिकाओं की सुरक्षा के लिए इसका उचित स्तर लाभदायक माना जाता है।',
    educationalSources: [{ title: 'MedlinePlus - HDL', url: 'https://medlineplus.gov/lab-tests/hdl-cholesterol/' }],
  },
  LDL_CHOLESTEROL: {
    canonicalId: 'LDL_CHOLESTEROL',
    displayName: 'LDL Cholesterol (Low-Density Lipoprotein)',
    category: 'LIPID_PROFILE',
    synonyms: ['ldl', 'ldl cholesterol', 'low density lipoprotein', 'ldl-c', 'ldl-cholesterol'],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn:
      'Lipoprotein particles that carry cholesterol to cells; elevated circulating levels can accumulate in arterial walls.',
    descriptionHi:
      'यह कोशिकाओं तक कोलेस्ट्रॉल ले जाता है; अधिक मात्रा में होने पर यह धमनियों की दीवारों में जमा हो सकता है।',
    clinicalContextEn: 'Monitored as an actionable target in cardiovascular risk management.',
    clinicalContextHi: 'हृदय स्वास्थ्य की सुरक्षा और जीवनशैली प्रबंधन के लिए इसकी नियमित जांच की जाती है।',
    educationalSources: [{ title: 'MedlinePlus - LDL', url: 'https://medlineplus.gov/lab-tests/ldl-cholesterol/' }],
  },
  TRIGLYCERIDES: {
    canonicalId: 'TRIGLYCERIDES',
    displayName: 'Serum Triglycerides',
    category: 'LIPID_PROFILE',
    synonyms: ['triglycerides', 'serum triglycerides', 'tg', 'triglyceride'],
    recognizedUnits: ['mg/dL', 'mmol/L'],
    resultType: 'NUMERIC',
    descriptionEn: 'The most common type of storage fat in the body, derived from dietary fats and excess calories.',
    descriptionHi: 'यह शरीर में वसा (फैट) का सबसे आम रूप है, जो भोजन और अतिरिक्त कैलोरी से बनता है।',
    clinicalContextEn: 'Reflects dietary fat clearance, caloric surplus, and metabolic energy handling.',
    clinicalContextHi: 'यह भोजन से वसा के पाचन और मेटाबॉलिक ऊर्जा संतुलन को दर्शाता है।',
    educationalSources: [{ title: 'MedlinePlus - Triglycerides', url: 'https://medlineplus.gov/lab-tests/triglycerides-test/' }],
  },

  // ==========================================
  // CATEGORICAL LABORATORY TESTS (Blood Group, Viral Markers)
  // Non-negotiable rule: Must NOT be coerced to numbers
  // ==========================================
  BLOOD_GROUP_ABO_RH: {
    canonicalId: 'BLOOD_GROUP_ABO_RH',
    displayName: 'Blood Group & Rh Type',
    category: 'CBC',
    synonyms: ['blood group', 'abo blood group', 'blood group and rh', 'rh factor', 'abo & rh type'],
    recognizedUnits: [''],
    resultType: 'CATEGORICAL',
    descriptionEn: 'Identifies the presence or absence of specific A, B, and Rh antigen markers on your red blood cells.',
    descriptionHi: 'यह लाल रक्त कोशिकाओं पर मौजूद ए, बी और आरएच (Rh) एंटीजन प्रकार की पहचान करता है।',
    clinicalContextEn: 'Essential for blood transfusion safety, surgical preparation, and pregnancy care.',
    clinicalContextHi: 'रक्त आधान (ब्लड ट्रांसफ्यूजन), सर्जरी और गर्भावस्था के दौरान सुरक्षा के लिए अत्यंत महत्वपूर्ण है।',
    educationalSources: [{ title: 'MedlinePlus - Blood Typing', url: 'https://medlineplus.gov/lab-tests/blood-typing/' }],
  },
};
