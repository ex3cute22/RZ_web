<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;
class PhotoServiceProvider
{
    protected $base64_code;


    public function createPhotoPack($photo_id, array $images)
    {
        //Storage::disk('local')->put('example.txt', 'Contents');
        Storage::disk("local")->makeDirectory($photo_id);
        //цикл

        $file = $request->file('photo');
 
        $file = $request->photo;

        // foreach ($images as $key => $data) {
        //     $path = $photo_id.'/'.$key.'.jpeg';
        //     $data = base64_decode($data);
        //     Storage::disk("google")->put($path,$data);

        //     Storage::disk("local")->put('public/'.$path,$data);
        // }
    }
}
