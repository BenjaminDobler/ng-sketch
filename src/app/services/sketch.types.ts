/*
export interface string = string // with string v4 format

export interface SketchPositionString = string // '{0.5; 0.67135115527602085}'

export interface SketchNestedPositionString = string // '{{0; 0}; {75.5; 15}}'

export interface Base64String = string

export interface FilePathString = string
*/


export const SKETCH_LAYER_TYPE_TEXT:string = 'text';



interface SketchImageCollection  {
  _class: string;//'imageCollection';
  images: any; // TODO
}

export interface SketchColor  {
  _class: string; //'color';
  alpha: number;
  blue: number;
  green: number;
  red: number;
}

export interface SketchBorder  {
  _class: string; //'border';
  isEnabled: boolean;
  color: SketchColor;
  fillType: number;
  position: number;
  thickness: number
}

export interface SketchGradientStop  {
  _class: string; //'gradientStop';
  color: SketchColor;
  position: number
}

export interface SketchGradient  {
  _class: string; //gradient';
  elipseLength: number;
  from: string;
  gradientType: number;
  shouldSmoothenOpacity: boolean;
  stops: [SketchGradientStop];
  to: string
}

export interface SketchGraphicsContextSettings  {
  _class: string; //'graphicsContextSettings';
  blendMode: number;
  opacity: number
}

export interface SketchInnerShadow  {
  _class: string; //'innerShadow';
  isEnabled: boolean;
  blurRadius: number;
  color: SketchColor;
  contextSettings: SketchGraphicsContextSettings;
  offsetX: 0;
  offsetY: 1;
  spread: 0
}

export interface SketchFill  {
  _class: string; //'fill';
  isEnabled: boolean;
  color: SketchColor;
  fillType: number;
  gradient: SketchGradient;
  noiseIndex: number;
  noiseIntensity: number;
  patternFillType: number;
  patternTileScale: number
}

export interface SketchShadow  {
  _class: string; //'shadow';
  isEnabled: boolean;
  blurRadius: number;
  color: SketchColor;
  contextSettings: SketchGraphicsContextSettings;
  offsetX: number;
  offsetY: number;
  spread: number
}

export interface SketchBlur  {
  _class: string; //'blur';
  isEnabled: boolean;
  center: SketchPositionString;
  motionAngle: number;
  radius: number;
  export interface: number
}

export interface SketchEncodedAttributes  {
  NSKern: number;
  MSAttributedStringFontAttribute: {
    _archive: Base64String;
  };
  NSParagraphStyle: {
    _archive: Base64String
  };
  NSColor: {
    _archive: Base64String
  }
}

export interface SketchRect  {
  _class: string; //rect';
  constrainProportions: boolean;
  height: number;
  width: number;
  x: number;
  y: number
}

export interface SketchTextStyle  {
  _class: string; //textStyle';
  encodedAttributes: SketchEncodedAttributes
}

export interface SketchBorderOptions  {
  _class: string; //borderOptions';
  do_objectID: string;
  isEnabled: boolean;
  dashPattern: []; // TODO;
  lineCapStyle: number;
  lineJoinStyle: number
}

export interface SketchColorControls  {
  _class: string; //colorControls';
  isEnabled: boolean;
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number
}

export interface SketchStyle  {
  _class: string; //style';
  blur: ?[SketchBlur];
  borders: ?[SketchBorder];
  borderOptions: ?SketchBorderOptions;
  contextSettings: ?SketchGraphicsContextSettings;
  colorControls: ?SketchColorControls;
  endDecorationType: number;
  fills: [SketchFill];
  innerShadows: [SketchInnerShadow];
  miterLimit: number;
  shadows: ?[SketchShadow];
  sharedObjectID: string;
  startDecorationType: number;
  textStyle: ?SketchTextStyle
}

export interface SketchSharedStyle  {
  _class: string; //sharedStyle';
  do_objectID: string;
  name: string;
  value: SketchStyle
}

export interface SketchExportFormat  {
  _class: string; //exportFormat';
  absoluteSize: number;
  fileFormat: string;
  name: string;
  namingScheme: number;
  scale: number;
  visibleScaleType: number
}

export interface SketchExportOptions  {
  _class: string; //exportOptions';
  exportFormats: [SketchExportFormat];
  includedLayerIds: []; // TODO
  layerOptions: number;
  shouldTrim: boolean
}

export interface SketchSharedStyleContainer  {
  _class: string; //sharedStyleContainer';
  objects: [SketchSharedStyle]
}

export interface SketchSymbolContainer  {
  _class: string; //symbolContainer';
  objects: [] // TODO
}

export interface SketchSharedTextStyleContainer {
  _class: string; //sharedTextStyleContainer';
    objects: [SketchSharedStyle]
}

export interface SketchAssetsCollection  {
  _class: string; //assetCollection';
  colors: []; // TODO
  gradients: []; // TODO
  imageCollection: SketchImageCollection;
  images: [] // TODO
}

export interface SketchMSJSONFileReference  {
  _class: string; //MSJSONFileReference';
  _ref_class: string; //MSImmutablePage' | 'MSImageData';
  _red: FilePathString
}

export interface SketchMSAttributedString  {
  _class: string; //MSAttributedString';
  archivedAttributedString: {
    _archive: Base64String
  }
}

