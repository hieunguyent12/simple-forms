An app for building survey and polls

- use firebase for realtime?

How do we represent the data and store it in a db?

Survey:

- List of questions, each question contains a list of answers
- data representation:
- json?
  {
  question: "...",
  choices: [{id: "...", name: "..."}]
  }

- every time the user create a survey, we want to create a new row for each of the questions?

- each question has its own "document" in the db
- questions = [
  {
  id,
  surveyId -- this field refers to the ID of the survey that this quesiton belong to
  }
  ]

- each answer choices has it own "document" in the db

  - choices = [
    {
    id,
    questionId -- this field refers to the ID of the question that this choice belongs to
    }
    ]

- for the responses, each response has its own "document" in the db
- responses = [
  id,
  surveyId,
  choiceId -- this field refers to the ID of the choice that this user has chosen
  ]
