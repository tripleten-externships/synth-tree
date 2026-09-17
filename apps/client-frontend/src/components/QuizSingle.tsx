import type { QuizQuestion } from "./QuizRunner";

// export type QuizQuestion = {
//   id: string;
//   prompt: string;
//   type: string; // SINGLE_CHOICE | MULTIPLE_CHOICE | OPEN_QUESTION
//   options: QuizOption[];
// };


function QuizSingle({question, choice, onToggle, submitted}:{question : QuizQuestion; choice : string[]; onToggle : (optionId : string) => void; submitted : boolean}){
  return(
    <div>
      <p className="mb-2 font-medium text-foreground">
        {question.prompt}
      </p>
      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          return(
            <label
              key={option.id}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="radio"
                name={question.id}
                checked={choice.includes(option.id)}
                onChange={() =>
                  onToggle(option.id)
                }
                disabled={submitted}
              />
              {option.text}
            </label>
          )
        })}
      </div>

    </div>
  );
}



export default QuizSingle;
