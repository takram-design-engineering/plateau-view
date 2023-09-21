
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
        matchesStates: "modal" | "modal.active" | "modal.active.hand" | "modal.active.pedestrian" | "modal.active.select" | "modal.active.sketch" | "modal.active.story" | "modal.selected" | "modal.selected.hand" | "modal.selected.pedestrian" | "modal.selected.select" | "modal.selected.sketch" | "modal.selected.story" | "momentary" | "momentary.active" | "momentary.active.hand" | "momentary.active.select" | "momentary.idle" | "momentary.selected" | "momentary.selected.hand" | "momentary.selected.select" | { "modal"?: "active" | "selected" | { "active"?: "hand" | "pedestrian" | "select" | "sketch" | "story";
"selected"?: "hand" | "pedestrian" | "select" | "sketch" | "story"; };
"momentary"?: "active" | "idle" | "selected" | { "active"?: "hand" | "select";
"selected"?: "hand" | "select"; }; };
        tags: never;
      }
