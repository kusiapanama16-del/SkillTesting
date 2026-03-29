<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;

class UploadCharacterAvatar
{
    public function upload(UploadedFile $file): string
    {
        // 🔥 generate filename unik
        $filename = 'char_' . Str::uuid() . '.' . $file->getClientOriginalExtension();

        // 🔥 upload ke storage (WAJIB visibility public)
        $path = Storage::disk('s3')->putFileAs(
            'characters',
            $file,
            $filename,
            [
                'visibility' => 'public',
            ]
        );

        // 🚨 FAIL SAFE
        if (!$path) {
            throw new \Exception('Upload avatar failed');
        }

        // 🔥 build URL manual (PALING STABIL DI LARAVEL CLOUD)
        return rtrim(env('AWS_URL'), '/') . '/' . ltrim($path, '/');
    }
}