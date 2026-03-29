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
        $filename = 'char_' . Str::uuid() . '.' . $file->getClientOriginalExtension();

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('cloud');

        $path = $disk->putFileAs('characters', $file, $filename);

        return $disk->url($path);
    }
}