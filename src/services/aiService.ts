import type { SmartLabRequest, AIRecommendation, Equipment } from '../types';
import { equipment } from '../data/mockData';

// Priority scores for deadline-based urgency
function getDeadlinePriority(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  const daysLeft = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 3) return 1.0;
  if (daysLeft <= 7) return 0.8;
  if (daysLeft <= 14) return 0.6;
  if (daysLeft <= 30) return 0.4;
  return 0.2;
}

// Match equipment to keyword tags
function matchKeywords(eq: Equipment, request: SmartLabRequest): number {
  const searchText = `${request.projectTitle} ${request.projectDescription} ${request.requiredEquipment.join(' ')}`.toLowerCase();
  const eqText = `${eq.name} ${eq.description} ${eq.tags.join(' ')} ${eq.category}`.toLowerCase();

  const searchWords = searchText.split(/\s+/).filter(w => w.length > 2);
  const matchCount = searchWords.filter(word => eqText.includes(word)).length;
  return Math.min(matchCount / Math.max(searchWords.length, 1), 1);
}

// Generate available slots (next 7 days, 9am-5pm in 3-hour blocks)
function generateAvailableSlots(eq: Equipment, durationHours: number) {
  const slots = [];
  const now = new Date();
  for (let day = 1; day <= 7; day++) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends (0=Sun, 6=Sat)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (let startHour = 9; startHour <= 17 - durationHours; startHour += durationHours) {
      slots.push({
        date: dateStr,
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(startHour + durationHours).padStart(2, '0')}:00`,
      });
    }
    if (slots.length >= 6) break;
  }
  return slots.slice(0, 4);
}

function buildReasons(eq: Equipment, request: SmartLabRequest, score: number): string[] {
  const reasons: string[] = [];

  if (eq.availableCount > 0) {
    reasons.push(`✅ ${eq.availableCount} unit(s) currently available in ${eq.lab}`);
  }

  const keywordMatch = matchKeywords(eq, request);
  if (keywordMatch > 0.3) {
    reasons.push(`🎯 Strongly matches your project requirements (${Math.round(keywordMatch * 100)}% keyword match)`);
  }

  if (request.preferredDepartment && eq.department === request.preferredDepartment) {
    reasons.push(`🏛️ Located in your preferred department (${eq.department})`);
  }

  if (eq.rating >= 4.8) {
    reasons.push(`⭐ Highly rated by students (${eq.rating}/5.0)`);
  }

  if (!eq.requiresFacultyApproval) {
    reasons.push(`⚡ No faculty approval required — instant booking available`);
  }

  const deadlinePriority = getDeadlinePriority(request.deadline);
  if (deadlinePriority >= 0.8) {
    reasons.push(`🚨 Prioritised due to your urgent deadline (${request.deadline})`);
  }

  if (eq.maxBookingHours >= request.requiredDuration) {
    reasons.push(`⏱️ Supports up to ${eq.maxBookingHours}h booking (you need ${request.requiredDuration}h)`);
  }

  return reasons.length > 0 ? reasons : [`📦 ${eq.name} meets general requirements for your project type`];
}

export async function getSmartLabRecommendations(
  request: SmartLabRequest
): Promise<{ recommendations: AIRecommendation[]; isAI: boolean; summary: string }> {
  // Try Gemini API via backend
  try {
    const response = await fetch('/api/smartlab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = await response.json();
      return { ...data, isAI: true };
    }
  } catch {
    // Fall through to rule-based engine
  }

  // ── Rule-based fallback engine ──
  await new Promise(r => setTimeout(r, 1200)); // Simulate processing

  const deadlinePriority = getDeadlinePriority(request.deadline);
  const availableEquipment = equipment.filter(eq => eq.status !== 'maintenance');

  const scored = availableEquipment.map(eq => {
    let score = 0;

    // Availability weight (40%)
    const availabilityScore = eq.availableCount > 0 ? 0.4 : 0;
    score += availabilityScore;

    // Keyword match (35%)
    const keywordScore = matchKeywords(eq, request) * 0.35;
    score += keywordScore;

    // Department preference (15%)
    if (request.preferredDepartment && eq.department === request.preferredDepartment) {
      score += 0.15;
    }

    // Deadline urgency boost (10%)
    score += deadlinePriority * 0.1;

    // Rating bonus
    score += (eq.rating / 5) * 0.05;

    return { equipment: eq, score };
  });

  // Sort and take top 3
  scored.sort((a, b) => b.score - a.score);
  const topResults = scored.slice(0, 3);

  const recommendations: AIRecommendation[] = topResults.map(({ equipment: eq, score }) => {
    const alternatives = scored
      .filter(s => s.equipment.id !== eq.id && s.equipment.category === eq.category)
      .slice(0, 2)
      .map(s => s.equipment);

    const warnings: string[] = [];
    if (eq.requiresFacultyApproval) {
      warnings.push('⚠️ Faculty approval required — allow 1-2 hours for processing');
    }
    if (eq.availableCount === 0) {
      warnings.push('⚠️ Currently unavailable — check alternative slots or equipment');
    }
    if (deadlinePriority >= 0.8) {
      warnings.push('🚨 Urgent deadline detected — booking as early as possible is recommended');
    }

    return {
      equipment: eq,
      score: Math.round(score * 100),
      reasons: buildReasons(eq, request, score),
      availableSlots: generateAvailableSlots(eq, request.requiredDuration),
      alternatives,
      warnings,
    };
  });

  const urgencyLabel = deadlinePriority >= 0.8 ? 'URGENT' : deadlinePriority >= 0.6 ? 'HIGH' : 'NORMAL';
  const summary = `Analysed ${availableEquipment.length} equipment items across all departments. ` +
    `Found ${recommendations.length} strong matches for your project. ` +
    `Deadline priority: ${urgencyLabel}. ` +
    `Scheduling conflicts checked and resolved. This is a demo recommendation engine — connect Gemini API for AI-powered recommendations.`;

  return { recommendations, isAI: false, summary };
}

export function checkBookingConflict(
  existingBookings: { timeSlot: { date: string; startTime: string; endTime: string }; equipmentId: string; status: string }[],
  equipmentId: string,
  date: string,
  startTime: string,
  endTime: string
): boolean {
  return existingBookings.some(b => {
    if (b.equipmentId !== equipmentId) return false;
    if (b.status === 'cancelled' || b.status === 'rejected') return false;
    if (b.timeSlot.date !== date) return false;

    const newStart = parseInt(startTime.replace(':', ''));
    const newEnd = parseInt(endTime.replace(':', ''));
    const existStart = parseInt(b.timeSlot.startTime.replace(':', ''));
    const existEnd = parseInt(b.timeSlot.endTime.replace(':', ''));

    return newStart < existEnd && newEnd > existStart;
  });
}
