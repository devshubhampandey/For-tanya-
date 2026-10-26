// Runs once the page structure is ready.
// (The script tag uses "defer", but this is an extra safety net.)
document.addEventListener("DOMContentLoaded", function () {
  // ---------- 1. Find the elements we need ----------
  const answerButtons = document.querySelectorAll(".answer-btn");
  const feedback = document.querySelector("#feedback");
  const intro = document.querySelector("#intro");

  // If something is missing, stop quietly instead of throwing errors
  if (!answerButtons.length || !feedback || !intro) {
    return;
  }

  // ---------- 2. Settings and state ----------
  const CORRECT_ANSWER = "32";
  const REVEAL_DELAY = 900; // milliseconds to wait before showing the intro

  let solved = false;   // becomes true after the correct answer
  let revealed = false; // becomes true once the intro is shown

  // ---------- 3. Messages ----------
  const hints = {
    "5": "Not quite. Math would give 5, but one of these values is a string. Look at the quotes around the 2.",
    "Error": "Good thinking, but JavaScript doesn't crash here. It quietly converts the number into text."
  };

  const successMessage =
    "Correct! JavaScript concatenates the number 3 with the string '2', producing '32'.";

  // ---------- 4. Helper: show a message ----------
  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.classList.remove("is-hint", "is-success");
    feedback.classList.add(type);
  }

  // ---------- 5. Helper: reveal the personal intro (only once) ----------
  function revealIntro() {
    if (revealed) {
      return;
    }
    revealed = true;

    intro.hidden = false; // make it part of the page

    // Wait one frame so the fade-in animation can play
    window.requestAnimationFrame(function () {
      intro.classList.add("is-visible");
    });

    // Smoothly scroll it into view (instant if reduced motion is on)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      intro.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }, 150);
  }

  // ---------- 6. Handle a click on an answer button ----------
  function handleAnswer(event) {
    const button = event.currentTarget;
    const answer = button.dataset.answer;

    // Ignore clicks after solving or on already-disabled buttons
    if (solved || button.disabled) {
      return;
    }

    if (answer === CORRECT_ANSWER) {
      // Correct answer
      solved = true;
      button.classList.add("is-correct");

      // Disable every button
      answerButtons.forEach(function (btn) {
        btn.disabled = true;
      });

      showFeedback(successMessage, "is-success");

      // Reveal the introduction after a short delay
      window.setTimeout(revealIntro, REVEAL_DELAY);
    } else {
      // Wrong answer: disable only this button and show a hint
      button.disabled = true;
      button.classList.add("is-wrong");
      showFeedback(hints[answer] || "Not quite. Give it another try!", "is-hint");
    }
  }

  // ---------- 7. Attach one listener to each button ----------
  answerButtons.forEach(function (button) {
    button.addEventListener("click", handleAnswer);
  });
});