export interface SketchCurvePoint  {
  _class: string; //curvePoint';
  do_objectID: string;
  cornerRadius: number;
  curveFrom: string;//SketchPositionString;
  curveMode: number;
  curveTo: string;//SketchPositionString;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  point: string;//SketchPositionString
}

export interface SketchRulerData  {
  _class: string; //rulerData';
  base: number;
  guides: [] // TODO
}

export interface SketchText  {
  _class: string; //text';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedVertical: boolean;
  isFlippedHorizontal: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  originalObjectID: string;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  attributedString: SketchMSAttributedString;
  automaticallyDrawOnUnderlyingPath: boolean;
  dontSynchroniseWithSymbol: boolean;
  glyphBounds: string;//SketchNestedPositionString;
  heightIsClipped: boolean;
  lineSpacingBehaviour: number;
  textBehaviour: number
}

export interface SketchShapeGroup  {
  _class: string; //shapeGroup';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedVertical: boolean;
  isFlippedHorizontal: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  originalObjectID: string;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  hasClickThrough: boolean;
  layers: [SketchLayer];
  clippingMaskMode: number;
  hasClippingMask: boolean;
  windingRule: number
}

export interface SketchPath  {
  _class: string; //path';
  isClosed: boolean;
  points: [SketchCurvePoint]
}

export interface SketchShapePath  {
  _class: string; //shapePath';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedVertical: boolean;
  isFlippedHorizontal: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  booleaneanOperation: number;
  edited: boolean;
  path: SketchPath
}

export interface SketchArtboard  {
  _class: string; //artboard';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  hasClickThrough: boolean;
  layers: [SketchLayer];
  backgroundColor: SketchColor;
  hasBackgroundColor: boolean;
  horizontalRulerData: SketchRulerData;
  includeBackgroundColorInExport: boolean;
  includeInCloudUpload: boolean;
  verticalRulerData: SketchRulerData
}

export interface SketchBitmap  {
  _class: string; //bitmap';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  clippingMask: string;//SketchNestedPositionString;
  fillReplacesImage: boolean;
  image: SketchMSJSONFileReference;
  nineSliceCenterRect: string;//SketchNestedPositionString;
  nineSliceScale: string;//SketchPositionString
}

export interface SketchSymbolInstance  {
  _class: string; //symbolInstance';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  horizontalSpacing: number;
  masterInfluenceEdgeMaxXPadding: number;
  masterInfluenceEdgeMaxYPadding: number;
  masterInfluenceEdgeMinXPadding: number;
  masterInfluenceEdgeMinYPadding: number;
  symbolID: number;
  verticalSpacing: number;
  overrides: any;
}

export interface SketchGroup  {
  _class: string; //group';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  originalObjectID: string;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  hasClickThrough: boolean;
  layers: [SketchLayer]
}

export interface SketchRectangle  {
  _class: string; //rectangle';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  booleaneanOperation: number;
  edited: boolean;
  path: SketchPath;
  fixedRadius: number;
  hasConvertedToNewRoundCorners: boolean
}

export interface SketchOval  {
  _class: string; //oval';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  booleaneanOperation: number;
  edited: boolean;
  path: SketchPath
}

export interface SketchLayer =
| SketchText
| SketchShapeGroup
| SketchShapePath
| SketchBitmap
| SketchArtboard
| SketchSymbolInstance
| SketchGroup
| SketchRectangle
| SketchOval

export interface SketchSymbolMaster  {
  backgroundColor: SketchColor;
  _class: string; //symbolMaster';
  do_objectID: string;
  exportOptions: [SketchExportOptions];
  frame: SketchRect;
  hasBackgroundColor: boolean;
  hasClickThrough: boolean;
  horizontalRulerData: SketchRulerData;
  includeBackgroundColorInExport: boolean;
  includeBackgroundColorInInstance: boolean;
  includeInCloudUpload: boolean;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  layers: [SketchLayer];
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  symbolID: string;
  verticalRulerData: SketchRulerData
}

// document.json
export interface SketchDocument  {
  _class: string; //document';
  do_objectID: string;
  assets: SketchAssetsCollection;
  currentPageIndex: number;
  enableLayerInteraction: boolean;
  enableSliceInteraction: boolean;
  foreignSymbols: []; // TODO
  layerStyles: SketchSharedStyleContainer;
  layerSymbols: SketchSymbolContainer;
  layerTextStyles: SketchSharedTextStyleContainer;
  pages: [SketchMSJSONFileReference]
}

// pages/*.json
export interface SketchPage  {
  _class: string; //page';
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame: SketchRect;
  hasClickThrough: boolean;
  horizontalRulerData: SketchRulerData;
  includeInCloudUpload: boolean;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  layers: [SketchSymbolMaster];
  name: string;
  nameIsFixed: boolean;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
  verticalRulerData: SketchRulerData
}

// meta.json
export interface SketchMeta  {
  commit: string;
  appVersion: string;
  build: number;
  app: string;
  pagesAndArtboards: {
    [key: string]: { name: string }
  };
  fonts: [string]; // Font names
  version: number;
  saveHistory: [ string ]; // 'BETA.38916'
  autosaved: number;
  variant: string // 'BETA'
}

/*
export interface SketchDocumentId = string

export interface SketchPageId = string

// user.json
export interface SketchUser  {
  [key: SketchPageId]: {
    scrollOrigin: SketchPositionString;
    zoomValue: number
  };
  [key: SketchDocumentId]: {
    pageListHeight: number;
    cloudShare: any // TODO
  }
}
*/
