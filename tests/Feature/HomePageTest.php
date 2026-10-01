<?php

namespace Tests\Feature;

use Tests\TestCase;

class HomePageTest extends TestCase
{
    public function test_home_page_is_available(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('REALIFICATION')
            ->assertSee('Navigasi utama')
            ->assertSee('Menyiapkan ruang belajar')
            ->assertViewIs('welcome');
    }

    public function test_unknown_page_uses_the_custom_not_found_view(): void
    {
        $this->get('/halaman-yang-tidak-ada')
            ->assertNotFound()
            ->assertSee('Halaman tidak ditemukan')
            ->assertSee('Kembali ke Dashboard');
    }
}
