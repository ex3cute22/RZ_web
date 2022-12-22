<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;


class CORS {
    public function handle($request, Closure $next)
    {
        /** @var Response $response */
        $response = $next($request);
        return $response->header('Access-Control-Allow-Origin' , '*')
            ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin');
    }
}