<?php

namespace App\Console\Commands;

use App\Models\Location;
use Illuminate\Console\Command;

class DeactivateExpiredLocations extends Command
{
    protected $signature = 'locations:deactivate-expired';
    protected $description = 'Deactivate locations whose end time has passed';

    public function handle()
    {
        Location::where('is_active', true)
            ->whereNotNull('end_time')
            ->where('end_time', '<=', now())
            ->update(['is_active' => false]);

        $this->info('Expired locations deactivated.');
    }
}
