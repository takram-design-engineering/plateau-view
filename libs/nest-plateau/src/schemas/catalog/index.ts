// Code generated by jtd-codegen for TypeScript v0.2.1

export type PlateauCatalog0 = PlateauCatalog1 | PlateauCatalog2 | PlateauCatalog3 | PlateauCatalog4 | PlateauCatalog5 | PlateauCatalog6 | PlateauCatalog7 | PlateauCatalog8 | PlateauCatalog9 | PlateauCatalog10 | PlateauCatalog11 | PlateauCatalog12 | PlateauCatalog13 | PlateauCatalog14 | PlateauCatalog15 | PlateauCatalog16 | PlateauCatalog17 | PlateauCatalog18 | PlateauCatalog19 | PlateauCatalog20 | PlateauCatalog21 | PlateauCatalog22 | PlateauCatalog23;

export enum PlateauCatalogTypeEn {
  Folder = "folder",
}

export interface PlateauCatalog1 {
  type: "フォルダ";
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn;
  city?: string;
  city_code?: string;
  desc?: string;
}

export enum PlateauCatalogTypeEn0 {
  Usecase = "usecase",
}

export enum PlateauCatalogConfigDaumType {
  DTiles = "3D Tiles",
  Czml = "CZML",
  GeoJson = "GeoJSON",
  Tms = "TMS",
  GlTf = "glTF",
}

export interface PlateauCatalogConfigDaum {
  name: string;
  type: PlateauCatalogConfigDaumType;
  url: string;
}

export interface PlateauCatalogConfig {
  data: PlateauCatalogConfigDaum[];
}

export enum PlateauCatalogFormat {
  Dtiles = "3dtiles",
  Csv = "csv",
  Czml = "czml",
  Geojson = "geojson",
  Gltf = "gltf",
  Gtfs = "gtfs",
  Mvt = "mvt",
  Tiles = "tiles",
  Tms = "tms",
  Wms = "wms",
}

export interface PlateauCatalog2 {
  type: "ユースケース";
  id: string;
  name: string;
  pref: string;
  type_en: PlateauCatalogTypeEn0;
  year: number;
  city?: string;
  city_code?: string;
  config?: PlateauCatalogConfig;
  desc?: string;
  format?: PlateauCatalogFormat;
  layers?: string[];
  order?: number;
  pref_code?: string;
  url?: string;
  ward?: string;
  ward_code?: string;
}

export enum PlateauCatalogFormat0 {
  Czml = "czml",
}

export enum PlateauCatalogTypeEn1 {
  Landmark = "landmark",
}

export enum PlateauCatalogConfigDaumType0 {
  Czml = "CZML",
  Czml0 = "czml",
}

export interface PlateauCatalogConfigDaum0 {
  name: string;
  type: PlateauCatalogConfigDaumType0;
  url: string;
}

export interface PlateauCatalogConfig0 {
  data: PlateauCatalogConfigDaum0[];
}

export interface PlateauCatalog3 {
  type: "ランドマーク情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat0;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn1;
  year: number;
  city_code?: string;
  config?: PlateauCatalogConfig0;
  openDataUrl?: string;
  url?: string;
  ward?: string;
  ward_code?: string;
}

export enum PlateauCatalogFormat1 {
  Geojson = "geojson",
}

export enum PlateauCatalogTypeEn2 {
  Park = "park",
}

export interface PlateauCatalog4 {
  type: "公園情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat1;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn2;
  url: string;
  year: number;
  city_code?: string;
  openDataUrl?: string;
}

export enum PlateauCatalogFormat2 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn3 {
  Ifld = "ifld",
}

export interface PlateauCatalog5 {
  type: "内水浸水想定区域モデル";
  city: string;
  city_code: string;
  city_en: string;
  desc: string;
  format: PlateauCatalogFormat2;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn3;
  url: string;
  year: number;
}

