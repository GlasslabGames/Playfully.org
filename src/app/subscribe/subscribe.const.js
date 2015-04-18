angular.module('subscribe.const', [])

    .constant('SUBSCRIBE_CONSTANTS', {
        "ipad": {
          title: "iPad",
          description: "Games in this package are optimized to work on iPads."
        },
        "pcMac": {
            title: "PC/Mac",
            description: "Games in this package run on PC or Mac computers."
        },
        "chromebook": {
            title: "Chromebook",
            description: "Games in this package are optimized to work on Chromebooks."
        },
        "allGames": {
            title: "All Games",
            description: "This package includes all games available on this site."
        }
    });