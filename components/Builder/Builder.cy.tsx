import { useEffect } from "react";

import Builder, { BuilderProps } from "./Builder";
import {
  ActionTypes,
  FormsProvider,
  useForms,
} from "../../context/FormsContext";
import { FormType } from "../../types";

const dummyData: FormType[] = [
  {
    id: "1",
    owner_id: "2",
    form_content: {
      title: "Form Title",
      questions: [
        {
          question_id: "1",
          question_content: "First Question",
          options: [
            { option_id: "1", option_content: "First Choice" },
            { option_id: "2", option_content: "Second Choice" },
          ],
        },
      ],
    },
  },
];

function BuilderWithContext(props: BuilderProps) {
  return (
    <FormsProvider>
      <PopulateContextComponent>
        <Builder {...props} />
      </PopulateContextComponent>
    </FormsProvider>
  );
}

// We need this component to populate data in the FormsContext for us, otherwise, we will have no data to render the Builder component
function PopulateContextComponent({ children }: any) {
  const { dispatchFormAction } = useForms();

  useEffect(() => {
    dispatchFormAction({
      type: ActionTypes.INITIALIZE_DATA,
      payload: dummyData,
    });
    // eslint-disable-next-line
  }, []);

  return children;
}

const titleSelector = "[data-testid=title]";
const actionsSectionSelector = "[data-testid=actionsSection]";
const previewBtnSelector = "[data-testid=previewBtn]";

describe("<Builder/>", () => {
  it("should mount", () => {
    cy.mount(<BuilderWithContext formID="1" />);
  });

  it("form title should be `Form Title`", () => {
    cy.mount(<BuilderWithContext formID="1" />);
    cy.get(titleSelector).should("have.text", "Form Title");
  });

  it("should have actions section", () => {
    cy.mount(<BuilderWithContext formID="1" />);
    cy.get(actionsSectionSelector).should("exist");
    cy.get(previewBtnSelector).should("exist");
  });
});