export enum PlateauCatalogFormat3 {
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn4 {
  Luse = "luse",
}

export interface PlateauCatalog6 {
  type: "土地利用モデル";
  city: string;
  city_code: string;
  city_en: string;
  desc: string;
  format: PlateauCatalogFormat3;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn4;
  url: string;
  year: number;
}

export enum PlateauCatalogFormat4 {
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn5 {
  Lsld = "lsld",
}

export interface PlateauCatalog7 {
  type: "土砂災害警戒区域モデル";
  city: string;
  city_code: string;
  city_en: string;
  desc: string;
  format: PlateauCatalogFormat4;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn5;
  url: string;
  year: number;
}

export enum PlateauCatalogConfigDaumType1 {
  Dtiles = "3dtiles",
}

export interface PlateauCatalogConfigDaum1 {
  name: string;
  type: PlateauCatalogConfigDaumType1;
  url: string;
}

export interface PlateauCatalogConfig1 {
  data: PlateauCatalogConfigDaum1[];
}

export enum PlateauCatalogFormat5 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn6 {
  Bldg = "bldg",
}

export interface PlateauCatalog8 {
  type: "建築物モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig1;
  desc: string;
  format: PlateauCatalogFormat5;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn6;
  url: string;
  year: number;
  bldg_no_texture_url?: string;
  itemId?: string;
  search_index?: string;
  ward?: string;
  ward_code?: string;
  ward_en?: string;
}

export enum PlateauCatalogConfigDaumType2 {
  Dtiles = "3dtiles",
}

export interface PlateauCatalogConfigDaum2 {
  name: string;
  type: PlateauCatalogConfigDaumType2;
  url: string;
}

export interface PlateauCatalogConfig2 {
  data: PlateauCatalogConfigDaum2[];
}

export enum PlateauCatalogFormat6 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn7 {
  Veg = "veg",
}

export interface PlateauCatalog9 {
  type: "植生モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig2;
  desc: string;
  format: PlateauCatalogFormat6;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn7;
  url: string;
  year: number;
}

export enum PlateauCatalogConfigDaumType3 {
  Dtiles = "3dtiles",
}

export interface PlateauCatalogConfigDaum3 {
  layer: string[];
  name: string;
  type: PlateauCatalogConfigDaumType3;
  url: string;
}

export interface PlateauCatalogConfig3 {
  data: PlateauCatalogConfigDaum3[];
}

export enum PlateauCatalogFormat7 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn8 {
  Brid = "brid",
}

export interface PlateauCatalog10 {
  type: "橋梁モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig3;
  desc: string;
  format: PlateauCatalogFormat7;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn8;
  url: string;
  year: number;
}

export enum PlateauCatalogConfigDaumType4 {
  Mvt = "mvt",
}

export interface PlateauCatalogConfigDaum4 {
  layer: string[];
  name: string;
  type: PlateauCatalogConfigDaumType4;
  url: string;
}

export interface PlateauCatalogConfig4 {
  data: PlateauCatalogConfigDaum4[];
}

export enum PlateauCatalogFormat8 {
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn9 {
  Gen = "gen",
}

export interface PlateauCatalog11 {
  type: "汎用都市オブジェクトモデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig4;
  desc: string;
  format: PlateauCatalogFormat8;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn9;
  url: string;
  year: number;
}

export enum PlateauCatalogFormat9 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn10 {
  Tnm = "tnm",
}

export interface PlateauCatalog12 {
  type: "津波浸水想定区域モデル";
  city: string;
  city_code: string;
  city_en: string;
  desc: string;
  format: PlateauCatalogFormat9;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn10;
  url: string;
  year: number;
}

export enum PlateauCatalogConfigDaumType5 {
  Dtiles = "3dtiles",
}

export interface PlateauCatalogConfigDaum5 {
  name: string;
  type: PlateauCatalogConfigDaumType5;
  url: string;
}

export interface PlateauCatalogConfig5 {
  data: PlateauCatalogConfigDaum5[];
}

export enum PlateauCatalogFormat10 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn11 {
  Fld = "fld",
}

export interface PlateauCatalog13 {
  type: "洪水浸水想定区域モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig5;
  format: PlateauCatalogFormat10;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn11;
  url: string;
  year: number;
  desc?: string;
}

export enum PlateauCatalogFormat11 {
  Geojson = "geojson",
}

export enum PlateauCatalogTypeEn12 {
  EmergencyRoute = "emergency_route",
}

export interface PlateauCatalog14 {
  type: "緊急輸送道路情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat11;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn12;
  url: string;
  year: number;
  city_code?: string;
  openDataUrl?: string;
}

export enum PlateauCatalogFormat12 {
  Czml = "czml",
  Geojson = "geojson",
}

export enum PlateauCatalogTypeEn13 {
  Border = "border",
}

export interface PlateauCatalog15 {
  type: "行政界情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat12;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn13;
  url: string;
  year: number;
  city_code?: string;
  openDataUrl?: string;
}

export enum PlateauCatalogConfigDaumType6 {
  Dtiles = "3dtiles",
  Mvt = "mvt",
}

export interface PlateauCatalogConfigDaum6 {
  name: string;
  type: PlateauCatalogConfigDaumType6;
  url: string;
  layer?: string[];
}

export interface PlateauCatalogConfig6 {
  data: PlateauCatalogConfigDaum6[];
}

export enum PlateauCatalogFormat13 {
  Dtiles = "3dtiles",
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn14 {
  Tran = "tran",
}

export interface PlateauCatalog16 {
  type: "道路モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig6;
  desc: string;
  format: PlateauCatalogFormat13;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn14;
  url: string;
  year: number;
  layers?: string[];
}

export enum PlateauCatalogFormat14 {
  Czml = "czml",
  Geojson = "geojson",
}

export enum PlateauCatalogTypeEn15 {
  Shelter = "shelter",
}

export interface PlateauCatalog17 {
  type: "避難施設情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat14;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn15;
  url: string;
  city_code?: string;
  openDataUrl?: string;
  ward?: string;
  ward_code?: string;
  year?: number;
}

export enum PlateauCatalogFormat15 {
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn16 {
  Urf = "urf",
}

export interface PlateauCatalog18 {
  type: "都市計画決定情報モデル";
  city: string;
  city_code: string;
  city_en: string;
  format: PlateauCatalogFormat15;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type2: string;
  type2_en: string;
  type_en: PlateauCatalogTypeEn16;
  url: string;
  year: number;
  desc?: string;
}

export enum PlateauCatalogConfigDaumType7 {
  Dtiles = "3dtiles",
}

export interface PlateauCatalogConfigDaum7 {
  name: string;
  type: PlateauCatalogConfigDaumType7;
  url: string;
}

export interface PlateauCatalogConfig7 {
  data: PlateauCatalogConfigDaum7[];
}

export enum PlateauCatalogFormat16 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn17 {
  Frn = "frn",
}

export interface PlateauCatalog19 {
  type: "都市設備モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig7;
  desc: string;
  format: PlateauCatalogFormat16;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn17;
  url: string;
  year: number;
}

export enum PlateauCatalogConfigDaumType8 {
  Mvt = "mvt",
}

export interface PlateauCatalogConfigDaum8 {
  layer: string[];
  name: string;
  type: PlateauCatalogConfigDaumType8;
  url: string;
}

export interface PlateauCatalogConfig8 {
  data: PlateauCatalogConfigDaum8[];
}

export enum PlateauCatalogFormat17 {
  Mvt = "mvt",
}

export enum PlateauCatalogTypeEn18 {
  Rail = "rail",
}

export interface PlateauCatalog20 {
  type: "鉄道モデル";
  city: string;
  city_code: string;
  city_en: string;
  config: PlateauCatalogConfig8;
  desc: string;
  format: PlateauCatalogFormat17;
  id: string;
  layers: string[];
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn18;
  url: string;
  year: number;
}

export enum PlateauCatalogFormat18 {
  Geojson = "geojson",
}

export enum PlateauCatalogTypeEn19 {
  Railway = "railway",
}

export interface PlateauCatalog21 {
  type: "鉄道情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat18;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn19;
  url: string;
  year: number;
  city_code?: string;
  openDataUrl?: string;
}

export enum PlateauCatalogFormat19 {
  Czml = "czml",
}

export enum PlateauCatalogTypeEn20 {
  Station = "station",
}

export interface PlateauCatalog22 {
  type: "鉄道駅情報";
  city: string;
  desc: string;
  format: PlateauCatalogFormat19;
  id: string;
  name: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn20;
  url: string;
  year: number;
  city_code?: string;
  openDataUrl?: string;
  ward?: string;
  ward_code?: string;
}

export enum PlateauCatalogFormat20 {
  Dtiles = "3dtiles",
}

export enum PlateauCatalogTypeEn21 {
  Htd = "htd",
}

export interface PlateauCatalog23 {
  type: "高潮浸水想定区域モデル";
  city: string;
  city_code: string;
  city_en: string;
  desc: string;
  format: PlateauCatalogFormat20;
  id: string;
  name: string;
  openDataUrl: string;
  pref: string;
  pref_code: string;
  type_en: PlateauCatalogTypeEn21;
  url: string;
  year: number;
}

export type PlateauCatalog = PlateauCatalog0[];