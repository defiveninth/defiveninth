# Quiz App

A dynamic web-based quiz application that allows users to select the number of questions, category, difficulty level, and time limit for each question. The app fetches quiz data from the Open Trivia Database (https://opentdb.com/) and provides an engaging user interface to test your knowledge.

## Features

- **Dynamic Question Settings:**
  - Choose the number of questions (5 to 50).
  - Select a specific category or opt for "any category."
  - Adjust the difficulty level (easy, medium, hard, or any).
  - Set a time limit for each question (10 to 60 seconds).

- **Interactive Quiz Experience:**
  - Displays questions dynamically.
  - Randomizes answer order.
  - Real-time progress bar for question time limit.
  - Immediate feedback on correct and incorrect answers.

- **Score Tracking:**
  - Displays final score at the end of the quiz.
  - Option to restart the quiz.

## Installation

1. Clone the repository or download the project files.
2. Open the project directory and ensure you have a web browser installed.
3. Open the `index.html` file in your preferred browser to start the application.

## File Structure

```
project-directory
├── index.html       # Main HTML file
├── style.css        # Styling for the application
├── script.js        # JavaScript logic for quiz functionality
└── README.md        # Documentation file
```

## Usage

1. Open the application in a web browser.
2. On the start screen:
   - Select the desired number of questions.
   - Choose a category, difficulty, and time per question.
3. Click the **Start Quiz** button to begin.
4. Answer each question within the given time limit:
   - Click on an answer to select it.
   - Submit your answer using the **Submit** button.
   - Proceed to the next question using the **Next** button.
5. At the end of the quiz, your score will be displayed.
6. Restart the quiz using the **Restart Quiz** button.

## External Libraries

- **Font Awesome** for icons: [Font Awesome v6.2.1](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css)
- **Open Trivia Database API** for quiz questions: [Open Trivia Database](https://opentdb.com/)

## How It Works

1. **Fetching Questions:**
   - The application fetches quiz questions from the Open Trivia Database API based on the user's selected settings (number of questions, category, and difficulty).

2. **Dynamic Rendering:**
   - Questions and answers are dynamically rendered on the screen.
   - Answers are shuffled to ensure randomness.

3. **Timer:**
   - A countdown timer starts for each question.
   - When the timer reaches zero, the application automatically checks the answer.

4. **Answer Validation:**
   - The selected answer is validated against the correct answer provided by the API.
   - Correct answers are highlighted in green, and incorrect answers in red.

5. **Score Calculation:**
   - The score is updated for each correct answer.
   - The final score is displayed on the end screen.

## Customization

You can customize the application by modifying:

- **Styling:** Edit `style.css` to change the appearance of the app.
- **Functionality:** Modify `script.js` to add new features or adjust existing behavior.

## Known Issues

- Limited to multiple-choice questions as provided by the API.
- Requires an active internet connection to fetch questions.

## Future Enhancements

- Add support for more question types (e.g., true/false, fill-in-the-blank).
- Include user authentication and leaderboard features.
- Enhance mobile responsiveness and accessibility.

## License

This project is open-source and available under the MIT License. Feel free to use, modify, and distribute the code.

