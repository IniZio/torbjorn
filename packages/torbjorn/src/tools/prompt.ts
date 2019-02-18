import * as prompt_ from 'prompts'

const prompt = prompt_

export {prompt}
// The actual prompt function
// export const prompt = prompts

// interface PromptObject<T extends string = string> {
//   type: ValueOrFunc<PromptType> | Falsy;
//   name: ValueOrFunc<T>;
//   message?: ValueOrFunc<string>;
//   initial?: string | number | boolean;
//   style?: string;
//   format?: PrevCaller<T, void>;
//   validate?: PrevCaller<T, void>;
//   onState?: PrevCaller<T, void>;
//   min?: number;
//   max?: number;
//   float?: boolean;
//   round?: number;
//   increment?: number;
//   seperator?: string;
//   active?: string;
//   inactive?: string;
//   choices?: Choice[];
//   hint?: string;
//   suggest?: ((prev: any, values: any, prompt: PromptObject) => void);
//   limit?: number;
// }

// type Answers<T extends string> = { [Tid in T]: any };

// type PrevCaller<T extends string, TR = T> = (
//     prev: any,
//     values: Answers<T>,
//     prompt: PromptObject
// ) => TR;

// type Falsy = false | null | undefined;

// type PromptType = 'text' | 'password' | 'invisible' | 'number' | 'confirm' | 'list' | 'toggle' | 'select' | 'multiselect' | 'autocomplete';

// type ValueOrFunc<T extends string> = T | PrevCaller<T>;

// interface Choice {
//   title: string;
//   value: string;
//   disable?: boolean;
// }

// export function prompts<T extends string = string>(
//   questions: PromptObject<T> | PromptObject<T>[],
// ): PromptObject<T> | PromptObject<T>[] {
//   return questions
// }
