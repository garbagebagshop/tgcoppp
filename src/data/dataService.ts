// ============================================================
// TGCOP Data Service
// Replaces broken /api/* fetch calls with local mock data.
// In production: swap these functions to call real API endpoints.
// ============================================================

import {
    getMockQNA,
    getMockTest,
    getMockGK,
    getMockNotifications,
    type Subject,
    type QNAData,
    type TestData,
    type GKData,
    type Notification,
} from './mockData';

// Simulate network delay for realistic loading UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchDailyQNA(subject: Subject): Promise<QNAData> {
    await delay(600);
    return getMockQNA(subject);
}

export async function fetchDailyTest(): Promise<TestData> {
    await delay(800);
    return getMockTest();
}

export async function fetchDailyGK(): Promise<GKData> {
    await delay(600);
    return getMockGK();
}

export async function fetchNotifications(): Promise<Notification[]> {
    await delay(400);
    return getMockNotifications();
}

// Save test results (localStorage for now; hook into API later)
export async function saveTestResult(result: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    timeTakenSeconds: number;
}): Promise<void> {
    const results = JSON.parse(localStorage.getItem('tgcop_test_results') ?? '[]');
    results.unshift({ ...result, date: new Date().toISOString() });
    localStorage.setItem('tgcop_test_results', JSON.stringify(results.slice(0, 30)));
}

export type { Subject, QNAData, TestData, GKData, Notification };
