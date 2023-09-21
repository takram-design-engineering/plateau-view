# PLATEAU VIEW 3.0<br>Design & Technology Preview

This repository hosts a prototype of PLATEAU VIEW 3.0, a part of [the 2023 PLATEAU project](https://www.mlit.go.jp/report/press/toshi03_hh_000101.html) overseen by the Ministry of Land, Infrastructure, Transport and Tourism of Japan (MLIT).

The prototype under development is available at [plateau.takram.com](https://plateau.takram.com). However, please be aware that it is still in development and is not intended to be a complete service.

![Heatmap](https://github.com/takram-design-engineering/plateau-view/assets/8651513/95489cd2-ee1d-45d1-8953-32a7acb2fb72)

![Flood Risk](https://github.com/takram-design-engineering/plateau-view/assets/8651513/f464a043-0eaa-4fc0-9538-8ffb7df318be)

![Elevation](https://github.com/takram-design-engineering/plateau-view/assets/8651513/dfb7674d-4692-4347-85a3-085a123d8b01)

![Pedestrian](https://github.com/takram-design-engineering/plateau-view/assets/8651513/d7aa2524-8db4-4476-be3b-31a42d1a195d)

## Background and Goal

Since 2020, MLIT has been developing and operating PLATEAU VIEW, where users can explore PLATEAU’s 3D city models and various datasets. In April 2023, they introduced [PLATEAU VIEW 2.0](https://plateauview.mlit.go.jp), transitioning its platform from TerriaJS to a CMS-based system, ReEarth. This change allegedly allowed local governments to customize and host their versions of PLATEAU VIEW.

Nonetheless, it should be emphasized that the shift to a CMS-based system mainly benefits stakeholders such as government offices and data vendors rather than end-users. For those who visit and use the system, many areas need improvements around user experience, including usability, performance, and visual quality.

This project aims to apply Takram’s design and development expertise to improve and enhance the user experience of PLATEAU VIEW. Furthermore, this open-source project allows everyone to access the design and technical specifics involved.

The design and development process started on April 10, 2023, with our contribution to the 2023 PLATEAU project scheduled to conclude by September 10, 2023.

## Structure

This repository consists of the following apps and libraries. The README for each will be added later.

### Apps

| Name                                    | Description                                  |
| --------------------------------------- | -------------------------------------------- |
| [api](apps/api)                         | NestJS API server                            |
| [app](apps/app)                         | Next.js frontend                             |
| [data-converters](apps/data-converters) | Node.js script for converting data           |
| [tiles](apps/tiles)                     | NestJS server for rendering vector map tiles |

### Libraries

| Name                                                  | Description                                                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [cesium-hbao](libs/cesium-hbao)                       | Better HBAO implementation for Cesium                                                                 |
| [cesium-helpers](libs/cesium-helpers)                 | Helper functions for Cesium                                                                           |
| [cesium-vector-imagery](libs/cesium-vector-imagery)   | [ImageryProvider](https://cesium.com/learn/cesiumjs/ref-doc/ImageryProvider.html) for drawing MVT     |
| [cesium](libs/cesium)                                 | React components for Cesium                                                                           |
| [color-maps](libs/color-maps)                         | Collection of color schemes                                                                           |
| [data-sources](libs/data-sources)                     | Several [DataSources](https://cesium.com/learn/cesiumjs/ref-doc/DataSource.html) used in PLATEAU VIEW |
| [datasets](libs/datasets)                             | Classes and components that represent PLATEAU and other datasets                                      |
| [geocoder](libs/geocoder)                             | Simple geocoding functions                                                                            |
| [graphql](libs/graphql)                               | Generated GraphQL types and hooks                                                                     |
| [heatmap](libs/heatmap)                               | Visualizes regional mesh heatmap                                                                      |
| [layers](libs/layers)                                 | Abstract structure of layers                                                                          |
| [nest-cesium](libs/nest-cesium)                       | Module for using Cesium in NestJS                                                                     |
| [nest-firestore](libs/nest-firestore)                 | Module for using Google Firestore in NestJS                                                           |
| [nest-plateau](libs/nest-plateau)                     | NestJS module for PLATEAU datasets                                                                    |
| [nest-terrain-tile](libs/nest-terrain-tile)           | NestJS module for rendering DEM terrain tiles                                                         |
| [nest-tile-cache](libs/nest-tile-cache)               | NestJS module for caching tile images                                                                 |
| [nest-vector-tile](libs/nest-vector-tile)             | NestJS module for rendering vector map tiles                                                          |
| [pedestrian](libs/pedestrian)                         | Integration with Google Street View and WASD navigation                                               |
| [react-helpers](libs/react-helpers)                   | Helper functions and hooks for React                                                                  |
| [regional-mesh](libs/regional-mesh)                   | Converters for Japanese regional mesh                                                                 |
| [screen-space-selection](libs/screen-space-selection) | Screen-space selection for Cesium                                                                     |
| [shared-states](libs/shared-states)                   | Collection of states shared across libraries                                                          |
| [sketch](libs/sketch)                                 | Interaction for drawing extruded polygons                                                             |
| [type-helpers](libs/type-helpers)                     | Helper functions for TypeScript                                                                       |
| [ui-components](libs/ui-components)                   | UI components used in PLATEAU VIEW                                                                    |
| [vector-map-imagery](libs/vector-map-imagery)         | Renders texts in MVT by label entities                                                                |
| [view-layers](libs/view-layers)                       | Implementation of [layers](libs/layers) for PLATEAU VIEW                                              |
| [view](libs/view)                                     | Provides the main component                                                                           |
