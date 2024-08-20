const mockRetry = (f) => {
  console.log("mock retry")
  return f();
}
export const mockHttpClient = () => {
  return {
    // http client members
    getActualFootPrint: jest.fn(),
    reqAndRetry: jest.fn(mockRetry),

    // http client implementations
    getActualFootPrintResolved: jest.fn().mockResolvedValue(geometry),
    getActualFootPrintRejected: jest.fn().mockRejectedValue(new Error()),
  }
};

export interface mockHttpClientProps {
  getActualFootPrint: typeof jest.fn

  getActualFootPrintResolved: typeof jest.fn
  getActualFootPrintRejected: typeof jest.fn
}

const geometry = {
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [
          35.216957910600726,
          32.18392580314928
        ],
        [
          35.279986354762556,
          32.18392580314928
        ],
        [
          35.279986354762556,
          32.26311538683978
        ],
        [
          35.216957910600726,
          32.26311538683978
        ],
        [
          35.216957910600726,
          32.18392580314928
        ]
      ]
    ]
  ]
}