<?php
use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\ErrorLogHandler;
use Monolog\Formatter\LineFormatter;
return [
    'default' => env('LOG_CHANNEL', 'stack'),
    'deprecations' => ['channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'), 'trace' => false],
    'channels' => [
        'stack' => ['driver' => 'stack', 'channels' => ['single'], 'ignore_exceptions' => false],
        'single' => ['driver' => 'single', 'path' => storage_path('logs/laravel.log'), 'level' => env('LOG_LEVEL', 'debug'), 'replace_placeholders' => true],
        'stderr' => ['driver' => 'monolog', 'handler' => StreamHandler::class, 'with' => ['stream' => 'php://stderr'], 'level' => env('LOG_LEVEL', 'debug'), 'formatter' => LineFormatter::class, 'replace_placeholders' => true],
        'errorlog' => ['driver' => 'monolog', 'handler' => ErrorLogHandler::class, 'level' => env('LOG_LEVEL', 'debug'), 'replace_placeholders' => true],
        'null' => ['driver' => 'monolog', 'handler' => NullHandler::class],
    ],
];
