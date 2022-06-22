import html2canvas from "html2canvas";

import { FormType } from "../types";

export function generatePreviewDOM(document: Document, currentForm: FormType) {
  // Clear the body of the document
  document.body.innerHTML = "";

  document.body.className = "container-preview-canvas m";

  const container = document.createElement("div");
  container.className =
    "builder-content-container container-preview-canvas h-screen";

  const titleP = document.createElement("p");
  titleP.innerHTML = currentForm.form_content.title;
  titleP.className =
    "text-2xl font-medium text-gray-700 mb-8 mt-3 w-[70%] mx-auto";

  container.appendChild(titleP);

  currentForm.form_content.questions.forEach((question) => {
    const questionBlock = document.createElement("div");
    questionBlock.className =
      "flex mx-auto flex-col w-[70%] p-4 bg-white rounded-lg shadow shadow-slate-200 shadow-md";

    const questionContent = document.createElement("p");
    questionContent.innerHTML = question.question_content;
    questionContent.className = "mb-3 font-medium break-words";

    questionBlock.appendChild(questionContent);

    question.options.forEach((option) => {
      const optionDiv = document.createElement("div");

      optionDiv.innerHTML = option.option_content;
      optionDiv.className = "mb-3";

      questionBlock.appendChild(optionDiv);
    });

    container.appendChild(questionBlock);
  });

  document.body.appendChild(container);
}

export async function generatePreviewCanvas(currentForm: FormType) {
  return await html2canvas(document.body, {
    onclone: (document) => {
      generatePreviewDOM(document, currentForm);
    },
  });
}

/*
 const storageRef = ref(storage, currentForm.id);

    const a = canvas.toDataURL();

    uploadString(storageRef, a, "data_url").then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const docRef = doc(db, "forms", formID);
        updateDoc(docRef, {
          preview_url: url,
        });
      });
    }); */
