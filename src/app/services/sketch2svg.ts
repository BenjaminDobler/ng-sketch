/**
 * Created by benjamindobler on 08.04.17.
 */


import {SketchService} from "./sketch.service";
/**
 * Created by benjamindobler on 08.04.17.
 */


export class Sketch2Svg {


  convert(data, service: SketchService, symbolId:string='') {

    console.log(data);

    const addMask = layer => layer.maskId ? `mask="url(#mask${layer.maskId})"` : '';

    const insertLayers = (parentLayer, layers) => {
      console.log("Layers", layers)
      let masks = '';
      if (parentLayer.masks) {
        parentLayer.masks.forEach((mask) => {
          masks += '<defs>';
          mask.layers.forEach((maskLayer) => {
            let m = `<mask id="mask${mask.id}" >
          <path d="${maskLayer.$$path}" fill="white"/>
         </mask>`;
            masks += m;
          });

          masks += '</defs>';
        });
      }


      let con = [];
      if (layers) {
         con = layers.map((layer) => {
          if (layer._class === 'shapeGroup') {
            let shapeMarkup = `<g><defs>`;
            layer.layers.forEach((pathLayer)=>{
              if (!pathLayer.$$isRect) {
                shapeMarkup += `<path id="${pathLayer.id}" d="${pathLayer.$$path}" transform="${data.$$transform}"/>`;
              } else {
                shapeMarkup += `<rect id="${pathLayer.id}" x="${pathLayer.frame.x}" y="${pathLayer.frame.y}" width="${pathLayer.frame.width}" height="${pathLayer.frame.height}" transform="${data.$$transform}"/>`;
              }
            });
            shapeMarkup += `</defs>`;
            layer.layers.forEach((pathLayer)=>{
              shapeMarkup += `<use ${addMask(pathLayer)} stroke="${layer.$$strokeColor}" stroke-width="${layer.$$strokeWidth}" fill="${layer.$$fill}" fill-rule="evenodd" xlink:href="#${pathLayer.id}"></use>`;
            });
            shapeMarkup += '</g>';



            return shapeMarkup;


          } else if (layer._class === 'group' || layer._class === 'artboard' || layer._class === "page") {

            return `<g>${insertLayers(layer, layer.layers)}</g>`;
          } else if (layer._class === 'bitmap') {
            return `<image ${addMask(layer)}
            x="${layer.frame.x}"
            y="${layer.frame.y}"
            xlink:href="${service.getImageData(layer)}"
            height="${layer.frame.width}"
            width="${layer.frame.height}" />`;
          }
        });
      }

      return masks + ' ' + con.join('');
    };

    const layerG = data => {
      let tmpl: string = `
      <svg height="1000" width="1000" fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${insertLayers(data, data.layers)}
      </svg>`;
      return tmpl;
    };


    if (symbolId != '') {
      //data = service.layerNameMap[symbolId];
      console.log("Data for SVG", data);

      data = {
        layers: [service.layerNameMap[symbolId]]
      };


    }

    return layerG(data);

  }


}

