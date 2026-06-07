import type { Difficulty, MathProblem, MathSettings, Operation } from "./types.js";

const defaultSettingsByDifficulty: Record<Difficulty, MathSettings> = {
  easy: {
    allowedOperations: ["+", "-"],
    minNumber: 1,
    maxNumber: 10,
    allowCrossTen: false,
    allowThreeNumbers: false,
  },
  medium: {
    allowedOperations: ["+", "-"],
    minNumber: 1,
    maxNumber: 20,
    allowCrossTen: true,
    allowThreeNumbers: false,
  },
  hard: {
    allowedOperations: ["+", "-"],
    minNumber: 1,
    maxNumber: 20,
    allowCrossTen: true,
    allowThreeNumbers: true,
  },
};

interface GeneratedOperands {
  left: number;
  right: number;
  operation: Operation;
  answer: number;
}

export class ProblemGenerator {
  generate(difficulty: Difficulty, levelSettings?: Partial<MathSettings>): MathProblem {
    const settings = { ...defaultSettingsByDifficulty[difficulty], ...levelSettings };
    const operands = this.generateOperands(difficulty, settings);
    const options = this.generateOptions(operands.answer, settings.maxNumber);

    return {
      type: "chooseResult",
      expression: `${operands.left} ${operands.operation} ${operands.right} = ?`,
      correctAnswer: operands.answer,
      options,
      difficulty,
    };
  }

  private generateOperands(difficulty: Difficulty, settings: MathSettings): GeneratedOperands {
    const operation = this.pick(settings.allowedOperations);

    if (operation === "+") {
      return this.generateAddition(difficulty, settings);
    }

    return this.generateSubtraction(difficulty, settings);
  }

  private generateAddition(difficulty: Difficulty, settings: MathSettings): GeneratedOperands {
    const maximumAnswer = difficulty === "easy" ? 10 : 20;
    let left = this.randomInt(settings.minNumber, Math.min(settings.maxNumber, maximumAnswer - 1));
    let right = this.randomInt(settings.minNumber, Math.min(settings.maxNumber, maximumAnswer - left));

    if (!settings.allowCrossTen) {
      let attempts = 0;
      while (left + right > 10 && attempts < 20) {
        left = this.randomInt(settings.minNumber, 9);
        right = this.randomInt(settings.minNumber, 10 - left);
        attempts += 1;
      }
    }

    return { left, right, operation: "+", answer: left + right };
  }

  private generateSubtraction(difficulty: Difficulty, settings: MathSettings): GeneratedOperands {
    const maxLeft = difficulty === "easy" ? 10 : settings.maxNumber;
    const left = this.randomInt(Math.max(2, settings.minNumber), maxLeft);
    const right = this.randomInt(settings.minNumber, left);

    return { left, right, operation: "-", answer: left - right };
  }

  private generateOptions(correctAnswer: number, maxNumber: number): number[] {
    const options = new Set<number>([correctAnswer]);
    const upperBound = Math.max(10, maxNumber);
    const candidateOffsets = [-3, -2, -1, 1, 2, 3, 4, -4];

    while (options.size < 3) {
      const offset = this.pick(candidateOffsets);
      const randomFallback = this.randomInt(0, upperBound);
      const candidate = Math.max(0, Math.min(20, correctAnswer + offset));
      options.add(candidate === correctAnswer ? randomFallback : candidate);
    }

    return this.shuffle([...options]);
  }

  private pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }
}
