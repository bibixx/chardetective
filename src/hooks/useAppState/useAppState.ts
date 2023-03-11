import { useReducer } from "react";
import { Buffer } from "buffer";

export const useAppState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch] as const;
};

interface IntroAppState {
  type: "intro";
}

interface FoundEncodingAppState {
  type: "foundEncoding";
  file: File;
  buffer: Buffer;
}

export type AppState = IntroAppState | FoundEncodingAppState;

interface ResetAction {
  type: "resetAction";
}

interface FileSelectedAction {
  type: "fileSelectedAction";
  file: File;
  buffer: Buffer;
}
export type AppStateAction = ResetAction | FileSelectedAction;

const reducer = (prevState: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case "fileSelectedAction": {
      return {
        type: "foundEncoding",
        buffer: action.buffer,
        file: action.file,
      };
    }
    case "resetAction": {
      return {
        type: "intro",
      };
    }
  }

  return prevState;
};

const initialState: AppState = {
  type: "intro",
};
