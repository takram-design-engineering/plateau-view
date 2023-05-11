
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
        matchesStates: "activeTool" | "activeTool.modal" | "activeTool.modal.hand" | "activeTool.modal.pedestrian" | "activeTool.modal.select" | "activeTool.modal.sketch" | "activeTool.modal.story" | "activeTool.momentary" | "activeTool.momentary.hand" | "selectedTool" | "selectedTool.modal" | "selectedTool.modal.hand" | "selectedTool.modal.pedestrian" | "selectedTool.modal.select" | "selectedTool.modal.sketch" | "selectedTool.modal.story" | "selectedTool.momentary" | "selectedTool.momentary.hand" | "selectedTool.momentary.select" | { "activeTool"?: "modal" | "momentary" | { "modal"?: "hand" | "pedestrian" | "select" | "sketch" | "story";
"momentary"?: "hand"; };
"selectedTool"?: "modal" | "momentary" | { "modal"?: "hand" | "pedestrian" | "select" | "sketch" | "story";
"momentary"?: "hand" | "select"; }; };
        tags: never;
      }
