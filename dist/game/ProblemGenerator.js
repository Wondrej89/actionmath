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
        const generated = settings.allowThreeNumbers
            ? this.generateThreeNumberExpression(settings)
            : this.generateTwoNumberExpression(difficulty, settings);
        const options = this.generateOptions(generated.answer, settings.maxNumber);
        return {
            type: "chooseResult",
            expression: `${generated.expression} = ?`,
            correctAnswer: generated.answer,
            options,
            difficulty,
        };
    }
    generateTwoNumberExpression(difficulty, settings) {
        const operands = this.generateOperands(difficulty, settings);
        return {
            expression: `${operands.left} ${operands.operation} ${operands.right}`,
            answer: operands.answer,
        };
    }
    generateThreeNumberExpression(settings) {
        const maximumAnswer = Math.min(20, settings.maxNumber);
        for (let attempt = 0; attempt < 100; attempt += 1) {
            const first = this.randomInt(settings.minNumber, Math.min(12, settings.maxNumber));
            const second = this.randomInt(settings.minNumber, Math.min(12, settings.maxNumber));
            const third = this.randomInt(settings.minNumber, Math.min(9, settings.maxNumber));
            const firstOperation = this.pick(settings.allowedOperations);
            const secondOperation = this.pick(settings.allowedOperations);
            const partial = this.applyOperation(first, second, firstOperation);
            const answer = this.applyOperation(partial, third, secondOperation);
            if (answer >= 0 && answer <= maximumAnswer) {
                return {
                    expression: `${first} ${firstOperation} ${second} ${secondOperation} ${third}`,
                    answer,
                };
            }
        }
        return { expression: "2 + 3 - 1", answer: 4 };
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
    applyOperation(left, right, operation) {
        return operation === "+" ? left + right : left - right;
    }
    generateOptions(correctAnswer, maxNumber) {
        const options = new Set([correctAnswer]);
        const upperBound = Math.max(10, Math.min(20, maxNumber));
        const candidateOffsets = [-3, -2, -1, 1, 2, 3, 4, -4, 5, -5];
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