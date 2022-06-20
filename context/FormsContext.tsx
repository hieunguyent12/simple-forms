import { createContext, Dispatch, useContext, useReducer } from "react";
import { useImmerReducer } from "use-immer";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import produce from "immer";

import { FormType, QuestionType, OptionType } from "../types";
import { db } from "../firebase";
import { nanoid } from "nanoid";

export enum ActionTypes {
  INITIALIZE_DATA = "INITIALIZE_DATA",
  CREATE_FORM = "Form/Create",
  EDIT_FORM = "Form/Edit",
  DELETE_FORM = "Form/Delete",
  CREATE_QUESTION = "Question/Create",
  EDIT_QUESTION = "Question/Edit",
  DELETE_QUESTION = "Question/Delete",
  CREATE_OPTION = "Option/Create",
  EDIT_OPTION = "Option/Edit",
  DELETE_OPTION = "Option/Delete",
}

type ActionPayloads = {
  [ActionTypes.INITIALIZE_DATA]: FormType[];
  [ActionTypes.CREATE_FORM]: FormType;
  [ActionTypes.EDIT_FORM]: {
    form_id: string;
    newFormTitle: string;
  };
  [ActionTypes.CREATE_QUESTION]: {
    form_id: string;
    question: QuestionType;
  };
  [ActionTypes.CREATE_OPTION]: {
    question_id: string;
    form_id: string;
    option: OptionType;
  };
  [ActionTypes.EDIT_QUESTION]: {
    form_id: string;
    question_id: string;
    newQuestionContent: string;
  };
  [ActionTypes.EDIT_OPTION]: {
    form_id: string;
    question_id: string;
    option_id: string;
    newOptionContent: string;
  };
};

// ActionMap allows us to get the corresponding payload type for a specific Action type.
type ActionMap = {
  [Key in keyof ActionPayloads]: {
    type: Key;
    payload: ActionPayloads[Key];
  };
};

export type FormAction = ActionMap[keyof ActionPayloads];

// TODO: move this to a separate file at some point
function formStateReducer(state: FormType[], action: FormAction) {
  let form;

  switch (action.type) {
    case ActionTypes.INITIALIZE_DATA:
      return action.payload;
    case ActionTypes.CREATE_FORM:
      state.push(action.payload);
      return state;
    case ActionTypes.EDIT_FORM:
      form = state.find((form) => form.id === action.payload.form_id);
      if (form) {
        form.form_content.title = action.payload.newFormTitle;
      }
      return state;
    case ActionTypes.CREATE_QUESTION:
      // TODO: do this inside an api
      form = state.find((form) => form.id === action.payload.form_id);

      if (form) {
        form.form_content.questions.push(action.payload.question);
      }

      return state;
    case ActionTypes.EDIT_QUESTION:
      form = state.find((form) => form.id === action.payload.form_id);

      if (form) {
        const question = form.form_content.questions.find(
          (question) => question.question_id === action.payload.question_id
        );

        if (question) {
          question.question_content = action.payload.newQuestionContent;
        }
      }

      return state;
    case ActionTypes.CREATE_OPTION:
      form = state.find((form) => form.id === action.payload.form_id);

      if (form) {
        const question = form.form_content.questions.find(
          (question) => question.question_id === action.payload.question_id
        );
        question?.options.push(action.payload.option);
      }

      return state;
    case ActionTypes.EDIT_OPTION:
      form = state.find((form) => form.id === action.payload.form_id);
      if (form) {
        const question = form.form_content.questions.find(
          (question) => question.question_id === action.payload.question_id
        );
        const option = question?.options.find(
          (option) => option.option_id === action.payload.option_id
        );

        if (option) {
          option.option_content = action.payload.newOptionContent;
        }
      }
      return state;

    default:
      return state;
  }
}

const FormsContext = createContext<{
  forms: FormType[];
  dispatchFormAction: Dispatch<FormAction>;
} | null>(null);

