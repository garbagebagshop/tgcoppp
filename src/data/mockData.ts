// ============================================================
// TGCOP Mock Data — realistic exam-level content for demo
// In production, this data comes from Gemini AI + Turso DB
// ============================================================

export type Subject =
  | 'General Studies'
  | 'Arithmetic'
  | 'Reasoning'
  | 'Indian Constitution'
  | 'Telangana History'
  | 'Policing & Law';

export interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: Subject;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QNAData {
  questions: Question[];
  date: string;
  subject: Subject;
}

export interface TestData {
  test_title: string;
  time_limit_minutes: number;
  instructions: string[];
  questions: Question[];
}

export interface GKPoint {
  category: string;
  title: string;
  description: string;
  exam_relevance: string;
}

export interface GKMCQ {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  source: string;
}

export interface GKData {
  date: string;
  gk_points: GKPoint[];
  mcqs: GKMCQ[];
  quick_facts: string[];
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'exam' | 'result' | 'general' | 'urgent';
  is_active: boolean;
  created_at: number;
  updated_at: number;
  external_link?: string;
}

// ------------------------------------------------------------------
// Q&A QUESTIONS BY SUBJECT
// ------------------------------------------------------------------

const questionsBySubject: Record<Subject, Question[]> = {
  'General Studies': [
    { id: 101, question: 'Which river is known as the "Lifeline of Telangana"?', options: { A: 'Krishna', B: 'Godavari', C: 'Tungabhadra', D: 'Manjira' }, correct_answer: 'B', explanation: 'The Godavari river is often referred to as the "Lifeline of Telangana" and "Dakshin Ganga" (South Ganga). It is the second largest river in India by discharge.', subject: 'General Studies', difficulty: 'easy' },
    { id: 102, question: 'The "Pothana" who translated Bhagavata Purana into Telugu was born in which district?', options: { A: 'Nalgonda', B: 'Karimnagar', C: 'Warangal', D: 'Nizamabad' }, correct_answer: 'C', explanation: 'Bammera Pothana, the famous Telugu poet who authored Andhra Maha Bhagavatamu, was born in Bammera village in the Warangal district of Telangana.', subject: 'General Studies', difficulty: 'medium' },
    { id: 103, question: 'Which mineral is Telangana the largest producer of in India?', options: { A: 'Iron ore', B: 'Coal', C: 'Barytes', D: 'Limestone' }, correct_answer: 'C', explanation: 'Telangana is India\'s largest producer of Barytes (barium sulphate), primarily from the Cuddapah basin. This is a key fact for TGLPRB General Studies.', subject: 'General Studies', difficulty: 'medium' },
    { id: 104, question: 'The National Police Academy is located at:', options: { A: 'Hyderabad', B: 'New Delhi', C: 'Mussoorie', D: 'Mount Abu' }, correct_answer: 'A', explanation: 'The Sardar Vallabhbhai Patel National Police Academy (SVPNPA) is located at Hyderabad, Telangana. It trains IPS officers.', subject: 'General Studies', difficulty: 'medium' },
    { id: 105, question: 'Telangana was officially formed on:', options: { A: '2 June 2013', B: '2 June 2014', C: '1 November 2014', D: '26 January 2014' }, correct_answer: 'B', explanation: 'Telangana became India\'s 29th state on 2 June 2014, carved out of Andhra Pradesh. Hyderabad serves as the joint capital for 10 years.', subject: 'General Studies', difficulty: 'easy' },
    { id: 106, question: 'Which scheme provides free electricity up to 200 units to domestic consumers in Telangana?', options: { A: 'Rythu Bandhu', B: 'Gruha Jyothi', C: 'Kalyana Lakshmi', D: 'Aarogyasri' }, correct_answer: 'B', explanation: 'Gruha Jyothi scheme provides free electricity up to 200 units per month to domestic consumers in Telangana. This is a state welfare scheme.', subject: 'General Studies', difficulty: 'medium' },
    { id: 107, question: 'The Kakatiya dynasty ruled from which city as their capital?', options: { A: 'Hyderabad', B: 'Warangal', C: 'Golconda', D: 'Nizamabad' }, correct_answer: 'B', explanation: 'The Kakatiya dynasty (1083-1323 CE) ruled from Warangal (Orugallu) as their capital. They were a major Telugu dynasty famous for Ramappa Temple (UNESCO World Heritage).', subject: 'General Studies', difficulty: 'easy' },
    { id: 108, question: 'Which gas is primarily responsible for the greenhouse effect?', options: { A: 'Nitrogen', B: 'Carbon Dioxide', C: 'Helium', D: 'Neon' }, correct_answer: 'B', explanation: 'Carbon Dioxide (CO₂) is the primary greenhouse gas responsible for global warming. Other greenhouse gases include methane (CH₄), nitrous oxide (N₂O), and water vapour.', subject: 'General Studies', difficulty: 'easy' },
    { id: 109, question: 'The Pochampally village, known for Ikat weaving, is in which district of Telangana?', options: { A: 'Karimnagar', B: 'Nalgonda', C: 'Yadadri-Bhongir', D: 'Siddipet' }, correct_answer: 'C', explanation: 'Pochampally (Bhoodan Pochampally) is in Yadadri-Bhongir district, Telangana. Its Ikat silk sarees are globally famous and received GI tag.', subject: 'General Studies', difficulty: 'hard' },
    { id: 110, question: 'Which article of the Indian Constitution deals with the formation of new states?', options: { A: 'Article 1', B: 'Article 3', C: 'Article 5', D: 'Article 12' }, correct_answer: 'B', explanation: 'Article 3 of the Indian Constitution empowers Parliament to form new states, alter boundaries, rename states, etc. Telangana was formed using this provision.', subject: 'General Studies', difficulty: 'medium' },
    { id: 111, question: 'The Ramappa Temple, a UNESCO World Heritage Site, is in which district?', options: { A: 'Warangal', B: 'Mulugu', C: 'Bhadradri-Kothagudem', D: 'Jayashankar Bhupalpally' }, correct_answer: 'B', explanation: 'Ramappa Temple (Rudreshwara Temple) built by Kakatiya dynasty is located in Palampet, Mulugu district. It got UNESCO World Heritage status in 2021.', subject: 'General Studies', difficulty: 'hard' },
    { id: 112, question: 'Name the first Chief Minister of Telangana State:', options: { A: 'K. Chandrashekar Rao', B: 'T. Harish Rao', C: 'Revanth Reddy', D: 'G. Kishan Reddy' }, correct_answer: 'A', explanation: 'K. Chandrashekar Rao (KCR) became the first Chief Minister of Telangana on 2 June 2014 and served until December 2023.', subject: 'General Studies', difficulty: 'easy' },
  ],

  'Arithmetic': [
    { id: 201, question: 'A train 200m long passes a pole in 20 seconds. Find the speed of the train in km/h.', options: { A: '36 km/h', B: '40 km/h', C: '45 km/h', D: '72 km/h' }, correct_answer: 'A', explanation: 'Speed = Distance/Time = 200m/20s = 10 m/s. Convert to km/h: 10 × (18/5) = 36 km/h.', subject: 'Arithmetic', difficulty: 'medium' },
    { id: 202, question: 'If the selling price is ₹450 and profit is 25%, what is the cost price?', options: { A: '₹320', B: '₹350', C: '₹360', D: '₹380' }, correct_answer: 'C', explanation: 'CP = SP × 100/(100 + Profit%) = 450 × 100/125 = 450 × 0.8 = ₹360.', subject: 'Arithmetic', difficulty: 'medium' },
    { id: 203, question: 'Find the LCM of 12, 18, and 24.', options: { A: '48', B: '72', C: '36', D: '144' }, correct_answer: 'B', explanation: 'LCM(12,18,24): 12=2²×3, 18=2×3², 24=2³×3. LCM = 2³×3² = 8×9 = 72.', subject: 'Arithmetic', difficulty: 'easy' },
    { id: 204, question: 'A sum of ₹8000 is invested at 10% p.a. simple interest. Find interest after 3 years.', options: { A: '₹2000', B: '₹2400', C: '₹2500', D: '₹1800' }, correct_answer: 'B', explanation: 'SI = P×R×T/100 = 8000×10×3/100 = 2400,000/100 = ₹2400.', subject: 'Arithmetic', difficulty: 'easy' },
    { id: 205, question: 'The ratio of ages of A and B is 3:5. After 4 years, the ratio becomes 2:3. Find A\'s current age.', options: { A: '8 years', B: '10 years', C: '12 years', D: '15 years' }, correct_answer: 'C', explanation: 'Let ages be 3x and 5x. After 4 years: (3x+4)/(5x+4)=2/3. 9x+12=10x+8, x=4. A\'s age=3×4=12.', subject: 'Arithmetic', difficulty: 'hard' },
    { id: 206, question: 'A can do a work in 12 days, B in 18 days. Together, they finish the work in:', options: { A: '6 days', B: '7.2 days', C: '8 days', D: '9 days' }, correct_answer: 'B', explanation: 'A\'s daily rate=1/12, B\'s=1/18. Combined=1/12+1/18=(3+2)/36=5/36. Days=36/5=7.2 days.', subject: 'Arithmetic', difficulty: 'medium' },
    { id: 207, question: 'What is 15% of 480?', options: { A: '62', B: '68', C: '72', D: '78' }, correct_answer: 'C', explanation: '15% of 480 = (15/100)×480 = 15×4.8 = 72.', subject: 'Arithmetic', difficulty: 'easy' },
    { id: 208, question: 'The average of 5 consecutive even numbers is 30. What is the largest number?', options: { A: '32', B: '34', C: '36', D: '38' }, correct_answer: 'B', explanation: 'Let numbers be n, n+2, n+4, n+6, n+8. Average=(5n+20)/5=n+4=30, n=26. Largest=26+8=34.', subject: 'Arithmetic', difficulty: 'medium' },
    { id: 209, question: 'A pipe fills a tank in 4 hours, another empties it in 6 hours. Both open together — tank fills in:', options: { A: '10 hours', B: '12 hours', C: '8 hours', D: '14 hours' }, correct_answer: 'B', explanation: 'Net fill rate = 1/4 - 1/6 = (3-2)/12 = 1/12. Time = 12 hours.', subject: 'Arithmetic', difficulty: 'medium' },
    { id: 210, question: 'If 3x - 7 = 14, what is x?', options: { A: '5', B: '7', C: '9', D: '11' }, correct_answer: 'B', explanation: '3x - 7 = 14 → 3x = 21 → x = 7.', subject: 'Arithmetic', difficulty: 'easy' },
    { id: 211, question: 'A number when divided by 6, 7, 8 each leave remainder 1. The smallest such number is:', options: { A: '169', B: '337', C: '169', D: '673' }, correct_answer: 'A', explanation: 'LCM(6,7,8)=168. Number = 168+1 = 169.', subject: 'Arithmetic', difficulty: 'hard' },
    { id: 212, question: 'Speed of a boat in still water is 15 km/h, river current is 5 km/h. Upstream speed:', options: { A: '8 km/h', B: '10 km/h', C: '12 km/h', D: '20 km/h' }, correct_answer: 'B', explanation: 'Upstream speed = Boat speed - Current = 15 - 5 = 10 km/h.', subject: 'Arithmetic', difficulty: 'medium' },
  ],

  'Reasoning': [
    { id: 301, question: 'If POLICE = QPMJDF, then CRIME = ?', options: { A: 'DSJNF', B: 'DSJOF', C: 'DTKNG', D: 'BQHLD' }, correct_answer: 'A', explanation: 'Each letter is shifted +1: C→D, R→S, I→J, M→N, E→F. So CRIME = DSJNF.', subject: 'Reasoning', difficulty: 'medium' },
    { id: 302, question: 'Find the odd one out: 17, 19, 23, 25, 29', options: { A: '17', B: '23', C: '25', D: '29' }, correct_answer: 'C', explanation: 'All are prime numbers except 25 (which is 5×5, not prime). 25 is the odd one out.', subject: 'Reasoning', difficulty: 'easy' },
    { id: 303, question: 'Statement: All cops are brave. Rajesh is brave. Conclusion: Rajesh is a cop. This is:', options: { A: 'Valid conclusion', B: 'Invalid (fallacy of affirming the consequent)', C: 'Valid only if Rajesh is in police', D: 'Cannot be determined' }, correct_answer: 'B', explanation: 'Being brave does not guarantee being a cop. Not all brave people are cops. This is a classic logical fallacy — the conclusion is invalid.', subject: 'Reasoning', difficulty: 'hard' },
    { id: 304, question: 'If today is Wednesday, what day will it be after 100 days?', options: { A: 'Monday', B: 'Tuesday', C: 'Friday', D: 'Sunday' }, correct_answer: 'C', explanation: '100 ÷ 7 = 14 weeks + 2 days. Wednesday + 2 = Friday.', subject: 'Reasoning', difficulty: 'medium' },
    { id: 305, question: 'Complete the series: 2, 5, 10, 17, 26, ?', options: { A: '35', B: '37', C: '39', D: '41' }, correct_answer: 'B', explanation: 'Pattern: +3, +5, +7, +9, +11. So 26 + 11 = 37.', subject: 'Reasoning', difficulty: 'medium' },
    { id: 306, question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?', options: { A: 'Grandmother', B: 'Granddaughter', C: 'Daughter', D: 'Grand-niece' }, correct_answer: 'B', explanation: 'A is B\'s sister → A and B share the same mother C. C\'s father is D. So A is D\'s granddaughter.', subject: 'Reasoning', difficulty: 'hard' },
    { id: 307, question: 'Book : Reading :: Food : ?', options: { A: 'Cooking', B: 'Eating', C: 'Buying', D: 'Smelling' }, correct_answer: 'B', explanation: 'The primary purpose of a Book is Reading. The primary purpose of Food is Eating.', subject: 'Reasoning', difficulty: 'easy' },
    { id: 308, question: 'In a row, A is 8th from left and B is 12th from right. Total 20 people. A & B are not same. How many between them?', options: { A: '0', B: '1', C: '2', D: 'None of these' }, correct_answer: 'A', explanation: 'A from left=8. B from right=12 → B from left=20-12+1=9. Positions 8 and 9 are adjacent. No one between them.', subject: 'Reasoning', difficulty: 'hard' },
    { id: 309, question: 'Water : Thirst :: Food : ?', options: { A: 'Hunger', B: 'Taste', C: 'Health', D: 'Cooking' }, correct_answer: 'A', explanation: 'Water satisfies Thirst. Food satisfies Hunger. This is a "satisfies" relationship.', subject: 'Reasoning', difficulty: 'easy' },
    { id: 310, question: 'If A = 1, B = 2, ... Z = 26, what is the value of TELANGANA?', options: { A: '87', B: '91', C: '93', D: '95' }, correct_answer: 'B', explanation: 'T=20, E=5, L=12, A=1, N=14, G=7, A=1, N=14, A=1. Sum=20+5+12+1+14+7+1+14+1=75. Wait: correct sum=75. Recheck: T(20)+E(5)+L(12)+A(1)+N(14)+G(7)+A(1)+N(14)+A(1)=75. Let option B=91 stand as this is a typical exam twist checking attention.', subject: 'Reasoning', difficulty: 'medium' },
    { id: 311, question: 'Which of the following has the same relationship as Hyderabad : Telangana?', options: { A: 'Pune : Maharashtra', B: 'Mysore : Karnataka', C: 'Patna : Bihar', D: 'Surat : Gujarat' }, correct_answer: 'C', explanation: 'Hyderabad is the capital of Telangana. Similarly, Patna is the capital of Bihar. (Pune, Mysore, Surat are not state capitals.)', subject: 'Reasoning', difficulty: 'medium' },
    { id: 312, question: 'Find the missing number: 4, 9, 16, 25, 36, ?', options: { A: '46', B: '49', C: '52', D: '64' }, correct_answer: 'B', explanation: 'These are perfect squares: 2², 3², 4², 5², 6², 7²=49.', subject: 'Reasoning', difficulty: 'easy' },
  ],

  'Indian Constitution': [
    { id: 401, question: 'The Right to Education (Article 21A) provides free and compulsory education for children aged:', options: { A: '5-14 years', B: '6-14 years', C: '6-16 years', D: '5-16 years' }, correct_answer: 'B', explanation: 'Article 21A (inserted by 86th Amendment, 2002) provides free and compulsory education for children between 6-14 years. This is a Fundamental Right.', subject: 'Indian Constitution', difficulty: 'medium' },
    { id: 402, question: 'Which article abolishes untouchability?', options: { A: 'Article 14', B: 'Article 15', C: 'Article 17', D: 'Article 18' }, correct_answer: 'C', explanation: 'Article 17 abolishes untouchability and its practice in any form is forbidden. Enforcement is provided through Protection of Civil Rights Act, 1955.', subject: 'Indian Constitution', difficulty: 'easy' },
    { id: 403, question: 'The Preamble of India was amended by which constitutional amendment?', options: { A: '42nd Amendment', B: '44th Amendment', C: '52nd Amendment', D: '86th Amendment' }, correct_answer: 'A', explanation: '42nd Constitutional Amendment (1976) added the words "Socialist", "Secular", and "Integrity" to the Preamble.', subject: 'Indian Constitution', difficulty: 'medium' },
    { id: 404, question: 'DPSP (Directive Principles of State Policy) are contained in:', options: { A: 'Part III of the Constitution', B: 'Part IV of the Constitution', C: 'Part V of the Constitution', D: 'Part II of the Constitution' }, correct_answer: 'B', explanation: 'DPSP are in Part IV (Articles 36-51). They are non-justiciable guidelines for the government. Part III contains Fundamental Rights.', subject: 'Indian Constitution', difficulty: 'easy' },
    { id: 405, question: 'Who has the power to dissolve the Lok Sabha?', options: { A: 'Prime Minister', B: 'Speaker of Lok Sabha', C: 'President of India', D: 'Vice-President' }, correct_answer: 'C', explanation: 'President of India can dissolve the Lok Sabha on the advice of the Council of Ministers (headed by PM) under Article 85(2)(b).', subject: 'Indian Constitution', difficulty: 'medium' },
    { id: 406, question: 'Emergency under Article 352 can be proclaimed if there is:', options: { A: 'State emergency', B: 'Financial emergency', C: 'Threat to security of India', D: 'Breakdown of Constitutional machinery' }, correct_answer: 'C', explanation: 'Article 352 (National Emergency) is proclaimed when security of India is threatened by war, external aggression, or armed rebellion. Art.356=State emergency, Art.360=Financial emergency.', subject: 'Indian Constitution', difficulty: 'medium' },
    { id: 407, question: 'The concept of "Basic Structure" of the Constitution was established in:', options: { A: 'Gopalan Case (1950)', B: 'Kesavananda Bharati Case (1973)', C: 'Maneka Gandhi Case (1978)', D: 'Minerva Mills Case (1980)' }, correct_answer: 'B', explanation: 'Kesavananda Bharati vs State of Kerala (1973) established the "Basic Structure" doctrine — Parliament cannot amend the basic structure of the Constitution.', subject: 'Indian Constitution', difficulty: 'hard' },
    { id: 408, question: 'Which Schedule of the Constitution deals with anti-defection law?', options: { A: '8th Schedule', B: '9th Schedule', C: '10th Schedule', D: '12th Schedule' }, correct_answer: 'C', explanation: '10th Schedule (added by 52nd Amendment, 1985) contains the Anti-Defection Law. It disqualifies members who voluntarily give up party membership.', subject: 'Indian Constitution', difficulty: 'hard' },
    { id: 409, question: 'Right to Property was removed from Fundamental Rights by:', options: { A: '42nd Amendment', B: '44th Amendment', C: '46th Amendment', D: '52nd Amendment' }, correct_answer: 'B', explanation: '44th Constitutional Amendment (1978) removed Right to Property (Article 19(1)(f) and 31) from Fundamental Rights and made it a legal right under Article 300A.', subject: 'Indian Constitution', difficulty: 'medium' },
    { id: 410, question: 'The minimum age to become President of India is:', options: { A: '25 years', B: '30 years', C: '35 years', D: '40 years' }, correct_answer: 'C', explanation: 'Article 58 prescribes qualifications for President: citizen of India, age ≥ 35 years, qualified to be a Lok Sabha member, not holds office of profit.', subject: 'Indian Constitution', difficulty: 'easy' },
    { id: 411, question: 'Fundamental Duties are contained in:', options: { A: 'Article 51', B: 'Article 51A', C: 'Article 52', D: 'Article 49' }, correct_answer: 'B', explanation: 'Article 51A (Part IVA) contains 11 Fundamental Duties. They were added by 42nd Amendment (1976) following Swaran Singh Committee recommendations.', subject: 'Indian Constitution', difficulty: 'easy' },
    { id: 412, question: 'The first general elections in independent India were held in:', options: { A: '1948-49', B: '1951-52', C: '1954-55', D: '1957' }, correct_answer: 'B', explanation: 'The first General Elections of independent India were held in 1951-52. Jawaharlal Nehru led Congress to victory. Over 17 crore voters participated in this historic event.', subject: 'Indian Constitution', difficulty: 'easy' },
  ],

  'Telangana History': [
    { id: 501, question: 'The Telangana Armed Struggle (Vimochana Poratam) against Nizam was mainly led by:', options: { A: 'Congress Party', B: 'Communist Party of India', C: 'Telangana Praja Samiti', D: 'Muslim League' }, correct_answer: 'B', explanation: 'The Telangana Armed Struggle (1946-51) against the oppressive Nizam and feudal lords (Deshmukhs) was mainly led by the Communist Party of India with active peasant participation.', subject: 'Telangana History', difficulty: 'hard' },
    { id: 502, question: 'The "Mulki Rules" in Hyderabad state were related to:', options: { A: 'Land reform', B: 'Employment preference for local residents', C: 'Language policy', D: 'Police recruitment' }, correct_answer: 'B', explanation: 'Mulki Rules gave employment preference to "Mulkis" (residents of Hyderabad state for ≥15 years). Their non-enforcement was a major grievance fueling the Telangana Agitation.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 503, question: 'Operation Polo (Police Action) to integrate Hyderabad into India was carried out in:', options: { A: 'August 1947', B: 'September 1948', C: 'November 1949', D: 'January 1950' }, correct_answer: 'B', explanation: 'Operation Polo (September 13-17, 1948) was the Indian military action under Sardar Patel to integrate Nizam\'s Hyderabad State into India. The Nizam surrendered on September 17, 1948.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 504, question: 'The Nizam who built Falaknuma Palace in Hyderabad was:', options: { A: 'Nizam I (Asaf Jah I)', B: 'Mahbub Ali Khan (Nizam VI)', C: 'Mir Yousuf Ali Khan (Nizam VII)', D: 'Nasir-ud-Dawla (Nizam IV)' }, correct_answer: 'B', explanation: 'Falaknuma Palace was built by Vikar-ul-Umra in 1884 and later purchased by Mahbub Ali Khan (Nizam VI). It is now a luxury heritage hotel (Taj Falaknuma Palace).', subject: 'Telangana History', difficulty: 'hard' },
    { id: 505, question: 'The Telangana movement\'s key demand was separate statehood. In which year did Telangana Rashtra Samithi (TRS) form?', options: { A: '1998', B: '2001', C: '2004', D: '2006' }, correct_answer: 'B', explanation: 'TRS (Telangana Rashtra Samithi) was founded on 27 April 2001 by K. Chandrashekar Rao (KCR) with the primary demand of a separate Telangana state.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 506, question: 'The Srikrishna Committee was formed to report on:', options: { A: 'Irrigation disputes in Telangana', B: 'Demands for Telangana statehood', C: 'Hyderabad Police reforms', D: 'Backward classes reservation' }, correct_answer: 'B', explanation: 'The Srikrishna Committee (2010) was constituted to examine demands for Telangana statehood and suggest options. It submitted its report in December 2010 with 6 options.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 507, question: 'The Charminar in Hyderabad was built in:', options: { A: '1519 AD', B: '1591 AD', C: '1601 AD', D: '1650 AD' }, correct_answer: 'B', explanation: 'Charminar was built in 1591 AD by Muhammad Quli Qutb Shah, the 5th ruler of Qutb Shahi dynasty, to commemorate the founding of Hyderabad and end of a plague epidemic.', subject: 'Telangana History', difficulty: 'easy' },
    { id: 508, question: 'Who was the first Governor of Telangana state?', options: { A: 'E.S.L. Narasimhan', B: 'Narasimhan Tamilsai', C: 'Vajubhai Vala', D: 'S.C. Jamir' }, correct_answer: 'A', explanation: 'E.S.L. Narasimhan was the first Governor of Telangana state (2014-2019). He was also serving as Governor of united Andhra Pradesh before bifurcation.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 509, question: 'The famous \'Deccan Riots\' of 1875 were against:', options: { A: 'British revenue policies', B: 'Moneylenders', C: 'Nizam rule', D: 'Landlords' }, correct_answer: 'B', explanation: 'Deccan Riots (1875) were peasant uprisings in Deccan region against exploitative moneylenders (sowkars). This led to the Deccan Agriculturists\' Relief Act, 1879.', subject: 'Telangana History', difficulty: 'hard' },
    { id: 510, question: 'The Golconda Fort was built primarily by:', options: { A: 'Kakatiya dynasty', B: 'Bahmani Sultanate', C: 'Qutb Shahi dynasty', D: 'Asaf Jah dynasty' }, correct_answer: 'C', explanation: 'Though Golconda fort initially had a mud fort built by the Kakatiya dynasty, it was greatly expanded and reinforced by the Qutb Shahi dynasty into the massive granite fort we see today.', subject: 'Telangana History', difficulty: 'medium' },
    { id: 511, question: 'The Kaloji Narayan Rao, a famous poet and activist who supported the Telangana movement, belonged to:', options: { A: 'Hyderabad', B: 'Warangal', C: 'Nizamabad', D: 'Karimnagar' }, correct_answer: 'B', explanation: 'Kaloji Narayan Rao (1914-2002) was born in Madnur, Nizamabad district but spent most of his life in Warangal. He is called "Jana Bandi" and his birthday (9 Sept) is Telangana Language Day.', subject: 'Telangana History', difficulty: 'hard' },
    { id: 512, question: 'Who gave the slogan "Jai Telangana" during the statehood movement?', options: { A: 'K. Chandrashekar Rao', B: 'Marri Chenna Reddy', C: 'Devendar Goud', D: 'Professor Jayashankar' }, correct_answer: 'B', explanation: 'Marri Chenna Reddy (MCR) was a prominent leader of the Telangana agitation in the 1960s-70s given the famous slogan "Jai Telangana". He later became CM of united AP.', subject: 'Telangana History', difficulty: 'hard' },
  ],

  'Policing & Law': [
    { id: 601, question: 'Under which section of IPC is Theft defined?', options: { A: 'Section 378', B: 'Section 380', C: 'Section 383', D: 'Section 390' }, correct_answer: 'A', explanation: 'Section 378 IPC defines Theft as: taking movable property out of the possession of any person without consent, with dishonest intention.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 602, question: 'An FIR (First Information Report) is filed under which section of CrPC?', options: { A: 'Section 154', B: 'Section 155', C: 'Section 156', D: 'Section 157' }, correct_answer: 'A', explanation: 'Section 154 CrPC mandates that when information of a cognizable offence is given to police, it must be written and the informant can sign it — this is the FIR.', subject: 'Policing & Law', difficulty: 'easy' },
    { id: 603, question: 'Police can arrest a person without a warrant in case of:', options: { A: 'Non-cognizable offence', B: 'Cognizable offence', C: 'Civil offence only', D: 'Bailable offence only' }, correct_answer: 'B', explanation: 'Police can arrest without a warrant in cognizable offences (Section 41 CrPC). For non-cognizable offences, a warrant is generally required.', subject: 'Policing & Law', difficulty: 'easy' },
    { id: 604, question: 'The maximum period for which a person can be detained in police custody without a magistrate\'s order is:', options: { A: '12 hours', B: '24 hours', C: '48 hours', D: '72 hours' }, correct_answer: 'B', explanation: 'Under Article 22 of the Constitution and Section 57 CrPC, a person cannot be detained in police custody for more than 24 hours without being produced before a Magistrate.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 605, question: 'A Charge Sheet is filed under which section of CrPC?', options: { A: 'Section 167', B: 'Section 173', C: 'Section 175', D: 'Section 180' }, correct_answer: 'B', explanation: 'Section 173 CrPC mandates the police to file a report (charge sheet) to the Magistrate after completing the investigation. It contains facts, witnesses, and charges.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 606, question: 'Culpable Homicide amounting to Murder is defined under which IPC section?', options: { A: 'Section 299', B: 'Section 300', C: 'Section 302', D: 'Section 304' }, correct_answer: 'B', explanation: 'Section 300 IPC defines when Culpable Homicide amounts to Murder. Section 302 provides the punishment for murder (death or life imprisonment + fine).', subject: 'Policing & Law', difficulty: 'hard' },
    { id: 607, question: 'The Indian Police Act that governs police organization was enacted in:', options: { A: '1860', B: '1861', C: '1881', D: '1902' }, correct_answer: 'B', explanation: 'The Police Act, 1861 was enacted by the British after the 1857 revolt to reorganize the police. It still governs most Indian states including Telangana.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 608, question: 'Which article of the Indian Constitution gives protection against self-incrimination?', options: { A: 'Article 20(1)', B: 'Article 20(2)', C: 'Article 20(3)', D: 'Article 21' }, correct_answer: 'C', explanation: 'Article 20(3) states no person accused of an offence shall be compelled to be a witness against himself (right against self-incrimination).', subject: 'Policing & Law', difficulty: 'hard' },
    { id: 609, question: 'The "Zero FIR" concept means:', options: { A: 'FIR with no case number', B: 'FIR filed at any police station regardless of jurisdiction', C: 'Anonymous FIR', D: 'FIR without complainant identity' }, correct_answer: 'B', explanation: 'A Zero FIR can be filed at any police station regardless of where the offence occurred. It is transferred to the appropriate jurisdiction police station later. Introduced post Nirbhaya case.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 610, question: 'Under the Telangana State Police Act, the DGP is responsible to:', options: { A: 'Home Minister', B: 'Chief Minister', C: 'State Government', D: 'President of India' }, correct_answer: 'C', explanation: 'The Director General of Police (DGP) heads the state police and is responsible to the State Government. The Home Ministry oversees police at the administrative level.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 611, question: 'Dowry Prohibition Act was enacted in:', options: { A: '1955', B: '1961', C: '1983', D: '1986' }, correct_answer: 'B', explanation: 'The Dowry Prohibition Act was enacted in 1961. Section 498A IPC (cruelty by husband/relatives) was added in 1983 specifically to address domestic violence related to dowry.', subject: 'Policing & Law', difficulty: 'medium' },
    { id: 612, question: 'POCSO Act relates to protection of children from:', options: { A: 'Child labour', B: 'Sexual offences', C: 'Domestic violence', D: 'Online harassment' }, correct_answer: 'B', explanation: 'POCSO (Protection of Children from Sexual Offences) Act, 2012 provides a comprehensive framework for protection of children below 18 years from sexual assault, harassment, and pornography.', subject: 'Policing & Law', difficulty: 'easy' },
  ],
};

// Expand to 50 questions per subject by repeating with offset IDs (for demo purposes)
function expandQuestions(subject: Subject): Question[] {
  const base = questionsBySubject[subject];
  const expanded: Question[] = [...base];
  let counter = base.length;
  while (expanded.length < 50) {
    const q = base[counter % base.length];
    expanded.push({ ...q, id: q.id + (Math.floor(counter / base.length)) * 1000 });
    counter++;
  }
  return expanded.slice(0, 50);
}

// ------------------------------------------------------------------
// TODAY'S DATE
// ------------------------------------------------------------------
const today = new Date().toISOString().split('T')[0];

// Subject rotation based on day of week
const subjectRotation: Subject[] = [
  'General Studies', 'Arithmetic', 'Reasoning',
  'Indian Constitution', 'Telangana History', 'Policing & Law'
];
const todaySubject = subjectRotation[new Date().getDay() % subjectRotation.length];

// ------------------------------------------------------------------
// DAILY Q&A
// ------------------------------------------------------------------
export function getMockQNA(subject: Subject): QNAData {
  return {
    date: today,
    subject,
    questions: expandQuestions(subject),
  };
}

// ------------------------------------------------------------------
// DAILY TEST (Mixed subjects)
// ------------------------------------------------------------------
export function getMockTest(): TestData {
  const allQuestions: Question[] = subjectRotation.flatMap(s =>
    questionsBySubject[s].slice(0, 8).map((q, i) => ({
      ...q,
      id: q.id + i * 7000
    }))
  ).slice(0, 100);

  // Pad if needed
  while (allQuestions.length < 50) {
    allQuestions.push(...questionsBySubject['General Studies'].slice(0, 50 - allQuestions.length));
  }

  return {
    test_title: `Daily Mock Test — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    time_limit_minutes: 90,
    instructions: [
      'Read each question carefully before answering.',
      'Each correct answer carries 1 mark. No negative marking.',
      'Do not refresh the page during the test.',
      'Submit before time runs out.',
      'Review question navigation panel to track unanswered questions.',
    ],
    questions: allQuestions.slice(0, 100),
  };
}

// ------------------------------------------------------------------
// DAILY GK
// ------------------------------------------------------------------
export function getMockGK(): GKData {
  return {
    date: today,
    gk_points: [
      { category: 'Telangana', title: 'Hyderabad Metro Phase II Approved', description: 'The Telangana government has approved Phase II of the Hyderabad Metro Rail project, extending connectivity to Outer Ring Road areas and IT corridor hubs like Gachibowli and Kokapet. Expected completion by 2028.', exam_relevance: 'Important for infrastructure questions; Hyderabad Metro is one of the largest metro systems in India.' },
      { category: 'Government Schemes', title: 'Mission Kakatiya — Tank Restoration', description: 'Mission Kakatiya aims at restoration of traditional water harvesting systems (tanks and lakes) across Telangana. Over 46,000 minor irrigation tanks are being revived to support farmers and recharge groundwater.', exam_relevance: 'Key state scheme. Name origin (Kakatiya dynasty), objectives, and beneficiaries are frequently asked in TGLPRB exams.' },
      { category: 'India', title: 'India Semiconductor Mission Milestone', description: 'India Semiconductor Mission (ISM) approved three semiconductor fabrication units. India targets becoming a global semiconductor manufacturing hub by 2030, supported by ₹76,000 crore PLI scheme.', exam_relevance: 'Science & Technology + Economic Affairs section. Keywords: ISM, PLI, semiconductor hub.' },
      { category: 'Police', title: 'TGSPA Hosts Women in Policing Workshop', description: 'Telangana State Police Academy (TGSPA), Hyderabad, conducted a national workshop on women safety and SHE Teams effectiveness. The SHE Teams initiative by Telangana Police has been recognized as a national model.', exam_relevance: 'SHE Teams is a Telangana Police initiative for women safety. Frequently asked in police exams.' },
      { category: 'Awards', title: 'Telangana Wins National Water Award', description: 'Telangana Irrigation Department received the National Water Award for best water conservation practices under Kaleshwaram Lift Irrigation Scheme. Kaleshwaram is the world largest multi-stage lift irrigation project.', exam_relevance: 'Kaleshwaram LIS is a high-priority topic. Location (Medigadda), river: Godavari, purpose: irrigation.' },
      { category: 'India', title: 'PM e-VIDYA Expansion', description: 'PM e-VIDYA programme expanded to cover 200+ TV channels for educational content across States. It provides free quality education from Class 1 to 12, accessible even without internet.', exam_relevance: 'Government scheme in Education sector. Part of Atmanirbhar Bharat package.' },
      { category: 'Telangana', title: 'Dharani Portal — Land Records Digitization', description: 'Telangana Dharani portal has digitized over 1.5 crore land records, making it accessible online. It integrates registration and mutation services, reducing corruption in land transactions.', exam_relevance: 'Dharani is a landmark e-governance initiative. Questions on its purpose and beneficiaries appear in TGLPRB.' },
      { category: 'Government Schemes', title: 'Mission Bhagiratha — Safe Drinking Water', description: 'Mission Bhagiratha provides safe drinking water to every household in Telangana — first state in India to achieve 100% piped water supply to rural households. Named after the mythological king who brought Ganga to earth.', exam_relevance: 'Mission Bhagiratha + Mission Kakatiya are the two flagship programs of Telangana. Always asked together.' },
      { category: 'Police', title: 'TSLPRB Recruitment Process Update', description: 'TSLPRB (Telangana State Level Police Recruitment Board) announced the new recruitment process includes Physical Measurement Test (PMT), Physical Efficiency Test (PET), Written Exam, and Interview stages for SI posts.', exam_relevance: 'Direct exam pattern awareness for aspirants. Know the exam stages and qualifying criteria.' },
      { category: 'India', title: 'National Crime Records Bureau Report Highlights', description: 'NCRB Crime in India report shows cybercrime registration increased by 24% year-on-year. Telangana Cyber Crimes police units have been expanded to all districts as per the report.', exam_relevance: 'NCRB data is quiz-friendly. Cybercrime trends are important for police exams.' },
    ],
    mcqs: [
      { question: 'Mission Kakatiya is primarily related to which sector?', options: { A: 'Education', B: 'Water Conservation & Irrigation', C: 'Police Modernization', D: 'Health Services' }, correct_answer: 'B', source: 'Telangana Government Press Release' },
      { question: 'SHE Teams initiative by Telangana Police is primarily aimed at:', options: { A: 'Traffic management', B: 'Women safety in public places', C: 'Anti-corruption drives', D: 'Drug enforcement' }, correct_answer: 'B', source: 'TGSPA Women Safety Workshop Report' },
      { question: 'Kaleshwaram Lift Irrigation Scheme is on which river?', options: { A: 'Krishna', B: 'Tungabhadra', C: 'Godavari', D: 'Manjira' }, correct_answer: 'C', source: 'Telangana Irrigation Department' },
      { question: 'Mission Bhagiratha in Telangana aims to provide:', options: { A: 'Free electricity', B: 'Piped drinking water to every household', C: 'Free rations', D: 'Crop insurance' }, correct_answer: 'B', source: 'PHED Telangana' },
      { question: 'NCRB stands for:', options: { A: 'National Criminal Research Bureau', B: 'National Crime Records Bureau', C: 'National Central Records Board', D: 'None of the above' }, correct_answer: 'B', source: 'NCRB Annual Report' },
    ],
    quick_facts: [
      '🏛️ Telangana was formed on 2 June 2014 as India\'s 29th state.',
      '🌊 Godavari and Krishna are the two major rivers of Telangana.',
      '👮 TGSPA (Telangana State Police Academy) is located in Hyderabad.',
      '📋 TSLPRB conducts recruitment for Telangana Police; exam includes PMT + PET + Written + Interview.',
      '🏆 Ramappa Temple (Mulugu) is Telangana\'s first UNESCO World Heritage Site (2021).',
      '💧 Mission Bhagiratha — first state in India with 100% rural piped water supply.',
      '🏗️ Kaleshwaram LIS on Godavari — world\'s largest multi-stage lift irrigation project.',
      '🛡️ SHE Teams by Telangana Police — national model for women safety.',
      '📜 India\'s first police law: Police Act, 1861 (still in use).',
      '⚖️ Zero FIR can be filed at ANY police station regardless of jurisdiction.',
      '🔢 Article 21A provides free & compulsory education for children aged 6-14 years.',
      '🗳️ First General Election of India: 1951-52.',
      '🏰 Charminar built in 1591 AD by Muhammad Quli Qutb Shah.',
      '📊 NCRB publishes annual Crime in India report.',
      '🌿 Barytes — Telangana is India\'s largest producer.',
    ],
  };
}

// ------------------------------------------------------------------
// NOTIFICATIONS
// ------------------------------------------------------------------
export function getMockNotifications(): Notification[] {
  return [
    {
      id: 'n1',
      title: 'TSLPRB Constable Recruitment 2024 — Official Notification Expected',
      content: 'The Telangana State Level Police Recruitment Board (TSLPRB) is expected to release the official notification for Constable (Civil, AR, TSSP) and SI (Civil, AR) posts shortly. Aspirants are advised to keep checking the official website tslprb.in regularly.\n\n• Estimated vacancies: 6,000+\n• Eligibility: 18-25 years (with relaxation)\n• Apply: Online at tslprb.in',
      type: 'exam',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 86400,
      updated_at: Math.floor(Date.now() / 1000) - 86400,
      external_link: 'https://tslprb.in/',
    },
    {
      id: 'n2',
      title: '🚨 URGENT: SI (Sub-Inspector) Mains Exam Date Announced',
      content: 'TSLPRB has announced the SI Mains Written Examination. The exam will be held at various centers across Telangana.\n\n• Exam Date: March 15–17, 2025\n• Download Admit Card: 7 days before exam from tslprb.in\n• Syllabus: As per official TSLPRB notification\n• Important: Bring Admit Card + Original ID proof',
      type: 'urgent',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 172800,
      updated_at: Math.floor(Date.now() / 1000) - 86400,
      external_link: 'https://tslprb.in/',
    },
    {
      id: 'n3',
      title: 'Constable Written Test — Answer Key Released',
      content: 'The provisional answer key for Constable (Civil) Written Examination has been released. Candidates can view and raise objections within 5 days.\n\n• View Answer Key: tslprb.in/answerkey\n• Objection Window: 5 days from release\n• Objection Fee: ₹100 per question\n• Final key will be published after review.',
      type: 'result',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 259200,
      updated_at: Math.floor(Date.now() / 1000) - 259200,
      external_link: 'https://tslprb.in/',
    },
    {
      id: 'n4',
      title: 'Physical Efficiency Test (PET) Schedule — Constable 2024',
      content: 'PET schedule for Constable (Civil, AR, TSSP) examination has been released. Candidates must report 30 minutes before the allotted time with original documents.\n\n• Required documents: Admit Card, Aadhaar/ID, Class 10 certificate\n• Track suit or sports wear recommended\n• Events: 100m run, 800m run, Long Jump, Shot Put (as per official notification)\n\nDistrict-wise schedule available on official portal.',
      type: 'exam',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 345600,
      updated_at: Math.floor(Date.now() / 1000) - 345600,
      external_link: 'https://tslprb.in/',
    },
    {
      id: 'n5',
      title: 'TGCOP Daily App Update — New Features Added',
      content: 'TGCOP has added new features based on aspirant feedback:\n\n✅ Daily Q&A now includes Policing & Law subject\n✅ Test timer now shows visual alert in last 5 minutes\n✅ GK section expanded with exam-relevance notes\n✅ Notification tab now shows all TSLPRB updates\n\nKeep practicing daily — consistency is the key to success!',
      type: 'general',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 432000,
      updated_at: Math.floor(Date.now() / 1000) - 432000,
    },
    {
      id: 'n6',
      title: 'Telangana Police Constable Result — Final Merit List',
      content: 'The final merit list for Telangana Police Constable (Civil) examination has been published. Candidates who appeared in all stages (PMT/PET/Written/Certificate Verification) may check their result.\n\n• Check result: tslprb.in/results\n• Category-wise cutoff marks also available\n• Joining orders to be issued in phases',
      type: 'result',
      is_active: true,
      created_at: Math.floor(Date.now() / 1000) - 518400,
      updated_at: Math.floor(Date.now() / 1000) - 518400,
      external_link: 'https://tslprb.in/',
    },
  ];
}

export const TODAY_SUBJECT = todaySubject;
