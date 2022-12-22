<?php

namespace App\Http\Controllers;

use App\Models\Stones;
use App\Models\Minerals;
use App\Models\Territories;
use App\Models\MineralTerritory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChangeController extends Controller
{
    public function changeStones(Request $request)
    {
        $id_stone = $request->input('id_stone');
        $stone = Stones::where('id',$id_stone)->first();
        $stone->name = $request->input('name');
        
        $stone->save();

        return response()->json(Stones::where('id',$stone->id)->first()); 
    }

    public function changeTerritories(Request $request)
    {
        $id_territory = $request->input('id_territory');
        
        $territory = Territories::where('id',$id_territory)->first();
        $territory->name = $request->input('name');
        
        $territory->save();
        return response()->json(Territories::where('id',$territory->id)->first()); 
    }


    public function changeMinerals(Request $request)
    {

        $id_mineral = $request->input('id_mineral');
        
        $mineral = Minerals::where('id',$id_mineral)->first();
        

        $mineral->name = $request->input('name');
        $mineral->weight = $request->input('weight');
        $mineral->length = $request->input('length');
        $mineral->width = $request->input('width');
        $mineral->height = $request->input('height');
        $mineral->description = $request->input('description');
        $mineral->id_stone = $request->input('stone');
        
        $mineral->save();
        

        
        if($request->input('delete_photos') != null)
        {
            $delete_photos = $request->input('delete_photos');
            foreach($delete_photos as $photo)
            {
                $photo = substr($photo ,strlen(env('DOMEN_URL')."/storage"));
                //$photo = $this->getStringBetween($photo,env('DOMEN_URL')."/storage",".jpeg");
                echo("public".$photo."\n");
                Storage::disk("local")->delete("public".$photo);
            }
        }
        



        if($request->input('photos') != null)
        {
            $photos = Storage::disk("local")->allFiles("public/photo/$mineral->id");

            if(count($photos) == 0)
            {
                $max = 0;
                $i = ((int)$max);
                
            }
            else{
                $max = $this->getStringBetween(Storage::url($photos[count($photos) - 1]),$mineral->id."/",".");
                $i = ((int)$max);
                $i++;
            }

            

           
           


            $files = $request->input('photos');
            foreach($files as $file)
            {
               $file = base64_decode($file);  
               Storage::disk('local')->put("public/photo/$mineral->id/$i.jpeg",$file);
               $i++;
            }
        }
        


        $territories = $request->input('territories');

        $mineralsOfTerritory =  MineralTerritory::where('id_mineral',$id_mineral)->get();
        foreach($mineralsOfTerritory as $minerals)
        {
            $mineral->delete();
            $mineral->save();
        }

        foreach($territories as $id_territory)
        {
            $m_t = new MineralTerritory();
            $m_t->id_territory = $id_territory;
            $m_t->id_mineral = $mineral->id;
            $m_t->save();
        }
         

        return response()->json(Minerals::where('id',$mineral->id)->first()); 
    }  
    function getStringBetween($str,$from,$to)
    {
        $sub = substr($str, strpos($str,$from)+strlen($from),strlen($str));
        return substr($sub,0,strpos($sub,$to));
    }
}
