module.exports = {
    "apps": [
        {
            "name": "eatery-bot",
            "script": "./src/index.js",
			"node_args": ["--experimental-modules", "--es-module-specifier-resolution=node"]
        }
    ]
}