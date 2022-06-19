import { NextPage } from "next";

export type FormType = {
  id: string;
  owner_id: string;

  form_content: {
    title: string;
    questions: QuestionType[];
  };
};

export type QuestionType = {
  question_id: string;
  question_content: string;
  options: OptionType[];
};

export type OptionType = {
  option_id: string;
  option_content: string;
};

export type ExtendedNextPage = NextPage & { auth: boolean };
