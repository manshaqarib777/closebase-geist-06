import { Job, FitScoreResult } from '@/types/hiring';

interface UserProfile {
  role_needed?: string;
  industries?: string[];
  avg_deal_eur?: number;
  location_city?: string;
  location_country?: string;
  tools?: string[];
  language?: string;
  employment_type?: string;
  weekly_hours_needed?: number;
}

export class FitScorer {
  static for(userProfile: UserProfile, job: Job): FitScoreResult {
    const breakdown = {
      role: this.calculateRoleMatch(userProfile.role_needed, job.role_needed),
      leadType: this.calculateLeadTypeMatch(job.leads_type),
      salesCycle: this.calculateSalesCycleMatch(job.sales_cycle_band),
      dealSize: this.calculateDealSizeMatch(userProfile.avg_deal_eur, job.avg_commission_eur, job.avg_product_cost_band),
      location: this.calculateLocationMatch(userProfile, job),
      tools: this.calculateToolsMatch(userProfile.tools || [], job.tools || [])
    };

    // Weighted score calculation
    const weights = {
      role: 0.30,
      leadType: 0.15,
      salesCycle: 0.15,
      dealSize: 0.15,
      location: 0.15,
      tools: 0.10
    };

    const score = Math.round(
      breakdown.role * weights.role +
      breakdown.leadType * weights.leadType +
      breakdown.salesCycle * weights.salesCycle +
      breakdown.dealSize * weights.dealSize +
      breakdown.location * weights.location +
      breakdown.tools * weights.tools
    );

    const reasons = this.generateReasons(breakdown, userProfile, job);

    return {
      score: Math.min(100, Math.max(0, score)),
      reasons: reasons.slice(0, 3), // Top 3 reasons
      breakdown
    };
  }

  private static calculateRoleMatch(userRole?: string, jobRole?: string): number {
    if (!userRole || !jobRole) return 50;
    if (userRole.toLowerCase() === jobRole.toLowerCase()) return 100;
    
    // Partial matches for similar roles
    const roleMatches = {
      'setter': ['appointment setter', 'lead generation'],
      'closer': ['account executive', 'sales executive'],
      'full cycle': ['account executive', 'business development'],
      'consultant': ['sales consultant', 'advisor']
    };

    const userRoleLower = userRole.toLowerCase();
    const jobRoleLower = jobRole.toLowerCase();

    for (const [key, matches] of Object.entries(roleMatches)) {
      if (userRoleLower.includes(key) && matches.some(match => jobRoleLower.includes(match))) {
        return 85;
      }
    }

    return 30;
  }

  private static calculateLeadTypeMatch(leadType?: string): number {
    // Assume user prefers warm leads (common preference)
    if (!leadType) return 50;
    return leadType.toLowerCase() === 'warm' ? 90 : 70;
  }

  private static calculateSalesCycleMatch(salesCycle?: string): number {
    // Assume user is comfortable with medium cycles
    if (!salesCycle) return 50;
    
    const cycleValues = {
      '1-7 tage': 70,
      '1-4 wochen': 90,
      '1-3 monate': 85,
      '3-6 monate': 80,
      '6+ monate': 60
    };

    return cycleValues[salesCycle.toLowerCase()] || 50;
  }

  private static calculateDealSizeMatch(userAvgDeal?: number, jobCommission?: number, costBand?: string): number {
    if (!userAvgDeal && !jobCommission && !costBand) return 50;

    // Extract deal size from cost band
    let jobDealSize = 0;
    if (costBand) {
      const match = costBand.match(/(\d+)k?/i);
      if (match) {
        jobDealSize = parseInt(match[1]) * (costBand.includes('k') ? 1000 : 1);
      }
    }

    if (userAvgDeal && jobDealSize) {
      const ratio = Math.min(userAvgDeal, jobDealSize) / Math.max(userAvgDeal, jobDealSize);
      return Math.round(ratio * 100);
    }

    return 70; // Default if we can't compare
  }

  private static calculateLocationMatch(userProfile: UserProfile, job: Job): number {
    const userCity = userProfile.location_city?.toLowerCase();
    const userCountry = userProfile.location_country?.toLowerCase();
    const jobCity = job.location_city?.toLowerCase();
    const jobCountry = job.location_country?.toLowerCase();
    const jobMode = job.location_mode?.toLowerCase();

    // Remote work gets high score
    if (jobMode === 'remote' || jobMode === 'hybrid') return 95;

    // Same city
    if (userCity && jobCity && userCity === jobCity) return 100;

    // Same country
    if (userCountry && jobCountry && userCountry === jobCountry) return 80;

    // Different locations
    return 40;
  }

  private static calculateToolsMatch(userTools: string[], jobTools: string[]): number {
    if (jobTools.length === 0) return 80; // No specific tools required
    if (userTools.length === 0) return 60; // User hasn't specified tools

    const matches = jobTools.filter(tool => 
      userTools.some(userTool => 
        userTool.toLowerCase().includes(tool.toLowerCase()) ||
        tool.toLowerCase().includes(userTool.toLowerCase())
      )
    );

    const matchRatio = matches.length / jobTools.length;
    return Math.round(matchRatio * 100);
  }

  private static generateReasons(breakdown: any, userProfile: UserProfile, job: Job): string[] {
    const reasons: { score: number; text: string }[] = [];

    if (breakdown.role >= 85) {
      reasons.push({ score: breakdown.role, text: `Passende Rolle (${job.role_needed})` });
    }

    if (breakdown.dealSize >= 80) {
      reasons.push({ score: breakdown.dealSize, text: `Passende Dealgröße (${job.avg_product_cost_band || 'flexibel'})` });
    }

    if (breakdown.salesCycle >= 80) {
      reasons.push({ score: breakdown.salesCycle, text: `Sales-Zyklus-Komfort (${job.sales_cycle_band || 'flexibel'})` });
    }

    if (breakdown.location >= 90) {
      reasons.push({ score: breakdown.location, text: `Standort-Match (${job.location_mode || job.location_city || 'flexibel'})` });
    }

    if (breakdown.leadType >= 85) {
      reasons.push({ score: breakdown.leadType, text: `Lead-Typ (${job.leads_type || 'gemischt'})` });
    }

    if (breakdown.tools >= 80) {
      reasons.push({ score: breakdown.tools, text: `Bekannte Tools/CRM` });
    }

    // Sort by score and return text
    return reasons
      .sort((a, b) => b.score - a.score)
      .map(r => r.text);
  }
}