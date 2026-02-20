import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class ContentGenerator {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateDailyQNA(subject: string, date: string) {
    const prompt = `
    Generate 50 high-quality multiple-choice questions for Telangana Police (TGLPRB) exam preparation.
    Subject: ${subject}
    Date: ${date}

    STRICT REQUIREMENTS:
    - Follow latest TGLPRB Constable & SI exam pattern
    - Exam-level difficulty (not beginner)
    - Each question must have 4 options (A, B, C, D)
    - Provide correct answer and brief explanation
    - No repetition from previous days
    - Focus on practical policing scenarios where applicable

    SUBJECTS COVERAGE:
    - General Studies: Geography, History, Science, Economics
    - Arithmetic: Number systems, Percentages, Ratios, Time & Work
    - Reasoning: Logical, Verbal, Non-verbal puzzles
    - Indian Constitution: Fundamental rights, duties, governance
    - Telangana History: Movement, culture, geography, current developments
    - Policing & Law: IPC basics, CrPC, evidence, investigation procedures

    FORMAT (JSON):
    {
      "questions": [
        {
          "id": 1,
          "question": "Clear question text",
          "options": {
            "A": "Option A",
            "B": "Option B", 
            "C": "Option C",
            "D": "Option D"
          },
          "correct_answer": "A",
          "explanation": "Brief exam-focused explanation",
          "subject": "${subject}",
          "difficulty": "medium"
        }
      ]
    }

    Generate exactly 50 questions. Ensure variety in topics within the subject.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating Q&A:', error);
      throw new Error('Failed to generate daily Q&A content');
    }
  }

  async generateDailyTest(date: string) {
    const prompt = `
    Create a comprehensive daily test for Telangana Police exam preparation.
    Date: ${date}

    REQUIREMENTS:
    - 100 questions total
    - Mixed subjects: 20% General Studies, 20% Arithmetic, 20% Reasoning, 20% Constitution, 10% Telangana History, 10% Policing
    - Time limit: 90 minutes
    - Exam-pattern difficulty
    - Mix of easy (30%), medium (50%), hard (20%)
    - No duplicate questions from recent tests

    FORMAT (JSON):
    {
      "test_title": "Daily Mock Test - ${date}",
      "time_limit_minutes": 90,
      "instructions": [
        "Answer all questions",
        "Each question carries 1 mark",
        "No negative marking",
        "Choose the best answer"
      ],
      "questions": [
        {
          "id": 1,
          "question": "Question text",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C", 
            "D": "Option D"
          },
          "correct_answer": "A",
          "subject": "General Studies",
          "difficulty": "medium"
        }
      ]
    }

    Generate exactly 100 questions with proper subject distribution.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating test:', error);
      throw new Error('Failed to generate daily test');
    }
  }

  async generateDailyGK(newsContent: string, date: string) {
    const prompt = `
    Extract exam-relevant GK and Current Affairs from the provided news content.
    Date: ${date}

    NEWS CONTENT TO PROCESS:
    ${newsContent}

    STRICT RULES:
    - DO NOT invent or hallucinate any information
    - Extract only factual information from provided content
    - Focus on exam-relevant facts only
    - Generate MCQs only from provided facts
    - If no relevant information, return minimal content

    PRIORITY TOPICS:
    - Telangana government schemes, appointments, policies
    - Central government initiatives affecting police/security
    - Awards and recognition in police/public service
    - Constitutional amendments or legal changes
    - Current affairs with direct exam relevance

    FORMAT (JSON):
    {
      "date": "${date}",
      "gk_points": [
        {
          "category": "Government Schemes",
          "title": "Scheme/News Title",
          "description": "Brief factual description",
          "exam_relevance": "Why this matters for exam"
        }
      ],
      "mcqs": [
        {
          "question": "Question based on provided news",
          "options": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
          },
          "correct_answer": "A",
          "source": "Original news reference"
        }
      ],
      "quick_facts": [
        "Fact 1",
        "Fact 2"
      ]
    }

    If provided content has no exam-relevant information, return minimal structure with empty arrays.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating GK content:', error);
      throw new Error('Failed to generate GK content');
    }
  }
}

export const contentGenerator = new ContentGenerator();