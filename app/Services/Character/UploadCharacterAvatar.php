<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;

class UploadCharacterAvatar
{
     public function upload($file): string
    {
        $filename = 'char_' . Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = Storage::disk('s3')->putFileAs(
            'characters',
            $file,
            $filename,
            'public'
        );

        return Storage::disk('s3')->url($path);
    }
}