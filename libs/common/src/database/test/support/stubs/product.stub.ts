import { ProductEntity } from "@app/common/database/entities"

export const productEntityStubSouthGaza = (): ProductEntity => {
  return {
    "id": "ca93a3c1-fc90-4009-ae1d-68db1737defd",
    "productId": "בול עזה דרום",
    "productName": "בול עזה דרום",
    "productVersion": 4,
    "productType": "Orthophoto",
    "productSubType": 0,
    "imagingTimeBeginUTC": new Date("2023-02-07T16:46:00.000Z"),
    "imagingTimeEndUTC": new Date("2023-11-03T08:04:00.000Z"),
    "maxResolutionDeg": 0.0000013411,
    "footprint": "{\"type\":\"MultiPolygon\",\"coordinates\":[[[[34.2116883221938,31.311867581309897],[34.2116897089966,31.3118641573041],[34.2116897089976,31.227936385991597],[34.2459670299291,31.227936101738603],[34.2459711173956,31.227936101705],[34.2459704437018,31.2279350368281],[34.2628456359141,31.227936385949203],[34.2628436591178,31.227938768530105],[34.2628468814547,31.2279362234215],[34.3240211504192,31.2279362831295],[34.3240210860269,31.2279363859953],[34.3416452540318,31.227936385998202],[34.36470868192651,31.227936385999097],[34.3647084047468,31.227936831709],[34.364712579775,31.2279363228462],[34.4294103910049,31.2279363859967],[34.4294107734095,31.2741536578386],[34.4294103910002,31.2741535974885],[34.4294103910003,31.415913805997004],[34.3647104983164,31.415913805999597],[34.3647104665298,31.4159157816121],[34.3347960519707,31.415915395399203],[34.3347961075848,31.415913805985802],[34.3207134673545,31.415913805985802],[34.320712722445,31.4159152135678],[34.2116897089996,31.4159138060111],[34.2116897089969,31.3220117475012],[34.2116897089918,31.311865527674],[34.2116883221938,31.311867581309897]]],[[[34.48743438600227,31.59581698275769],[34.51481253069146,31.576299133534945],[34.519959651906056,31.576153277322415],[34.51815318032448,31.610555573914038],[34.49611893517725,31.609874128119685],[34.49063419398115,31.59956772367661],[34.48743438600227,31.59581698275769]]]]}",
    "transparency": "OPAQUE",
    "region": "עזה",
    "ingestionDate": new Date("2024-01-01T15:23:50.000Z")
  } as ProductEntity
}

// export const productEntityStubArea3 = (): ProductEntity => {
//   return {
//     "id": "de23f540-505b-423e-9de7-ff25a2ab9282",
//     "productId": "אזור 3",
//     "productName": "אזור 3",
//     "productVersion": "1",
//     "productType": "Orthophoto",
//     "imagingTimeBeginUTC": new Date("2023-12-01T12:55:00.000Z"),
//     "imagingTimeEndUTC": new Date("2023-12-02T12:55:00.000Z"),
//     "maxResolutionDeg": 0.00000268220901489258,
//     "footprint": "{\"bbox\":[34.487616832942244,31.57612611926054,34.51983470580666,31.610491990011344],\"type\":\"Polygon\",\"coordinates\":[[[34.49618385822665,31.60983722350066],[34.51811397850596,31.610491990011344],[34.51983470580666,31.57612611926054],[34.51478235756202,31.576313263585863],[34.487616832942244,31.59583659017008],[34.49072878657119,31.59945388195154],[34.49618385822665,31.60983722350066]]]}",
//     "transparency": "OPAQUE",
//     "region": "עזה",
//     "ingestionDate": new Date("2023-12-26T15:09:35.000Z")
//   } as ProductEntity
// }

// export const productEntityStubGaza3 = (): ProductEntity => {
//   return {
//     "id": "eaf51994-bdc2-4369-b725-63cbad7a5baf",
//     "productId": "אזור 3 עזה",
//     "productName": "אזור 3 עזה",
//     "productVersion": "1",
//     "productType": "Orthophoto",
//     "description": "אזור עם שוליים שחורים לבדיקה מול גטמאפ",
//     "imagingTimeBeginUTC": new Date("2023-02-07T16:46:00.000Z"),
//     "imagingTimeEndUTC": new Date("2023-02-07T16:46:00.000Z"),
//     "maxResolutionDeg": 0.00000268220901489258,
//     "footprint": "{\"bbox\":[34.48743438600227,31.576153277322415,34.519959651906056,31.610555573914038],\"type\":\"Polygon\",\"coordinates\":[[[34.48743438600227,31.59581698275769],[34.49063419398115,31.59956772367661],[34.49611893517725,31.609874128119685],[34.51815318032448,31.610555573914038],[34.519959651906056,31.576153277322415],[34.51481253069146,31.576299133534945],[34.48743438600227,31.59581698275769]]]}",
//     "transparency": "OPAQUE",
//     "region": "עזה",
//     "ingestionDate": new Date("2023-11-18T16:59:23.000Z")
//   } as ProductEntity
// }

export const productEntityStubNorthGaza = (): ProductEntity => {
  return {
    "id": "045eaa61-8f61-48d3-a240-4b02a683eca3",
    "productId": "בול עזה צפון",
    "productName": "בול עזה צפון",
    "productVersion": 2,
    "productType": "Orthophoto",
    "description": "test desription",
    "imagingTimeBeginUTC": new Date("2023-11-01T09:31:00.000Z"),
    "imagingTimeEndUTC": new Date("2023-11-05T09:31:00.000Z"),
    "maxResolutionDeg": 0.0000013411,
    "footprint": "{\"type\":\"Polygon\",\"coordinates\":[[[34.388709841231474,31.435415286905005],[34.606444758516666,31.435415286905005],[34.606444758516666,31.623449225481167],[34.388709841231474,31.623449225481167],[34.388709841231474,31.435415286905005]]]}",
    "transparency": "OPAQUE",
    "region": "עזה",
    "ingestionDate": new Date("2023-11-15T12:49:54.000Z")
  } as ProductEntity
}

export const productEntityStubNorthGazaRecent = (): ProductEntity => {
  return {
    "id": "7a2ad240-c8a9-44a9-ae67-915144abec49",
    "productId": "עזה צפון בדיקת עדכון",
    "productName": "עזה צפון בדיקת עדכון",
    "productVersion": 1,
    "productType": "Orthophoto",
    "imagingTimeBeginUTC": new Date("2024-01-25T01:21:00.000Z"),
    "imagingTimeEndUTC": new Date("2024-01-25T03:48:00.000Z"),
    "maxResolutionDeg": 0.00000536441802978516,
    "footprint": "{\"type\":\"Polygon\",\"coordinates\":[[[34.621911284997424,31.545293588151438],[34.52867764267296,31.552055574098873],[34.49793037765059,31.485259500096348],[34.53462872622515,31.401062364453793],[34.629350139437605,31.41418347490888],[34.621911284997424,31.545293588151438]]]}",
    "transparency": "OPAQUE",
    "region": "עזה",
    "ingestionDate": new Date("2024-01-25T11:49:39.000Z")
  } as ProductEntity
}

