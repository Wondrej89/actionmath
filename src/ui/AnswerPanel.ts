import type { MathProblem } from "../game/types.js";

export type AnswerHandler = (answer: string | number) => void;

export class AnswerPanel {
  readonly element = document.createElement("section");
  private readonly prompt = document.createElement("div");
  private readonly buttons = document.createElement("div");
  private selectedButton: HTMLButtonElement | null = null;
  private renderedProblemKey = "";

  constructor(private readonly onAnswer: AnswerHandler) {
    this.element.className = "answer-panel";
    this.prompt.className = "answer-prompt";
    this.prompt.textContent = "What's the answer?";
    this.buttons.className = "answer-buttons";
    this.element.append(this.prompt, this.buttons);
  }

  update(problem: MathProblem | null): void {
    const key = problem ? `${problem.expression}|${problem.options.join(",")}` : "empty";
    if (key === this.renderedProblemKey) {
      return;
    }

    this.renderedProblemKey = key;
    this.buttons.innerHTML = "";

    if (!problem) {
      this.prompt.textContent = "Get ready...";
      return;
    }

    this.prompt.textContent = "Kolik je výsledek?";
    for (const option of problem.options) {
      const button = document.createElement("button");
      button.className = "answer-button";
      button.type = "button";
      button.textContent = String(option);
      button.addEventListener("click", () => {
        this.selectedButton = button;
        this.onAnswer(option);
      });
      this.buttons.append(button);
    }
  }

  flash(isCorrect: boolean): void {
    if (!this.selectedButton) {
      return;
    }

    this.selectedButton.classList.add(isCorrect ? "correct" : "wrong");
    window.setTimeout(() => {
      this.selectedButton?.classList.remove("correct", "wrong");
      this.selectedButton = null;
    }, 350);
  }
}
