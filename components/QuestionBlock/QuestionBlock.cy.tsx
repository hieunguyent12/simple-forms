import QuestionBlock from "./index";

import { QuestionType } from "../../types";

const dummyQuestion: QuestionType = {
  question_id: "1",
  question_content: "Test question",
  options: [
    {
      option_id: "1",
      option_content: "Choice 1",
    },
    {
      option_id: "2",
      option_content: "Choice 2",
    },
  ],
};

const questionInputSelector = "[data-testid=questionInput]";
const questionContentSelector = "[data-testid=questionContent]";
const questionActionsFooterSelector = "[data-testid=questionActionsFooter]";

const updateQuestion = cy.stub();

describe("<QuestionBlock/>", () => {
  it("should mount", () => {
    cy.mount(
      <QuestionBlock question={dummyQuestion} isInEditingMode={false} />
    );
  });

  it("question should say `Test question` when in editing mode", () => {
    cy.mount(
      <QuestionBlock
        question={dummyQuestion}
        isInEditingMode
        updateQuestion={updateQuestion}
      />
    );

    cy.get(questionInputSelector).should("have.value", "Test question");
  });

  it("should render properly in preview mode", () => {
    cy.mount(
      <QuestionBlock question={dummyQuestion} isInEditingMode={false} />
    );

    cy.get(questionInputSelector).should("not.exist");
    cy.get(questionContentSelector).should("have.text", "Test question");
    cy.get(questionActionsFooterSelector).should("not.exist");
  });
});
