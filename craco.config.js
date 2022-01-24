module.exports = {
    style: {
        postcss: {
            plugins: [
                require("tailwindcss"),
                require("autoprefixer")
            ]
        }
    },
    // webpack: {
    //     rules: [
    //         {
    //             use: {
    //                 loader: "babel-loader",
    //                 options: {
    //                     presets: ["@babel/preset-env"],
    //                     ignore: ["./node_modules/mapbox-gl/dist/mapbox-gl.js"]
    //                 }
    //             }
    //         }
    //     ]
    // }
    babel: {
        loaderOptions: {
            ignore: ["./node_modules/mapbox-gl/dist/mapbox-gl.js"]
        }
    }
}