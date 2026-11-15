package com.kredo.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Titik awal (Entry Point) aplikasi backend Kredo.
 * Anotasi @SpringBootApplication secara otomatis menyalakan:
 * 1. @Configuration: Membaca file konfigurasi (application.yml).
 * 2. @EnableAutoConfiguration: Mengonfigurasi database dan server web otomatis.
 * 3. @ComponentScan: Mencari semua class Controller, Service, dan Repository di
 * paket ini.
 */
@SpringBootApplication
public class KredoApplication {

    public static void main(String[] args) {
        SpringApplication.run(KredoApplication.class, args);
    }
}