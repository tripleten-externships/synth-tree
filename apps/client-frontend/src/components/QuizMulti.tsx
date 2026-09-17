import type { QuizQuestion } from "./QuizRunner";

function QuizMulti({question, choice, onToggle, submitted}:{question : QuizQuestion; choice : string[]; onToggle : (optionId : string) => void; submitted : boolean}){
  return(
    <div>
      <p className="mb-2 font-medium text-foreground">
        {question.prompt}
      </p>
      {question.options.map((option) => {
        return(
          <label
            key={option.id}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <input
              type="checkbox"
              name={question.id}
              checked={choice.includes(option.id)}
              onChange={() => {
                onToggle(option.id)
              }}
              disabled={submitted}
            />
            {option.text}
          </label>
        )
      })}
    </div>
  )
}

export default QuizMulti;
