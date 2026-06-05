<?php

// config/cors.php
// Autorise React (localhost:5173 en dev) à appeler l'API Laravel

return [
    'paths'                => ['api/*'],
    'allowed_methods'      => ['*'],
    'allowed_origins'      => [
        'http://localhost:5173',   // Vite dev server
        'http://localhost:3000',   // Create React App
        env('FRONTEND_URL', ''),   // Production : mettre l'URL du front
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers'      => ['*'],
    'exposed_headers'      => ['Content-Disposition'],
    'max_age'              => 0,
    'supports_credentials' => false,
];