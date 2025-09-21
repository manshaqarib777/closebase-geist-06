import { Job, QualityScoreResult } from '@/types/hiring';

export class QualityScorer {
  static calculateScore(job: Job): QualityScoreResult {
    const breakdown = {
      title: this.scoreTitle(job.title),
      role: this.scoreRole(job.role_needed, job.seniority),
      industries: this.scoreIndustries(job.industries),
      leadType: this.scoreLeadType(job.leads_type, job.sales_cycle_band),
      commission: this.scoreCommission(job.avg_commission_percent, job.avg_commission_eur),
      employment: this.scoreEmployment(job.weekly_hours_needed, job.employment_type),
      description: this.scoreDescription(job.description_md)
    };

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    const feedback = this.generateFeedback(breakdown, job);

    return {
      score: totalScore,
      breakdown,
      feedback
    };
  }

  private static scoreTitle(title?: string): number {
    if (!title) return 0;
    
    // 20 points for title
    const length = title.length;
    if (length >= 10 && length <= 90) {
      // Check if role is mentioned
      const roleKeywords = ['sales', 'setter', 'closer', 'consultant', 'manager', 'executive', 'development'];
      const hasRole = roleKeywords.some(keyword => 
        title.toLowerCase().includes(keyword)
      );
      return hasRole ? 20 : 15;
    }
    
    return length < 10 ? 5 : 10; // Too short or too long
  }

  private static scoreRole(roleNeeded?: string, seniority?: string): number {
    if (!roleNeeded) return 0;
    
    // 20 points for role + seniority
    let score = 15; // Base for having role
    if (seniority) score += 5; // Bonus for seniority
    
    return score;
  }

  private static scoreIndustries(industries?: string[]): number {
    if (!industries || industries.length === 0) return 0;
    
    // 15 points for industries (1-3 is optimal)
    if (industries.length >= 1 && industries.length <= 3) return 15;
    return 10; // Too many industries
  }

  private static scoreLeadType(leadType?: string, salesCycle?: string): number {
    let score = 0;
    
    // 15 points total for lead type + sales cycle
    if (leadType) score += 8;
    if (salesCycle) score += 7;
    
    return score;
  }

  private static scoreCommission(commissionPercent?: number, commissionEur?: number): number {
    // 15 points for commission structure
    if (commissionPercent || commissionEur) return 15;
    return 0;
  }

  private static scoreEmployment(hoursPerWeek?: number, employmentType?: string): number {
    let score = 0;
    
    // 10 points total for employment details
    if (hoursPerWeek) score += 5;
    if (employmentType) score += 5;
    
    return score;
  }

  private static scoreDescription(description?: string): number {
    if (!description) return 0;
    
    // 5 points for description ≥400 characters
    return description.length >= 400 ? 5 : 2;
  }

  private static generateFeedback(breakdown: any, job: Job): string[] {
    const feedback: string[] = [];

    if (breakdown.title < 15) {
      feedback.push('Titel optimieren: 10-90 Zeichen, Rolle erwähnen');
    }

    if (breakdown.role < 15) {
      feedback.push('Rolle und Seniorität spezifizieren');
    }

    if (breakdown.industries < 10) {
      feedback.push('1-3 Zielbranchen auswählen');
    }

    if (breakdown.leadType < 10) {
      feedback.push('Lead-Typ und Sales-Zyklus definieren');
    }

    if (breakdown.commission === 0) {
      feedback.push('Vergütungsstruktur (% oder €/Jahr) angeben');
    }

    if (breakdown.employment < 5) {
      feedback.push('Stunden/Woche und Anstellungsart klären');
    }

    if (breakdown.description < 5) {
      feedback.push('Ausführliche Beschreibung (mind. 400 Zeichen)');
    }

    return feedback;
  }

  static canPublish(score: number): boolean {
    return score >= 70;
  }

  static getPublishStatus(score: number): 'draft' | 'pending' | 'ready' {
    if (score >= 70) return 'ready';
    if (score >= 50) return 'pending'; // Needs review
    return 'draft';
  }
}