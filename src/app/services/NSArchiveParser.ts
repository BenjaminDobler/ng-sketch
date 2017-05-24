/**
 * Created by benjamindobler on 08.04.17.
 */


export class NSArchiveParser {


  public parse(archive: any) {

    let result: any = {};

    let objects = archive[0].$objects;
    console.log("Objects ", objects);
    let root = archive[0].$top.root.UID;

    let getReferenceById = (id) => {
      let r: any = {};
      let o: any = objects[id];
      if (typeof o === "string" || typeof o === "number" || typeof o === "boolean") {
        return o;
      }


      if (typeof o === "object") {
        for (var i in o) {
          if (o[i].UID) {
            r[i] = getReferenceById(o[i].UID);
          } else if (Array.isArray(o[i]) && i !== "NS.keys" && i !== "NS.objects") {
            r[i] = [];
            o[i].forEach((ao) => {
              if (ao.UID) {
                r[i].push(getReferenceById(ao.UID));
              } else {
                r[i].push(ao);
              }
            });
          } else if(i !== "NS.keys" && i !== "NS.objects") {
            r[i] = o[i];
          }

        }
      }

      if (o['NS.keys']) {
        o['NS.keys'].forEach((keyObj: any, index: number) => {
          let key = getReferenceById(keyObj.UID);
          let obj = getReferenceById(o['NS.objects'][index].UID);
          r[key] = obj;
        });
      }
      return r;
    };


    let topObj = objects[root];
    for (var key in topObj) {
      if (topObj[key].UID) {
        result[key] = getReferenceById(topObj[key].UID);
      }
    }
    return result;
    /*
     for(var i in topObj) {
     console.log("i ", i);
     console.log('i UID' , topObj[i].UID);
     if(topObj[i].UID['NS.keys']) {
     console.log("Keys ", topObj[i].UID['NS.keys']);
     }
     }
     */


  }


}
