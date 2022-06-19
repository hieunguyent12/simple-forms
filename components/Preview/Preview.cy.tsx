import { FormsProvider } from "../../context/FormsContext";
import Preview, { PreviewProps } from "./Preview";

const intialState = [
  {
    question_id: "1",
    question_content: "What is 1 + 2?",
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
  },
  {
    question_id: "2",
    question_content:
      "What is 1 + 2? aldsfjilaksdjflksdjfkldsjgaou23u2093u423kjdsalkfgjsfdlkgjsdlfgjdlfkgjdcmn,mxcvnx,mcnvxmcnvsidfjsiodjfsoidf",
    options: [
      {
        option_id: "3",
        option_content:
          "Choice 1 aldsfjilaksdjflksdjfkldsjgaou23u2093u423kjdsalkfgjsfdlkgjsdlfgjdlfkgjdcmn,mxcvnx,mcnvxmcnvsidfjsiodjfsoidf",
      },
      {
        option_id: "4",
        option_content: "Choice 2",
      },
    ],
  },
];

const questionContentSelector = "[data-testid=questionContent]";
const formTitleSelector = "[data-testid=formTitle]";

function PreviewWithContext(props: PreviewProps) {
  return (
    <FormsProvider>
      <Preview {...props} />
    </FormsProvider>
  );
}

describe("<Preview/>", () => {
  it("should mount", () => {
    cy.mount(<PreviewWithContext testData={intialState} formID="TEST" />);
  });

  it("should have a title", () => {
    cy.mount(<PreviewWithContext testData={intialState} formID="TEST" />);
    cy.get(formTitleSelector).should("contain.text", "Form Title");
  });

  it("one question should ask `What is 1 + 2?`", () => {
    cy.mount(<PreviewWithContext testData={intialState} formID="TEST" />);

    cy.get(questionContentSelector)
      .first()
      .should("contain.text", "What is 1 + 2?");
  });
});
