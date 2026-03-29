<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UploadCharacterAvatar
{
    public function upload($file)
    {
        
        $filename = 'char_' . Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = Storage::disk('cloud')->putFileAs(
            'characters',
            $file,
            $filename
        );

        return Storage::disk('cloud')->url($path); // ✅ FIX
    }
}