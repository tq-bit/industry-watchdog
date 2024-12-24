import { TScore } from "../server/db/Scores.db.ts";
import { TScrapingResult } from "../server/db/ScrapingResults.db.ts";

export default class IndustryIndex {
  results: TScrapingResult[];
  scores: TScore[];
  constructor(results: TScrapingResult[], scores: TScore[]) {
    this.results = results;
    this.scores = scores;
  }

  calculateIndicies() {
    const relevanceScore = this.calcuateRelevanceScore();
    const impactScore = this.calculateImpactScore();
    const relevanceIndex = this.calculateRelevanceIndex(relevanceScore)
    const impactIndex = this.calculateImpactIndex(impactScore)
    return {
      relevanceIndex,
      impactIndex,
      industryIndex: impactIndex === 0 ? 0 : this.calculateIndustryIndex(relevanceScore, impactScore),
    };
  }

  private calculateIndustryIndex(relevanceScore: number, impactScore: number) {
    const industryWeightSum = this.scores.reduce(
      (acc, score) => acc + score.weight,
      0,
    );

    const divider = relevanceScore === 0 || impactScore === 0 ? 1 : 2;
    return +(((relevanceScore + impactScore) / divider / industryWeightSum) *
      100).toFixed(
        2,
      );
  }

  private calculateImpactScore() {
    const impactScores = this.scores.filter((score) => score.type === "impact");
    return impactScores.map((score) => {
      const articlesWithAtLeastOneKeyword = this.findArticlesWithKeywords(
        score,
        this.results,
      );
      return (articlesWithAtLeastOneKeyword.length * score.weight) / this.results.length;
    }).reduce((acc, score) => acc + score, 0);
  }

  private calculateImpactIndex(impactScore: number) {
    const impactWeightSum = this.scores.reduce(
      (acc, score) => (score.type === "impact" ? acc + score.weight : acc),
      0,
    );
    return +((impactScore / impactWeightSum * 100)).toFixed(2);
  }

  private calcuateRelevanceScore() {
    const relevanceScores = this.scores.filter((score) =>
      score.type === "relevance"
    );
    return relevanceScores.map((score) => {
      const articlesWithAtLeastOneKeyword = this.findArticlesWithKeywords(
        score,
        this.results,
      );
      return (articlesWithAtLeastOneKeyword.length * score.weight) / this.results.length;
    }).reduce((acc, score) => acc + score, 0);
  }

  private calculateRelevanceIndex(relevanceScore: number) {
    const relevanceWeightSum = this.scores.reduce(
      (acc, score) => (score.type === "relevance" ? acc + score.weight : acc),
      0,
    );
    return +(relevanceScore / relevanceWeightSum * 100).toFixed(2);
  }

  private findArticlesWithKeywords(score: TScore, results: TScrapingResult[]) {
    return score.keywords.map((keyword) =>
      results.find((result) => {
        return result.content.toLowerCase().includes(keyword.toLowerCase());
      })
    ).filter(Boolean).flat();
  }
}
