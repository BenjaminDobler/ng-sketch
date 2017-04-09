/**
 * Created by benjamindobler on 08.04.17.
 */


import {SketchService} from "./sketch.service";
/**
 * Created by benjamindobler on 08.04.17.
 */


export class Sketch2Svg {


  convert(data, service: SketchService) {


    const addMask = layer => layer.maskId ? `mask="url(#mask${layer.maskId})"` : '';

    const insertLayers = (parentLayer, layers) => {

      let masks = '';
      if (parentLayer.masks) {
        parentLayer.masks.forEach((mask) => {
          masks += '<defs>';
          mask.layers.forEach((maskLayer) => {
            let m = `<mask id="mask${mask.id}" >
          <path d="${service.getPath(maskLayer.path, maskLayer)}" fill="white"/>
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
            return `<g>
                    <defs>
                      <path id="${layer.id}" d="${service.getPath(layer.layers[0].path, layer)}" transform="${service.getTransformation(data)}"/>
                    </defs>
                    <use ${addMask(layer)} stroke="${service.getStrokeColor(layer)}" stroke-width="${service.getStrokeWidth(layer)}" fill="${service.getFill(layer)}" fill-rule="evenodd" xlink:href="#${layer.id}"></use>
                  </g>`;


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
      <svg height="1000" width="1000" fill="#fff">
      ${insertLayers(data, data.layers)}
      </svg>`;
      return tmpl;
    };

    return layerG(data);

  }


}

