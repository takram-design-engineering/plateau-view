
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
          "clearDrawing": "CANCEL" | "CREATE";
"createCircle": "CIRCLE";
"createPolygon": "POLYGON";
"createRectangle": "RECTANGLE";
"popPosition": "CANCEL";
"pushPosition": "EXTRUDE" | "NEXT";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "canPopPosition": "CANCEL";
"willRectangleComplete": "NEXT";
        };
        eventsCausingServices: {

        };
        matchesStates: "drawing" | "drawing.circle" | "drawing.circle.vertex" | "drawing.polygon" | "drawing.polygon.vertex" | "drawing.rectangle" | "drawing.rectangle.vertex" | "extruding" | "idle" | { "drawing"?: "circle" | "polygon" | "rectangle" | { "circle"?: "vertex";
"polygon"?: "vertex";
"rectangle"?: "vertex"; }; };
        tags: never;
      }
