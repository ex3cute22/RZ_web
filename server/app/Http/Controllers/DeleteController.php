<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Stones;
use App\Models\Minerals;
use App\Models\Territories;
use App\Models\MineralTerritory;
use Illuminate\Support\Facades\Storage;

class DeleteController extends Controller
{
    public function deleteStones(Request $request)
    {
        $id_stone = $request->input('id_stone');
        $stone = Stones::where('id',$id_stone)->first();
        $stone->delete();
        
        return response()->json(Stones::all()); 
    }

    public function deleteTerritories(Request $request)
    {
        $id_territory = $request->input('id_territory');
        
        $territory = Territories::where('id',$id_territory)->first();
        $territory->delete();
        
        return response()->json(Territories::all()); 
    }


    public function deleteMinerals(Request $request)
    {

        $id_mineral = $request->input('id_mineral');
        
        Storage::deleteDirectory("public/photo/$id_mineral");
        $mineral = Minerals::where('id',$id_mineral)->first();
        $mineral->delete();
        
    }
}
