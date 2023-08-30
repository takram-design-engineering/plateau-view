
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
"updatePosition": "EXTRUDE" | "NEXT";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "canPopPosition": "CANCEL";
        };
        eventsCausingServices: {

        };
        matchesStates: "drawing" | "drawing.circle" | "drawing.circle.diameter" | "drawing.polygon" | "drawing.polygon.vertex" | "drawing.rectangle" | "drawing.rectangle.edge" | "drawing.rectangle.width" | "extruding" | "idle" | { "drawing"?: "circle" | "polygon" | "rectangle" | { "circle"?: "diameter";
"polygon"?: "vertex";
"rectangle"?: "edge" | "width"; }; };
        tags: never;
      }