function FormsProvider({ children }: { children: JSX.Element }) {
  const [forms, dispatchFormAction] = useImmerReducer<FormType[]>(
    formStateReducer,
    []
  );

  const enhaceDispatch = (dispatch: (action: FormAction) => void) => {
    return async (action: FormAction) => {
      const formsCollection = collection(db, "forms");

      // in here, we are making updates on firestore and then calling the dispatch function to update
      // our local state

      if (action.type === ActionTypes.CREATE_FORM) {
        // @ts-ignore - we are deleting the placeholder "id" here. Firebase will automically generate an ID for us.
        delete action.payload.id;

        await addDoc(formsCollection, action.payload);
      }

      if (action.type === ActionTypes.EDIT_FORM) {
        const currentForm = forms.find(
          (form) => form.id === action.payload.form_id
        );

        if (currentForm) {
          const docRef = doc(db, "forms", currentForm.id);

          await updateDoc(docRef, {
            "form_content.title": action.payload.newFormTitle,
          });
        }
      }

      if (action.type === ActionTypes.CREATE_QUESTION) {
        const currentForm = forms.find(
          (form) => form.id === action.payload.form_id
        );

        if (currentForm) {
          const questions = currentForm.form_content.questions;

          const newQuestions: QuestionType[] = [
            ...questions,
            {
              question_id: nanoid(10),
              question_content: "",
              options: [{ option_content: "Option", option_id: nanoid(10) }],
            },
          ];

          const docRef = doc(db, "forms", currentForm.id);

          await updateDoc(docRef, {
            "form_content.questions": newQuestions,
          });
        }
      }

      if (action.type === ActionTypes.CREATE_OPTION) {
        const currentForm = forms.find(
          (form) => form.id === action.payload.form_id
        );

        if (currentForm) {
          // Removing produce will cause error!
          // We are using Immer's "produce" here because the "currentForm" object is frozen by when Firebase returns it to us
          // using "produce" allows us to modify currentForm without touching the original object
          produce(currentForm, async (draft) => {
            const questions = draft.form_content.questions;
            const question = questions.find(
              (question) => question.question_id === action.payload.question_id
            );

            if (question) {
              question.options.push(action.payload.option);

              const docRef = doc(db, "forms", currentForm.id);
              await updateDoc(docRef, {
                "form_content.questions": questions,
              });
            }
          });
        }
      }

      if (action.type === ActionTypes.EDIT_QUESTION) {
        const currentForm = forms.find(
          (form) => form.id === action.payload.form_id
        );

        if (currentForm) {
          produce(currentForm, async (draft) => {
            const questions = draft.form_content.questions;

            const currentQuestion = questions.find(
              (question) => question.question_id === action.payload.question_id
            );

            if (currentQuestion) {
              currentQuestion.question_content =
                action.payload.newQuestionContent;

              const docRef = doc(db, "forms", currentForm.id);
              await updateDoc(docRef, {
                "form_content.questions": questions,
              });
            }
          });
        }
      }

      if (action.type === ActionTypes.EDIT_OPTION) {
        const currentForm = forms.find(
          (form) => form.id === action.payload.form_id
        );

        if (currentForm) {
          produce(currentForm, async (draft) => {
            const questions = draft.form_content.questions;

            const currentQuestion = questions.find(
              (question) => question.question_id === action.payload.question_id
            );

            if (currentQuestion) {
              const options = currentQuestion.options;

              const option = options.find(
                (option) => option.option_id === action.payload.option_id
              );

              if (option) {
                option.option_content = action.payload.newOptionContent;

                const docRef = doc(db, "forms", currentForm.id);
                await updateDoc(docRef, {
                  "form_content.questions": questions,
                });
              }
            }
          });
        }
      }

      dispatch(action);
    };
  };

  return (
    <FormsContext.Provider
      value={{ forms, dispatchFormAction: enhaceDispatch(dispatchFormAction) }}
    >
      {children}
    </FormsContext.Provider>
  );
}

function useForms() {
  const auth = useContext(FormsContext)!;

  return auth;
}

export { FormsContext, FormsProvider, useForms };
