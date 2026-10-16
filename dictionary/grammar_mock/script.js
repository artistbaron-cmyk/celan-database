const choices = {
  deni: {
    location: "NEAR THE SPEAKER",
    phrase: "karvek <span>deni</span>",
    translation: "this toolkit, here by me",
    explanation: "Use <strong>deni</strong> when the thing is in the speaker's immediate sphere."
  },
  denya: {
    location: "NEAR THE LISTENER",
    phrase: "drenvor <span>denya</span>",
    translation: "that bowl, there by you",
    explanation: "Use <strong>denya</strong> when the thing is in the listener's immediate sphere."
  },
  denla: {
    location: "AWAY FROM BOTH",
    phrase: "mekor <span>denla</span>",
    translation: "that building over there",
    explanation: "Use <strong>denla</strong> when the thing is away from both speaker and listener."
  }
};

const tabs = [...document.querySelectorAll(".choice-tab")];
const panel = document.querySelector("#choice-panel");

function selectChoice(key) {
  const choice = choices[key];
  if (!choice) return;
  for (const tab of tabs) {
    const selected = tab.dataset.choice === key;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  panel.dataset.active = key;
  document.querySelector("#choice-location").textContent = choice.location;
  document.querySelector("#choice-phrase").innerHTML = choice.phrase;
  document.querySelector("#choice-translation").textContent = choice.translation;
  document.querySelector("#choice-explain").innerHTML = choice.explanation;
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectChoice(tab.dataset.choice));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    selectChoice(next.dataset.choice);
    next.focus();
  });
});

const feedback = document.querySelector("#practice-feedback");
document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-answer]").forEach((option) => {
      option.classList.remove("selected", "correct", "incorrect");
      option.setAttribute("aria-pressed", String(option === button));
    });
    const correct = button.dataset.answer === "denya";
    button.classList.add("selected", correct ? "correct" : "incorrect");
    feedback.classList.toggle("feedback-correct", correct);
    feedback.textContent = correct
      ? "Yes. The bowl is by the person listening, so drenvor denya is the right pair."
      : "Look at whose immediate space holds the bowl. It is beside the listener.";
  });
});
