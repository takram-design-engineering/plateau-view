
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {

        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {

        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {

        };
        eventsCausingServices: {

        };
        matchesStates: "activeTool" | "activeTool.modal" | "activeTool.modal.drawing" | "activeTool.modal.hand" | "activeTool.modal.select" | "activeTool.momentary" | "activeTool.momentary.hand" | "selectedTool" | "selectedTool.modal" | "selectedTool.modal.drawing" | "selectedTool.modal.hand" | "selectedTool.modal.select" | "selectedTool.momentary" | "selectedTool.momentary.hand" | { "activeTool"?: "modal" | "momentary" | { "modal"?: "drawing" | "hand" | "select";
"momentary"?: "hand"; };
"selectedTool"?: "modal" | "momentary" | { "modal"?: "drawing" | "hand" | "select";
"momentary"?: "hand"; }; };
        tags: never;
      }
