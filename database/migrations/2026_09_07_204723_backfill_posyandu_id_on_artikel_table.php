<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('artikel')
            ->whereNull('posyandu_id')
            ->orderBy('id')
            ->chunkById(100, function ($artikels) {
                foreach ($artikels as $artikel) {
                    $posyanduId = DB::table('users')
                        ->where('id', $artikel->penulis_id)
                        ->value('posyandu_id');

                    if ($posyanduId !== null) {
                        DB::table('artikel')
                            ->where('id', $artikel->id)
                            ->update([
                                'posyandu_id' => $posyanduId
                            ]);
                    }
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
