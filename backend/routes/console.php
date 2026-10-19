<?php
use Illuminate\Support\Facades\Artisan;
Artisan::command('about:project', function () { $this->comment('Atlas Voyages API'); })->purpose('Affiche les informations du projet');
