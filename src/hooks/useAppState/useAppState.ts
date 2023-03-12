import { useReducer } from "react";
import assertNever from "assert-never";

export const useAppState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch] as const;
};

interface IntroAppState {
  type: "intro";
}

interface LoadingPermutationsAppState {
  type: "loadingPermutations";
  file: File;
}

interface GuessEncodingAppState {
  type: "guessEncoding";
  file: File;
  permutations: Record<string, string>;
}

export type AppState = IntroAppState | LoadingPermutationsAppState | GuessEncodingAppState;

interface ResetAction {
  type: "resetAction";
}

interface FileSelectedAction {
  type: "fileSelectedAction";
  file: File;
}

interface PermutationsCalculatedAction {
  type: "permutationsCalculatedAction";
  permutations: Record<string, string>;
}
export type AppStateAction = ResetAction | PermutationsCalculatedAction | FileSelectedAction;

const reducer = (prevState: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case "fileSelectedAction": {
      return {
        type: "loadingPermutations",
        file: action.file,
      };
    }
    case "permutationsCalculatedAction": {
      if (prevState.type !== "loadingPermutations") {
        throw new Error("Unexpected app state");
      }

      return {
        type: "guessEncoding",
        file: prevState.file,
        permutations: action.permutations,
      };
    }
    case "resetAction": {
      return {
        type: "intro",
      };
    }
  }

  return assertNever(action);
};

const initialState: AppState = {
  type: "intro",
};
