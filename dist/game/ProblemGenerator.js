const defaultSettingsByDifficulty = {
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
export class ProblemGenerator {
    generate(difficulty, levelSettings) {
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
    generateOperands(difficulty, settings) {
        const operation = this.pick(settings.allowedOperations);
        if (operation === "+") {
            return this.generateAddition(difficulty, settings);
        }
        return this.generateSubtraction(difficulty, settings);
    }
    generateAddition(difficulty, settings) {
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
    generateSubtraction(difficulty, settings) {
        const maxLeft = difficulty === "easy" ? 10 : settings.maxNumber;
        const left = this.randomInt(Math.max(2, settings.minNumber), maxLeft);
        const right = this.randomInt(settings.minNumber, left);
        return { left, right, operation: "-", answer: left - right };
    }
    generateOptions(correctAnswer, maxNumber) {
        const options = new Set([correctAnswer]);
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
    pick(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    shuffle(items) {
        return [...items].sort(() => Math.random() - 0.5);
    }
}
//# sourceMappingURL=ProblemGenerator.js.map